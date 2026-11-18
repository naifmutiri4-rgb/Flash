import json, hashlib
P=json.load(open('products.json'))
def d(n): return f"{n} أيام" if n<=10 else f"{n} يوم"
def pick(lst,key): return lst[int(hashlib.md5(key.encode()).hexdigest(),16)%len(lst)]
def gbt(v): return 'لا محدود' if v=='UNL' else f"{v} جيجا"
TAG={'unl':["إنترنت بلا سقف… ولا عدّاد.","انسَ جملة «خلصت الباقة» للأبد.","سرعة مفتوحة، وراحة بال كاملة."],
'big':["خزّان إنترنت كامل في جيبك.","جيجات تكفيك وتفيض عنك.","للي ما يرضى بنص الحلول."],
'mid':["التوازن المثالي بين القوة والسعر.","باقة شهرك… مضبوطة على مقاسك.","كل اللي تحتاجه، بسعر يرضيك."],
'small':["خفيفة على جيبك، ثقيلة في أدائها.","بداية ذكية بأقل تكلفة.","الأساسيات كلها… بأذكى سعر."],
'visitor':["أهلاً بك في السعودية — متصل من أول خطوة.","وصلت؟ اتصالك وصل قبلك."],
'intl':["أهلك بعيدين؟ صوتك يوصلهم.","العالم كله على بعد مكالمة."]}
import re
for p in P:
    n=p['name'].replace('PRIPAID','PREPAID')
    if re.search(r'days',n,re.I) and p['op']=='mobily': n=('DATA UNLIMITED' if p['data']=='UNL' else f"DATA {p['data']}GB")
    n=n.replace('PREPAID 360 BUNDLE FOR 12 WEEK','PREPAID 360 · 12 WEEKS').replace('QUICKNET UNLIMITED','QUICKNET UNL')
    n=re.sub(r'QUICKNET (\S+ GB|UNL) - (\d+) MONTH',lambda m:'QUICKNET '+m.group(1).replace(' ',''),n)
    n=re.sub(r'DATA (\S+)-GB (\d+)-DAYS',r'DATA \1GB',n).replace('DATA UNLIMIT ','DATA UNL ').replace('-DAYS','')
    n=re.sub(r'DATA UNLIMITED (\d+)D',r'DATA UNL',n)
    n=re.sub(r'DATA UNL \d+$','DATA UNL',n)
    p['name']=n
    data=p['data']; dn=None if data in(None,'UNL') else float(data)
    kind='visitor' if 'VISITOR' in p['name'] else 'unl' if data=='UNL' else 'big' if dn and dn>=100 else 'intl' if p['scope'] and 'دولية' in p['scope'] else 'mid' if dn and dn>=25 else 'small'
    p['kind']=kind
    feats=[]
    feats.append(('data','إنترنت',gbt(data) if data else '—'))
    if p['social']: feats.append(('social','سوشال ميديا',gbt(p['social'])))
    if p['note']=='' and False: pass
    if 'واتساب' in p['note']: feats.append(('social','واتساب وخرائط','لا محدود'))
    if p['min']: feats.append(('call','دقائق '+(p['scope'] or ''),'لا محدودة' if p['min']=='UNL' else f"{int(p['min']):,} دقيقة"))
    feats.append(('time','الصلاحية',d(p['days'])))
    p['feats']=feats
    head=('إنترنت لا محدود' if data=='UNL' else f"{gbt(data)} إنترنت")
    extra=[]
    if p['social']: extra.append('سوشال '+gbt(p['social']))
    if 'واتساب' in p['note']: extra.append('واتساب وخرائط لا محدود')
    if p['min']: extra.append('مكالمات لا محدودة' if p['min']=='UNL' else f"{int(p['min']):,} دقيقة")
    p['title']=f"شريحة إنترنت {p['op_ar']} | {p['name']} – {' + '.join([head]+extra)} | {d(p['days'])}"
    p['tagline']=pick(TAG[kind],p['id'])
    parts=[head]+extra
    body=f"{'، '.join(parts[:-1])+' و' + parts[-1] if len(parts)>1 else parts[0]}، تشتغل معك {d(p['days'])} كاملة على شبكة {p['op_ar']}."
    p['desc']=(f"{p['tagline']}\n{body}\n"
      f"التفعيل عبر نفاذ خلال دقائق، واستلامها على كيفك: استلام من فرع {p['op_ar']}، أو توصيل من فرع {p['op_ar']}، أو استبدالها بشريحة إلكترونية eSIM.\n"
      f"🔐 تفعيل بنفاذ  •  🏬 استلام من فرع {p['op_ar']}  •  🚚 توصيل من فرع {p['op_ar']}  •  📲 eSIM")
json.dump(P,open('products_full.json','w'),ensure_ascii=False,indent=1)
open('data.js','w').write('window.P='+json.dumps(P,ensure_ascii=False)+';')
for p in P[:3]+P[29:30]+P[91:92]: print(p['title']);print(p['desc']);print()
