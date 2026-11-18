// Datafy mark: SIM silhouette with a "D" built from a bar + two signal arcs
function dfMark(size, opts={}){
  const id='g'+Math.random().toString(36).slice(2,7);
  const ink=opts.ink||'#fff';
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#7B5CFF"/><stop offset=".55" stop-color="#4E8BFF"/><stop offset="1" stop-color="#22F2C4"/></linearGradient></defs>
  <path d="M34 8H78A12 12 0 0 1 90 20V80A12 12 0 0 1 78 92H22A12 12 0 0 1 10 80V32Z" fill="${opts.flat||'url(#'+id+')'}"/>
  <g fill="${ink}" fill-opacity=".22"><rect x="70" y="20" width="10" height="5" rx="2.5"/><rect x="70" y="30" width="10" height="5" rx="2.5"/><rect x="70" y="75" width="10" height="5" rx="2.5"/></g>
  <g fill="none" stroke="${ink}" stroke-linecap="round" stroke-width="7.5">
    <path d="M30 31V77"/>
    <path d="M30 43A11 11 0 0 1 30 65"/>
    <path d="M30 31A23 23 0 0 1 30 77"/>
  </g>
  <circle cx="35" cy="54" r="3.6" fill="${ink}"/>
</svg>`;
}
function dfLogo(h, opts={}){
  const c=opts.text||'#fff', sub=opts.sub||'#22F2C4';
  return `<div style="display:inline-flex;align-items:center;gap:${h*.22}px;direction:rtl">
   ${dfMark(h,opts)}
   <div style="display:flex;flex-direction:column;line-height:1">
     <span style="font-family:Alexandria;font-weight:900;font-size:${h*.62}px;color:${c};letter-spacing:-.01em">داتفاي</span>
     <span style="font-family:'Readex Pro';font-weight:600;font-size:${h*.19}px;color:${sub};letter-spacing:.3em;margin-top:${h*.3}px;direction:ltr;text-align:right">DATAFY eSIM</span>
   </div></div>`;
}
