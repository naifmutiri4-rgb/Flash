import openpyxl, json, re
wb=openpyxl.load_workbook('/root/.claude/uploads/1d4e8253-29da-5269-a524-5b86175b747f/7b9b8d3f-SIM_PACKGE_AND_PRICE.xlsx',data_only=True)
OPS={'MOBILY':('mobily','موبايلي'),'SAWA':('sawa','سوا'),'SALAM':('salam','سلام'),'REDBULL':('redbull','ريد بُل موبايل'),'ZAIN':('zain','زين'),'LEBARA':('lebara','ليبارا')}
GROUPS={'DATA PACKAGES':'باقات البيانات','PLEX PLUS PACKAGES':'باقات فليكس بلس','PREPAID BUNDLES':'باقات مسبقة الدفع',
'LOCAL OFFER BUNDLES':'باقات محلية','INTERNATIONAL OFFER BUNDLES':'باقات دولية','QUICKNET OFFER BUNDLES':'باقات كويك نت',
'SALAM SOLO PACKEGE':'باقات سولو','FLEX MIN':'باقات فليكس','DATA    ONLY':'باقات بيانات فقط','MAZAJI PLANS':'باقات مزاجي',
'FLEX PLANS':'باقات فليكس','DATA PLANS':'باقات البيانات','ZAIN FLEX':'باقات فليكس','ZAIN SHABAB':'باقات شباب','ZAIN VISITOR':'باقات الزوار',
'DATA PACKEGE':'باقات البيانات','YELLAH BUNDLES':'باقات يلّا','FLEX BUNDLES':'باقات فليكس','DATA ONLY':'باقات بيانات فقط'}
def s(x): return '' if x is None else str(x).strip()
def gb(t):
    t=s(t).upper().replace('-',' ')
    if not t or t=='0' or t=='NONE': return None
    if 'UNL' in t: return 'UNL'
    m=re.search(r'(\d+(?:\.\d+)?)\s*GB',t) or re.fullmatch(r'(\d+(?:\.\d+)?)',t)
    return m.group(1) if m else None
def mins(t):
    t=s(t).upper()
    if not t or t in('NO','0','NONE'): return None
    if 'UNLI' in t or 'UNL ' in t+' ': return 'UNL'
    m=re.search(r'(\d+)',t); return m.group(1) if m else None
def scope(t):
    t=s(t).upper()
    if 'INTERNATIONAL' in t or re.search(r'\bINTER\b',t): return 'محلية ودولية' if 'LOCAL' in t else 'دولية'
    if 'STC ONLY' in t: return 'داخل شبكة stc'
    if 'NET WORK' in t: return 'محلية'
    return 'محلية'
def days(t):
    t=s(t).upper(); m=re.search(r'(\d+)',t); n=int(m.group(1))
    return n*30 if 'MONTH' in t else n
P=[]
def add(op,grp,name,data,social,mn,sc,d,price,note=''):
    if price is None: return
    P.append(dict(op=OPS[op][0],op_ar=OPS[op][1],group=GROUPS.get(grp,grp),name=name.strip(),data=data,social=social,min=mn,scope=sc,days=d,price=int(price),note=note))
for ws in wb:
    op=ws.title; grp=None
    rows=[r for r in ws.iter_rows(values_only=True) if any(c is not None and s(c) for c in r)]
    for r in rows:
        r=list(r)+[None]*6
        hdr=[s(c) for c in r if s(c)]
        if len(hdr)==1 and s(hdr[0]).upper() in [k.upper() for k in GROUPS]: grp=hdr[0]; continue
        if op=='MOBILY':
            name,desc,d,p=r[:4]; D=s(desc).upper()
            if D.startswith('UNLIMITED INTERNET'): data='UNL'
            else: data=gb(re.split(r'[+&]',D)[0])
            soc=None
            m=re.search(r'(\d+)\s*GB SOCIAL',D); soc=m.group(1) if m else ('UNL' if 'UNLIMITED SOCIAL' in D else None)
            mn=None
            if 'CALL' in D and 'UNLIMITED' in D.split('&')[-1] or 'UNLIMITED LOCAL CALL' in D: mn='UNL'
            m=re.search(r'\+\s*(\d+)\s*(LOCAL|$)',D)
            if m: mn=m.group(1)
            if 'UNLIMITED INTERNET & CALL' in D: mn='UNL'
            add(op,grp,s(name),data,soc,mn,scope(D) if mn else None,days(d),p)
        elif op=='SAWA':
            if s(r[0]).upper()=='PACKEGE NAME': grp='LOCAL OFFER BUNDLES'; continue
            name,desc,call,d,p=r[:5]; D=s(desc).upper()
            data='UNL' if 'UNLIMITED' in D else gb(D.split('+')[0])
            m=re.search(r'(\d+)\s*GB SOCIAL',D); soc=m.group(1) if m else ('UNL' if 'UNLI SOCIAL' in D else None)
            note='واتساب وخرائط بلا حدود' if 'WHATSUP' in D else ''
            nm=s(name)
            if nm.upper().startswith('QUICKNET'): nm=f'QUICKNET {s(desc)} - {s(d)}'
            add(op,grp,nm,data,soc,mins(call),scope(call) if mins(call) else None,days(d),p,note)
        elif op=='SALAM':
            name,dat,soc,mn,d,p=r[:6]
            if not s(name) and not dat: continue
            nm=s(name) or f'DATA UNLIMITED {d}D'
            add(op,grp,nm,gb(dat),gb(soc),mins(mn),'محلية' if mins(mn) else None,days(d),p)
        elif op=='REDBULL':
            name,dat,soc,mn,d,p=r[:6]
            if p is None: continue
            add(op,grp,s(name),gb(dat),gb(soc),mins(mn),scope(mn) if mins(mn) else None,days(d),p)
        elif op in('ZAIN','LEBARA'):
            name,dat,soc,mn,d,p=r[:6]
            if s(dat)=='DATA' or p is None or s(p)=='PRICE': continue
            dd=gb(dat); note=''
            if op=='LEBARA' and s(name)=='YELLAH-30': dd='1.5'; note='fixed: sheet says 105-GB'
            nm=s(name) or f'DATA {s(dat)} {s(d)}'
            if s(name)=='DATA': nm=f'DATA {s(dat)} {s(d)}'
            sc='دولية' if 'VISITOR' in nm or ('FLEX' in nm and op=='LEBARA') else 'محلية'
            add(op,grp,nm,dd,gb(soc),mins(mn),sc if mins(mn) else None,days(d),p,note)
for i,p in enumerate(P,1): p['id']=f"DF-{i:03d}"
json.dump(P,open('/home/user/Flash/datafy/src/products.json','w'),ensure_ascii=False,indent=1)
for p in P: print(p['id'],p['op'],p['group'],'|',p['name'],'|',p['data'],p['social'],p['min'],p['scope'],p['days'],p['price'],p['note'])
print(len(P))
