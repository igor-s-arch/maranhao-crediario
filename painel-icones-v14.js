/* Ícones vetoriais discretos em vez de emojis, sem alterar lógica de negócio */
(function(){
 const shapes={
 users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2"/><path d="M17 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5"/>',
 file:'<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v6h5M10 13h6m-6 4h6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
 check:'<path d="m5 12 5 5L20 7"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 home:'<path d="m3 11 9-8 9 8v10H3z"/><path d="M9 21v-8h6v8"/>',
 chart:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 16v-4m5 4V8m5 8v-6"/>',
 heart:'<path d="M20 8c0 5-8 11-8 11S4 13 4 8a4 4 0 0 1 8-1 4 4 0 0 1 8 1Z"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9a7 7 0 0 1 12-3l2.5 2M18.5 15a7 7 0 0 1-12 3L4 16"/>'
 };
 const svg=name=>'<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">'+shapes[name]+'</svg>';
 const decorate=()=>{
 document.querySelectorAll('.nav-icon').forEach(el=>{if(el.dataset.corp)return;el.dataset.corp='1';el.innerHTML=svg(el.parentElement?.id==='sideEmployees'?'users':'file')});
 document.querySelectorAll('.stat-icon').forEach(el=>{if(el.dataset.corp)return;el.dataset.corp='1';el.innerHTML=svg(el.closest('.stat-approved')?'check':el.closest('.stat-rejected')?'x':el.closest('.stat-analysis')?'clock':el.closest('.stat-new')?'file':'users')});
 document.querySelectorAll('.mgmt-btn').forEach(el=>{if(el.dataset.corp)return;el.dataset.corp='1';const t=el.textContent.replace(/^[^\p{L}]+/u,'').trim();el.innerHTML=svg(/Visão/i.test(t)?'chart':/Recuperar/i.test(t)?'heart':'file')+'<span>'+t+'</span>'});
 document.querySelectorAll('.password-eye').forEach(el=>{if(el.dataset.corp)return;el.dataset.corp='1';el.innerHTML=svg('eye')});
 document.querySelectorAll('.password-clear').forEach(el=>{if(el.dataset.corp)return;el.dataset.corp='1';el.textContent='×';el.style.fontSize='18px'});
 document.querySelectorAll('.open-btn').forEach(el=>{if(el.dataset.corp)return;el.dataset.corp='1';el.textContent='Abrir cadastro'});
 const refresh=document.getElementById('refreshBtn');if(refresh&&!refresh.dataset.corp){refresh.dataset.corp='1';refresh.textContent='Atualizar lista'}
 };
 let queued=false;const observer=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})});
 observer.observe(document.body,{subtree:true,childList:true});decorate();
})();
