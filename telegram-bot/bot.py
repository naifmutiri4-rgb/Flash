"""
بوت تيليقرام لتحليل تقارير الإعلانات باستخدام Claude.

أرسل للبوت: نص، صورة (لقطة شاشة من مدير الإعلانات)، ملف CSV / Excel / PDF / TXT
وسيرد عليك بتحليل وتوصيات بالعربي. يحتفظ بسياق المحادثة لكل مستخدم
حتى تقدر تسأل أسئلة متابعة. /new يبدأ محادثة جديدة.
"""

import base64
import io
import logging
import os

import anthropic
import pandas as pd
from telegram import Update
from telegram.constants import ChatAction
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
)

logging.basicConfig(
    format="%(asctime)s %(levelname)s %(name)s: %(message)s", level=logging.INFO
)
logging.getLogger("httpx").setLevel(logging.WARNING)
log = logging.getLogger("ads-bot")

TELEGRAM_BOT_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
MODEL = os.environ.get("CLAUDE_MODEL", "claude-opus-5-5")
ALLOWED_USER_IDS = {
    int(x) for x in os.environ.get("ALLOWED_USER_IDS", "").replace(" ", "").split(",") if x
}
MAX_HISTORY_TURNS = 10  # عدد الرسائل (سؤال+جواب) المحفوظة لكل مستخدم
MAX_TABLE_CHARS = 400_000  # حد حجم الجدول المرسل لـ Claude
TELEGRAM_LIMIT = 4000

SYSTEM_PROMPT = """أنت محلل إعلانات رقمية خبير (تيك توك، سناب شات، ميتا، قوقل، إكس) تعمل لصاحب متجر إلكتروني سعودي.
المستخدم يرسل لك تقارير إعلاناته (أرقام، جداول، لقطات شاشة، ملفات) وأنت تحللها.

عند تحليل أي تقرير:
1. ملخص سريع: الصرف، الظهور، النقرات، CTR، CPC، CPM، التحويلات، تكلفة التحويل (CPA)، العائد على الإنفاق (ROAS) — ما هو متوفر فقط، ولا تخترع أرقاماً غير موجودة.
2. أفضل وأسوأ الحملات / المجموعات / الإعلانات مع السبب.
3. المشاكل الواضحة (إرهاق إعلاني، CPM مرتفع، CTR ضعيف، تحويلات قليلة رغم النقرات... إلخ).
4. توصيات عملية ومحددة: ماذا يوقف، ماذا يزيد ميزانيته، ماذا يختبر.

اكتب بالعربية بلهجة واضحة ومختصرة. الرد سيُعرض في تيليقرام كنص عادي: لا تستخدم جداول Markdown ولا ** أو #؛
استخدم سطوراً قصيرة ورموز تعبيرية بسيطة (📊 ✅ ⚠️ 💡) وشرطات للقوائم.
إذا كانت البيانات ناقصة أو غير واضحة، قل ذلك واطلب ما تحتاجه."""

client = anthropic.AsyncAnthropic()

# history[user_id] = list of message params
history: dict[int, list] = {}


def is_allowed(update: Update) -> bool:
    user = update.effective_user
    return bool(user) and (not ALLOWED_USER_IDS or user.id in ALLOWED_USER_IDS)


async def send_long(update: Update, text: str) -> None:
    """تيليقرام يقبل 4096 حرف كحد أقصى للرسالة، نقسّم الرد عند الحاجة."""
    while text:
        if len(text) <= TELEGRAM_LIMIT:
            chunk, text = text, ""
        else:
            cut = text.rfind("\n", 0, TELEGRAM_LIMIT)
            cut = cut if cut > 0 else TELEGRAM_LIMIT
            chunk, text = text[:cut], text[cut:].lstrip("\n")
        await update.message.reply_text(chunk)


def table_to_text(data: bytes, filename: str) -> str:
    name = filename.lower()
    if name.endswith(".csv"):
        frames = {"CSV": pd.read_csv(io.BytesIO(data))}
    else:
        frames = pd.read_excel(io.BytesIO(data), sheet_name=None)
    parts = []
    for sheet, df in frames.items():
        df = df.dropna(how="all").dropna(axis=1, how="all")
        parts.append(f"### ورقة: {sheet} ({len(df)} صف)\n{df.to_csv(index=False)}")
    return "\n\n".join(parts)


async def ask_claude(user_id: int, content: list) -> str:
    msgs = history.setdefault(user_id, [])
    msgs.append({"role": "user", "content": content})

    try:
        response = await client.beta.messages.create(
            model=MODEL,
            max_tokens=16000,
            system=SYSTEM_PROMPT,
            thinking={"type": "adaptive"},
            output_config={"effort": "medium"},
            # إذا رفض النموذج الطلب لسبب أمني، يعيد المحاولة تلقائياً على نموذج بديل
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            messages=msgs,
        )
    except anthropic.RateLimitError:
        msgs.pop()
        return "⏳ ضغط كبير على الخدمة حالياً، جرّب بعد دقيقة."
    except anthropic.APIStatusError as e:
        msgs.pop()
        log.exception("Claude API error")
        return f"⚠️ صار خطأ من Claude ({e.status_code}). جرّب مرة ثانية أو أرسل /new."
    except anthropic.APIConnectionError:
        msgs.pop()
        return "⚠️ تعذّر الاتصال بـ Claude، جرّب بعد قليل."

    if response.stop_reason == "refusal":
        msgs.pop()
        return "⚠️ لم أستطع معالجة هذا الطلب. جرّب صياغة مختلفة."

    # نحفظ الرد كاملاً (مع كتل التفكير) حتى تشتغل أسئلة المتابعة بشكل صحيح
    msgs.append({"role": "assistant", "content": response.content})

    # نقص السجل القديم (نحذف من البداية أزواج سؤال/جواب)
    while len(msgs) > MAX_HISTORY_TURNS * 2:
        del msgs[:2]

    text = "".join(b.text for b in response.content if b.type == "text").strip()
    if response.stop_reason == "max_tokens":
        text += "\n\n(الرد طويل وانقطع — اطلب مني أكمل.)"
    return text or "لم يصلني رد، جرّب مرة ثانية."


async def handle(update: Update, content: list) -> None:
    await update.message.chat.send_action(ChatAction.TYPING)
    reply = await ask_claude(update.effective_user.id, content)
    await send_long(update, reply)


# ---------- Handlers ----------

async def start(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    if not is_allowed(update):
        await update.message.reply_text(
            f"⛔ هذا البوت خاص. رقمك: {update.effective_user.id}"
        )
        return
    await update.message.reply_text(
        "أهلاً 👋 أنا محلل إعلاناتك.\n\n"
        "أرسل لي تقرير إعلاناتك بأي شكل:\n"
        "📷 لقطة شاشة من مدير الإعلانات\n"
        "📄 ملف Excel أو CSV أو PDF\n"
        "✍️ أو الصق الأرقام نصاً\n\n"
        "وأعطيك تحليل وتوصيات. تقدر تسألني أسئلة متابعة بعدها.\n"
        "/new لبدء محادثة جديدة"
    )


async def new_chat(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    if not is_allowed(update):
        return
    history.pop(update.effective_user.id, None)
    await update.message.reply_text("🆕 تم. أرسل تقريرك الجديد.")


async def on_text(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    if not is_allowed(update):
        return
    await handle(update, [{"type": "text", "text": update.message.text}])


async def on_photo(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    if not is_allowed(update):
        return
    photo = update.message.photo[-1]  # أعلى دقة
    data = await (await photo.get_file()).download_as_bytearray()
    caption = update.message.caption or "حلّل تقرير الإعلانات في هذه الصورة."
    await handle(
        update,
        [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": base64.standard_b64encode(bytes(data)).decode(),
                },
            },
            {"type": "text", "text": caption},
        ],
    )


async def on_document(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    if not is_allowed(update):
        return
    doc = update.message.document
    name = (doc.file_name or "file").lower()
    caption = update.message.caption or "حلّل تقرير الإعلانات هذا."

    if doc.file_size and doc.file_size > 20 * 1024 * 1024:
        await update.message.reply_text("⚠️ الملف أكبر من 20MB، تيليقرام ما يسمح للبوت بتحميله.")
        return

    data = bytes(await (await doc.get_file()).download_as_bytearray())

    if name.endswith((".csv", ".xlsx", ".xls")):
        try:
            table = table_to_text(data, name)
        except Exception:
            log.exception("table parse failed")
            await update.message.reply_text("⚠️ ما قدرت أقرأ الملف. تأكد إنه CSV أو Excel سليم.")
            return
        if len(table) > MAX_TABLE_CHARS:
            await update.message.reply_text(
                "⚠️ الملف كبير جداً. صدّره بفترة أقصر أو بأعمدة أقل (مستوى الحملة بدل الإعلان مثلاً)."
            )
            return
        content = [{"type": "text", "text": f"ملف: {doc.file_name}\n\n{table}\n\n{caption}"}]
    elif name.endswith(".pdf"):
        content = [
            {
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": base64.standard_b64encode(data).decode(),
                },
            },
            {"type": "text", "text": caption},
        ]
    elif name.endswith((".png", ".jpg", ".jpeg", ".webp", ".gif")):
        ext = name.rsplit(".", 1)[-1]
        media = {"jpg": "image/jpeg", "jpeg": "image/jpeg"}.get(ext, f"image/{ext}")
        content = [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": media,
                    "data": base64.standard_b64encode(data).decode(),
                },
            },
            {"type": "text", "text": caption},
        ]
    elif name.endswith((".txt", ".json", ".tsv")):
        content = [
            {
                "type": "text",
                "text": f"ملف: {doc.file_name}\n\n{data.decode('utf-8', errors='replace')}\n\n{caption}",
            }
        ]
    else:
        await update.message.reply_text(
            "⚠️ نوع الملف غير مدعوم. أرسل CSV أو Excel أو PDF أو صورة أو TXT."
        )
        return

    await handle(update, content)


def main() -> None:
    if not ALLOWED_USER_IDS:
        log.warning("ALLOWED_USER_IDS فارغ — أي شخص يقدر يستخدم البوت ويصرف من رصيدك!")
    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("new", new_chat))
    app.add_handler(MessageHandler(filters.PHOTO, on_photo))
    app.add_handler(MessageHandler(filters.Document.ALL, on_document))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, on_text))
    log.info("Bot running with model %s", MODEL)
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
