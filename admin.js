(function(){
  'use strict';

  // Admin authentication is handled by Cloudflare Worker.
  // Do NOT put the admin email/password in this public JavaScript file.
  const AUTH_URL = 'https://psychic-admin.albdallhbdalqwy24.workers.dev/';
  const NS = 'albdallhbdalqwy24-pixel.github.io';
  const KEY = '/psychic-chainsaw/';
  const STATS = 'https://counterapi.com/stats/' + NS + '/view/' + encodeURIComponent(KEY);

  function addCounter(){
    if(document.getElementById('siteCounterScript')) return;
    const s=document.createElement('script'); s.id='siteCounterScript'; s.async=true; s.src='https://counterapi.com/counterapi.embed.js';
    document.head.appendChild(s);
    const d=document.createElement('div'); d.className='counterapi'; d.setAttribute('ns',NS); d.setAttribute('action','view'); d.setAttribute('key',KEY); d.setAttribute('invisible','true'); d.setAttribute('noLink','true'); d.setAttribute('noCss','true'); d.style.display='none';
    document.body.appendChild(d);
  }

  function panel(){
    if(document.getElementById('ownerPanel')) return;
    const wrap=document.createElement('div'); wrap.id='ownerPanel';
    wrap.innerHTML=`<div class="op-backdrop"></div><section class="op-card" dir="rtl">
      <header><div><small>OWNER CONTROL</small><h2>لوحة التحكم</h2></div><button id="opClose">×</button></header>
      <div class="op-grid">
        <div class="op-stat"><span>👥 الزوار</span><b id="opUsers">جارٍ التحميل…</b></div>
        <div class="op-stat"><span>📊 الزيارات</span><b id="opViews">جارٍ التحميل…</b></div>
      </div>
      <div class="op-card2"><div class="op-title">🌍 إحصائيات الموقع</div><iframe id="opStats" loading="lazy" referrerpolicy="no-referrer"></iframe></div>
      <div class="op-note">الإحصائيات مجهّلة؛ لا يتم عرض عناوين IP للأفراد.</div>
    </section>`;
    document.body.appendChild(wrap);
    const style=document.createElement('style'); style.textContent=`
      #ownerPanel{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial}
      #ownerPanel .op-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(12px)}
      #ownerPanel .op-card{position:relative;width:min(900px,100%);max-height:92vh;overflow:auto;background:linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.025)),#101016;border:1px solid rgba(255,255,255,.16);border-radius:24px;padding:20px;color:#f4f4f7;box-shadow:0 30px 100px rgba(0,0,0,.8)}
      #ownerPanel header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px} #ownerPanel header h2{margin:2px 0 0;font-size:24px} #ownerPanel header small{color:#ff7777;font-weight:800;letter-spacing:1px}
      #opClose{width:38px;height:38px;border:0;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;font-size:26px;cursor:pointer}
      .op-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.op-stat{padding:18px;border-radius:18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1)}.op-stat span{display:block;color:#bdbdc8;font-size:13px}.op-stat b{display:block;font-size:28px;margin-top:6px}
      .op-card2{margin-top:14px;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.1);background:#fff}.op-title{background:#17171d;color:#fff;padding:12px 15px;font-weight:800}.op-card2 iframe{display:block;width:100%;height:500px;border:0;background:#fff}
      .op-note{margin-top:10px;color:#aaa;font-size:11px;text-align:center}.op-err{color:#ff9b9b;font-size:12px;margin-top:8px}
      @media(max-width:600px){.op-grid{grid-template-columns:1fr}.op-card2 iframe{height:460px}}
    `; document.head.appendChild(style);
    document.getElementById('opClose').onclick=()=>wrap.remove();
    wrap.querySelector('.op-backdrop').onclick=()=>wrap.remove();
    document.getElementById('opStats').src=STATS;
    fetch('https://counterapi.com/api/'+encodeURIComponent(NS)+'/view/'+encodeURIComponent(KEY)+'?readOnly=true')
      .then(r=>r.json()).then(x=>{document.getElementById('opViews').textContent=Number(x.value||0).toLocaleString('ar-SA');document.getElementById('opUsers').textContent='يظهر في تقرير الإحصائيات';})
      .catch(()=>{document.getElementById('opViews').textContent='—';document.getElementById('opUsers').textContent='—';});
  }

  async function authenticate(email, password){
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    });

    let data = {};
    try { data = await response.json(); } catch (_) {}
    return response.ok && data.ok === true;
  }

  function init(){
    addCounter();
    const email=document.getElementById('email'), subject=document.getElementById('subject'), send=document.getElementById('send');
    if(!email||!subject||!send) return;

    send.addEventListener('click',async function(e){
      const u=(email.value||'').trim();
      const p=(subject.value||'').trim();
      if(!u || !p) return;

      // The worker decides whether these credentials are valid.
      try {
        const authenticated = await authenticate(u, p);
        if(authenticated){
          e.preventDefault();
          e.stopImmediatePropagation();
          panel();
        }
      } catch (_) {
        // On authentication/network failure, leave the normal support form untouched.
      }
    },true);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
