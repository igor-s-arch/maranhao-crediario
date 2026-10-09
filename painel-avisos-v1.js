/* Alertas de novos pré-cadastros: enquanto painel estiver aberto */
(function(){
 const css=document.createElement('style');css.textContent=`
 #notificationBell{position:relative;display:inline-flex;align-items:center;gap:7px;border:1px solid #e0e5ec;background:#f8fafc;color:#243248;border-radius:10px;padding:10px 13px;font-weight:800;font-size:12px;cursor:pointer}
 #notificationCount{display:none;background:#e92929;color:white;border-radius:999px;padding:2px 6px;font-size:10px}
 #notificationPanel{position:absolute;right:25px;top:69px;z-index:30;width:min(360px,calc(100vw - 30px));background:#fff;color:#233247;border:1px solid #e4e9f0;border-radius:14px;padding:17px;box-shadow:0 15px 50px #18253825}
 #notificationPanel[hidden]{display:none!important}\n #notificationPanel h3{margin:0 0 10px;font-size:15px}
 #notificationPanel p{font-size:12px;color:#68778a;line-height:1.5}
 #notificationPanel button{background:#ffca05;color:#141414;border:0;border-radius:9px;padding:10px;font-weight:800;cursor:pointer}
 `;document.head.appendChild(css);
 const bell=document.createElement('button');bell.id='notificationBell';bell.type='button';bell.innerHTML='🔔 Avisos <span id="notificationCount"></span>';
 const top=document.querySelector('.top-actions');if(!top)return;top.insertBefore(bell,top.firstChild);
 const panel=document.createElement('div');panel.id='notificationPanel';panel.hidden=true;panel.innerHTML='<h3>Notificações de cadastro</h3><p id="notificationMessage">Você receberá avisos de novos cadastros enquanto este painel estiver aberto.</p><button type="button" id="notificationEnable">Ativar avisos neste dispositivo</button>';
 document.querySelector('.topbar').appendChild(panel);
 let baseline=null,unread=0,checking=false;
 const count=document.getElementById('notificationCount');
 const storageKey='vem-maranhao-new-client-last-seen-v1';
 const getSeen=()=>{try{return localStorage.getItem(storageKey)}catch(e){return null}};
 const setSeen=v=>{try{localStorage.setItem(storageKey,v)}catch(e){}};
 function showCount(){count.textContent=unread>99?'99+':String(unread);count.style.display=unread?'inline':'none'}
 bell.addEventListener('click',()=>{panel.hidden=!panel.hidden;if(!panel.hidden){unread=0;showCount()}});document.addEventListener('click',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!bell.contains(e.target))panel.hidden=true});
 document.getElementById('notificationEnable').addEventListener('click',async()=>{
   if(!('Notification'in window)){alert('Este navegador não oferece notificações. Os avisos no painel continuarão funcionando.');return}
   try{const result=await Notification.requestPermission();document.getElementById('notificationMessage').textContent=result==='granted'?'Avisos ativados enquanto o painel estiver aberto.':'Permissão não concedida. Verifique as permissões do site no navegador; os avisos dentro do painel continuam disponíveis.';document.getElementById('notificationEnable').textContent=result==='granted'?'Avisos ativados ✓':'Tentar ativar avisos';if(result==='granted')document.getElementById('notificationEnable').disabled=true}catch(e){alert('Não foi possível solicitar a permissão neste navegador.')}
 });
 async function check(){
   if(checking||document.getElementById('panelScreen')?.classList.contains('hidden'))return;
   checking=true;
   try{
     const {data,error}=await db.from('pre_cadastros').select('id,created_at').order('created_at',{ascending:false}).limit(30);
     if(error||!data)return;
     const latest=data[0]?.created_at;if(!latest)return;
     const last=baseline||getSeen();
     if(!last){baseline=latest;setSeen(latest);return}
     const fresh=data.filter(x=>x.created_at>last);
     if(fresh.length){
       unread+=fresh.length;showCount();
       document.getElementById('notificationMessage').textContent=fresh.length===1?'Chegou 1 novo pré-cadastro!':'Chegaram '+fresh.length+' novos pré-cadastros!';
       if('Notification'in window&&Notification.permission==='granted'&&document.visibilityState==='visible'){
         try{new Notification('Vem ser Maranhão',{body:fresh.length===1?'Novo cliente realizou pré-cadastro.':fresh.length+' novos clientes realizaram pré-cadastro.',icon:'./icon-192.png'})}catch(e){}
       }
       if(typeof loadClients==='function')await loadClients();
     }
     baseline=latest;setSeen(latest);
   }catch(e){/* Retomar na próxima verificação */}finally{checking=false}
 }
 setInterval(check,60000);
 window.addEventListener('focus',check);
 setTimeout(check,3500);
})();
