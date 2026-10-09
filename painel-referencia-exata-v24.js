/* Referência exata v24 — monta a visão geral aprovada sem alterar regras do banco */
(function(){
'use strict';
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const nav=q('.sidebar-nav'),wrap=q('.panel-wrap'),clientsArea=q('#clientsArea'),employeesArea=q('#employeesArea'),top=q('.topbar');
if(!nav||!wrap||!clientsArea||!top)return;

const icons={
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5"/>',
 home:'<path d="m3 11 9-8 9 8v10H3z"/><path d="M9 21v-8h6v8"/>',
 file:'<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v6h5M10 13h6m-6 4h6"/>',
 check:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 6-7"/>',
 x:'<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>',
 send:'<path d="m3 11 18-8-7 18-3-7-8-3Z"/><path d="m11 14 10-11"/>',
 cart:'<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 3h3l2.5 11h10l2-7H6"/>',
 chart:'<path d="M5 20V10m7 10V4m7 16v-7"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.09A1.7 1.7 0 0 0 8 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 3.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2V9.6h.09A1.7 1.7 0 0 0 3.6 8a1.7 1.7 0 0 0-.34-1.88L3.2 6.06l2.83-2.83.06.06A1.7 1.7 0 0 0 8 3.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2h4v.09A1.7 1.7 0 0 0 15 3.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 8c.18.39.39.75.6 1 .29.35.67.56 1.1.6H21v4h-.09A1.7 1.7 0 0 0 19.4 15Z"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 store:'<path d="M4 9h16l-2-5H6L4 9Z"/><path d="M5 9v11h14V9M9 20v-6h6v6"/>'
};
const svg=name=>'<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">'+(icons[name]||icons.file)+'</svg>';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

const sideClients=q('#sideClients'),sideEmployees=q('#sideEmployees');
const findBtn=text=>qa('.sidebar-nav button').find(b=>normalize(b.textContent).includes(normalize(text)));
const overview=findBtn('Visão geral'),recovery=findBtn('Recuperar clientes'),reports=findBtn('Relatórios');

function makeNav(id,label,iconName,handler){
 let b=q('#'+id);
 if(!b){b=document.createElement('button');b.id=id;b.type='button';b.className='mgmt-btn';nav.appendChild(b)}
 b.dataset.corp='1';b.dataset.ref24='1';b.innerHTML='<span class="ref24-nav-icon">'+svg(iconName)+'</span><span>'+label+'</span>';
 b.addEventListener('click',handler);
 return b;
}
function decorateExisting(b,label,iconName){
 if(!b)return;
 b.dataset.corp='1';b.dataset.ref24='1';b.innerHTML='<span class="ref24-nav-icon">'+svg(iconName)+'</span><span>'+label+'</span>';
}
decorateExisting(overview,'Visão geral','home');
decorateExisting(sideClients,'Pré-cadastros','file');
decorateExisting(recovery,'Recuperar clientes','send');
decorateExisting(reports,'Relatórios','chart');
decorateExisting(sideEmployees,'Funcionários','users');

const approved=makeNav('ref24Approved','Aprovados','check',()=>openOldList('aprovado',approved));
const rejected=makeNav('ref24Rejected','Reprovados','x',()=>openOldList('reprovado',rejected));
const purchases=makeNav('ref24Purchases','Controle de compras','cart',()=>openOldList('',purchases,true));
const notifications=makeNav('ref24Notifications','Notificações','bell',()=>{q('#notificationBell')?.click();mark(notifications)});
const settings=makeNav('ref24SettingsNav','Configurações','gear',()=>showSettings());

const order=[overview,sideClients,approved,rejected,recovery,purchases,reports,sideEmployees,notifications,settings].filter(Boolean);
order.forEach(b=>nav.appendChild(b));
[overview,sideClients,recovery,reports,sideEmployees].filter(Boolean).forEach(b=>b.classList.add('ref24-mobile-priority'));

const foot=q('.sidebar-foot');
if(foot)foot.innerHTML='<div class="ref24-foot-brand"><span class="ref24-foot-store">'+svg('store')+'</span><div><strong>Maranhão Calçados</strong><small>AS LOJAS QUE TE VENDE FIADO!</small></div></div><div class="ref24-foot-bottom"><span>Sistema de crediário<br>Vem ser Maranhão</span><span class="ref24-version">v24</span></div>';

const hamburger=document.createElement('button');
hamburger.type='button';hamburger.className='ref24-hamburger';hamburger.setAttribute('aria-label','Abrir menu');hamburger.innerHTML=svg('menu');
top.insertBefore(hamburger,top.firstChild);
hamburger.addEventListener('click',()=>document.body.classList.toggle('ref24-menu-open'));

const desktopSearch=document.createElement('label');
desktopSearch.className='ref24-desktop-search';
desktopSearch.innerHTML=svg('search')+'<input id="ref24TopSearch" type="search" placeholder="Buscar cliente por nome, CPF, telefone ou protocolo..." aria-label="Buscar cliente">';
const mobileBrand=q('.topbar .mobile-brand');
if(mobileBrand?.nextSibling)top.insertBefore(desktopSearch,mobileBrand.nextSibling);else top.appendChild(desktopSearch);

const topActions=q('.top-actions');
const bell=q('#notificationBell');
if(bell){bell.dataset.corp='1';bell.innerHTML=svg('bell')+'<span id="notificationCount"></span>'}
const profileBox=document.createElement('div');profileBox.className='ref24-profile';
profileBox.innerHTML='<button type="button" class="ref24-profile-button" aria-label="Menu do usuário"><span class="ref24-avatar-top">'+svg('user')+'</span><span class="ref24-profile-text"><strong id="ref24ProfileName">Equipe Maranhão</strong><small id="ref24ProfileRole">Administrador</small></span><span class="chev">⌄</span></button><div class="ref24-profile-menu" hidden><button type="button" id="ref24EmployeesMenu">Funcionários</button><button type="button" id="ref24LogoutMenu">Sair</button></div>';
topActions?.appendChild(profileBox);
const profileMenu=profileBox.querySelector('.ref24-profile-menu');
profileBox.querySelector('.ref24-profile-button').onclick=e=>{e.stopPropagation();profileMenu.hidden=!profileMenu.hidden};
q('#ref24EmployeesMenu').onclick=()=>{profileMenu.hidden=true;sideEmployees?.click()};
q('#ref24LogoutMenu').onclick=()=>{profileMenu.hidden=true;q('#logoutBtn')?.click()};
document.addEventListener('click',e=>{if(!profileBox.contains(e.target))profileMenu.hidden=true;if(!e.target.closest('.ref24-more')&&!e.target.closest('.ref24-row-menu'))qa('.ref24-row-menu').forEach(m=>m.hidden=true)});

const dashboard=document.createElement('section');dashboard.id='ref24Dashboard';dashboard.className='ref24-dashboard';
dashboard.innerHTML=
'<div class="ref24-intro"><div><h1 id="ref24Greeting">Bem-vindo!</h1><p>Acompanhe os resultados do seu crediário em tempo real.</p></div><div class="ref24-today" id="ref24Today"></div></div>'+
'<div class="ref24-kpis" id="ref24Kpis"></div>'+
'<div class="ref24-mobile-search">'+svg('search')+'<input id="ref24MobileSearch" type="search" placeholder="Buscar cliente por nome, CPF..." aria-label="Buscar clientes"></div>'+
'<div class="ref24-filters"><label>Status<select id="ref24Status"><option value="">Todos os status</option><option value="novo">Novo</option><option value="em_analise">Em análise</option><option value="pendente_documentos">Pendente documentos</option><option value="aprovado">Aprovado</option><option value="reprovado">Reprovado</option><option value="finalizado">Finalizado</option></select></label><label>Situação da compra<select id="ref24Purchase"><option value="">Todas</option><option value="yes">Comprou</option><option value="no">Não comprou</option></select></label><label>Período<input type="date" id="ref24Date" aria-label="Filtrar por período"></label><button type="button" id="ref24SearchBtn">'+svg('search')+' Buscar</button></div>'+
'<div class="ref24-list-wrap"><div class="ref24-list-title"><span class="ref24-title-icon">'+svg('file')+'</span><div><h2>Lista de pré-cadastros</h2><p>Gerencie os cadastros, aprove, reprove e acompanhe a situação de compra.</p></div><button type="button" id="ref24New">＋ Novo cadastro</button></div><div id="ref24Rows"></div></div>';
wrap.appendChild(dashboard);

const settingsPage=document.createElement('section');settingsPage.id='ref24SettingsPage';settingsPage.className='ref24-settings';
settingsPage.innerHTML='<div class="ref24-settings-card"><h2>Configurações</h2><p>Atalhos do painel Vem ser Maranhão.</p><div class="ref24-settings-actions"><button type="button" class="primary" id="ref24Install">Instalar aplicativo</button><button type="button" class="dark" id="ref24SettingsLogout">Sair do painel</button></div></div>';
wrap.appendChild(settingsPage);
q('#ref24Install').onclick=()=>q('#installDesktopBtn')?.click();
q('#ref24SettingsLogout').onclick=()=>q('#logoutBtn')?.click();

let refQuery='';
let ref24OpeningFilteredList=false;
function resetOldListFilters(){
 const sf=q('#statusFilter'),pf=q('#purchaseFilter'),search=q('#searchInput');
 if(search)search.value='';
 if(sf)sf.value='';
 if(pf)pf.value='';
 if(typeof renderClients==='function')renderClients();
}
function mark(active){nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===active))}
function hideReferencePages(){dashboard.classList.remove('active');settingsPage.classList.remove('active')}
function hideOldPages(){clientsArea.classList.add('hidden');employeesArea?.classList.add('hidden');qa('.mgmt-page').forEach(p=>p.classList.remove('active'))}
function localDay(v){const d=v instanceof Date?v:new Date(v);if(Number.isNaN(+d))return'';return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
function longDate(now){return now.toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})+' - '+now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}
function waLink(phone){let d=String(phone||'').replace(/\D/g,'');if(d.length===10||d.length===11)d='55'+d;return d?'https://wa.me/'+d:''}
const ref24WhatsappSvg='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3A13 13 0 0 0 5 23.1L3.6 29 9.7 27.4A13 13 0 1 0 16 3Zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.6.9.9-3.5-.2-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.8.2-.2.3-.9 1-.9 1.2-.2.2-.4.2-.7.1-2-.9-3.3-2-4.6-4-.3-.5.3-.5.9-1.7.1-.2.1-.4 0-.6l-.9-2.2c-.2-.5-.5-.5-.8-.5h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.9 5.1.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.4-.3-.7-.5Z"/></svg>';
async function ref24CopyPhone(value,button){const text=String(value||'').trim();if(!text)return;try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);else{const input=document.createElement('textarea');input.value=text;input.style.position='fixed';input.style.opacity='0';document.body.appendChild(input);input.select();document.execCommand('copy');input.remove()}if(button){const old=button.textContent;button.textContent='Copiado';button.classList.add('copied');setTimeout(()=>{button.textContent=old;button.classList.remove('copied')},1200)}}catch(e){alert('Não foi possível copiar o telefone.')}}

async function hydrateAvatars(){
 const nodes=qa('.ref24-avatar[data-selfie]');
 await Promise.all(nodes.map(async el=>{
  const path=el.dataset.selfie;if(!path)return;
  try{
   let url=path;
   if(!/^https?:\/\//i.test(path)){const {data,error}=await db.storage.from('pre_cadastros_documentos').createSignedUrl(path,600);if(error||!data?.signedUrl)return;url=data.signedUrl}
   if(!document.body.contains(el))return;
   const img=new Image();img.alt='';img.onload=()=>{if(document.body.contains(el)){el.textContent='';el.appendChild(img)}};img.src=url;
  }catch(e){}
 }));
}

function render(){
 const now=new Date(),all=Array.isArray(clients)?clients:[];
 const fullName=String(profile?.nome||'').trim()||'Equipe Maranhão';
 q('#ref24Greeting').textContent='Bem-vindo, '+fullName+'!';
 q('#ref24ProfileName').textContent=fullName;
 q('#ref24ProfileRole').textContent=profile?.perfil==='mestre'?'Administrador':'Funcionário';
 q('#ref24EmployeesMenu').style.display=profile?.perfil==='mestre'?'':'none';
 if(sideEmployees)sideEmployees.style.display=profile?.perfil==='mestre'?'':'none';
 q('#ref24Today').innerHTML=svg('calendar')+'<div><strong>Hoje</strong><span>'+esc(longDate(now))+'</span></div>';

 const today=localDay(now);
 const total=all.length,newToday=all.filter(c=>localDay(c.created_at)===today&&c.status==='novo').length;
 const approvedN=all.filter(c=>c.status==='aprovado'||c.status==='finalizado').length,rejectedN=all.filter(c=>c.status==='reprovado').length;
 const cards=[
  ['Total de pré-cadastros',total,'Todos os cadastros','total','users'],
  ['Novos hoje',newToday,'Aguardando análise','new','file'],
  ['Aprovados',approvedN,'Clientes liberados','approved','check'],
  ['Reprovados',rejectedN,'Cadastros recusados','rejected','x']
 ];
 q('#ref24Kpis').innerHTML=cards.map(([label,value,sub,cls,ico])=>'<div class="ref24-kpi '+cls+'"><span class="ref24-kpi-icon">'+svg(ico)+'</span><div><span class="ref24-kpi-label">'+label+'</span><strong>'+value+'</strong><small>'+sub+'</small></div></div>').join('');

 const st=q('#ref24Status').value,buy=q('#ref24Purchase').value,date=q('#ref24Date').value;
 const raw=String(refQuery||'').trim().toLowerCase(),digits=raw.replace(/\D/g,'');
 const filtered=all.filter(c=>{
  const hay=[c.nome_completo,c.cpf,c.whatsapp,c.whatsapp_2,c.protocolo].map(v=>String(v||'').toLowerCase());
  const searchOk=!raw||hay.some(v=>v.includes(raw))||(digits&&hay.some(v=>v.replace(/\D/g,'').includes(digits)));
  return searchOk&&(!st||c.status===st)&&(!buy||(buy==='yes'?c.comprou===true:c.comprou!==true))&&(!date||localDay(c.created_at)===date);
 });
 const rows=q('#ref24Rows');
 if(!filtered.length){rows.innerHTML='<div class="ref24-empty">Nenhum pré-cadastro encontrado.</div>';return}
 rows.innerHTML='<div class="ref24-table-head"><span></span><span>Nome</span><span>CPF</span><span>Telefone</span><span>Data</span><span>Status</span><span>Compra</span><span>Ações</span></div>'+
 filtered.slice(0,30).map(c=>{
  const name=String(c.nome_completo||'Sem nome'),initials=(name.trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('')||'CL').toUpperCase();
  const dt=new Date(c.created_at),dateTxt=Number.isNaN(+dt)?'—':dt.toLocaleDateString('pt-BR'),timeTxt=Number.isNaN(+dt)?'':dt.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  const cpf=typeof formatCPF==='function'?formatCPF(c.cpf):String(c.cpf||'—');
  const statusLabel=typeof labelStatus==='function'?labelStatus(c.status):String(c.status||'—');
  const wa=waLink(c.whatsapp),selfie=c.selfie_url||c.foto_url||'';
  return '<div class="ref24-row" data-id="'+esc(c.id)+'">'+
   '<input class="ref24-check" type="checkbox" aria-label="Selecionar '+esc(name)+'">'+
   '<div class="ref24-person"><span class="ref24-avatar"'+(selfie?' data-selfie="'+esc(selfie)+'"':'')+'>'+esc(initials)+'</span><div><strong>'+esc(name)+'</strong><small>'+esc(cpf)+'</small></div></div>'+
   '<div class="ref24-cpf">'+esc(cpf)+'</div>'+
   '<div class="ref24-wa-cell"><div class="phone-contact">'+(wa?'<a class="phone-wa-link" href="'+esc(wa)+'" target="_blank" rel="noopener" title="Abrir no WhatsApp">'+ref24WhatsappSvg+'</a>':'')+'<span class="phone-number-text" title="Selecione o número para copiar">'+esc(c.whatsapp||'—')+'</span>'+(c.whatsapp?'<button type="button" class="phone-copy-btn" data-copy-phone="'+esc(c.whatsapp)+'" title="Copiar telefone">⧉</button>':'')+'</div></div>'+
   '<div class="ref24-date"><span>'+esc(dateTxt)+'</span><small>'+esc(timeTxt)+'</small></div>'+
   '<div class="ref24-status-cell"><span class="ref24-pill '+esc(c.status)+'">'+esc(statusLabel)+'</span></div>'+
   '<div class="ref24-purchase-cell"><select class="ref24-purchase '+(c.comprou===true?'':'no')+'" data-purchase-id="'+esc(c.id)+'" aria-label="Situação da compra"><option value="false">Não comprou</option><option value="true">Comprou</option></select></div>'+
   '<div class="ref24-actions"><button type="button" class="ref24-open" data-open-id="'+esc(c.id)+'">'+svg('eye')+' Abrir</button><button type="button" class="ref24-more" aria-label="Mais ações">⋮</button><div class="ref24-row-menu" hidden><button type="button" data-menu-open="'+esc(c.id)+'">Abrir cadastro</button>'+(wa?'<a href="'+esc(wa)+'" target="_blank" rel="noopener">Chamar no WhatsApp</a>':'')+'</div></div>'+
  '</div>';
 }).join('');

 filtered.slice(0,30).forEach(c=>{const s=rows.querySelector('[data-purchase-id="'+CSS.escape(String(c.id))+'"]');if(s)s.value=c.comprou===true?'true':'false'});
 qa('#ref24Rows [data-open-id]').forEach(b=>b.onclick=()=>openClient(b.dataset.openId));
 qa('#ref24Rows [data-menu-open]').forEach(b=>b.onclick=()=>openClient(b.dataset.menuOpen));
 qa('#ref24Rows .ref24-more').forEach(b=>b.onclick=e=>{e.stopPropagation();const menu=b.nextElementSibling;qa('.ref24-row-menu').forEach(m=>{if(m!==menu)m.hidden=true});menu.hidden=!menu.hidden});
 qa('#ref24Rows .phone-copy-btn').forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();ref24CopyPhone(btn.dataset.copyPhone,btn)});
 qa('#ref24Rows .ref24-purchase').forEach(select=>select.addEventListener('change',async e=>{
  e.stopPropagation();const c=clients.find(x=>String(x.id)===String(select.dataset.purchaseId));if(!c)return;
  const old=c.comprou===true,next=select.value==='true';if(old===next)return;
  select.disabled=true;
  try{const {error}=await db.from('pre_cadastros').update({comprou:next}).eq('id',c.id).select('id').single();if(error)throw error;c.comprou=next;render()}
  catch(err){select.value=old?'true':'false';select.disabled=false;alert('Não foi possível salvar a situação da compra.')}
 }));
 hydrateAvatars();
}

function showHome(){
 hideOldPages();settingsPage.classList.remove('active');dashboard.classList.add('active');mark(overview);document.body.classList.remove('ref24-menu-open');render();
}
function openOldList(status,button,purchaseOnly){
 hideReferencePages();
 ref24OpeningFilteredList=true;
 sideClients?.click();
 ref24OpeningFilteredList=false;
 const search=q('#searchInput');if(search)search.value='';
 const sf=q('#statusFilter');if(sf)sf.value=status||'';
 const pf=q('#purchaseFilter');if(pf)pf.value='';
 if(typeof renderClients==='function')renderClients();
 mark(button||sideClients);document.body.classList.remove('ref24-menu-open');
}
function showSettings(){
 hideOldPages();dashboard.classList.remove('active');settingsPage.classList.add('active');mark(settings);document.body.classList.remove('ref24-menu-open');
}

overview?.addEventListener('click',showHome);
sideClients?.addEventListener('click',()=>{hideReferencePages();if(!ref24OpeningFilteredList)resetOldListFilters();mark(sideClients);document.body.classList.remove('ref24-menu-open')});
recovery?.addEventListener('click',()=>{hideReferencePages();mark(recovery);document.body.classList.remove('ref24-menu-open')});
reports?.addEventListener('click',()=>{hideReferencePages();mark(reports);document.body.classList.remove('ref24-menu-open')});
sideEmployees?.addEventListener('click',()=>{hideReferencePages();mark(sideEmployees);document.body.classList.remove('ref24-menu-open')});

function setQuery(v,source){
 refQuery=v||'';
 const topInput=q('#ref24TopSearch'),mobileInput=q('#ref24MobileSearch');
 if(source!=='top'&&topInput)topInput.value=refQuery;if(source!=='mobile'&&mobileInput)mobileInput.value=refQuery;
 if(!dashboard.classList.contains('active'))showHome();else render();
}
q('#ref24TopSearch').addEventListener('input',e=>setQuery(e.target.value,'top'));
q('#ref24MobileSearch').addEventListener('input',e=>setQuery(e.target.value,'mobile'));
['ref24Status','ref24Purchase','ref24Date'].forEach(id=>q('#'+id).addEventListener('change',render));
q('#ref24SearchBtn').onclick=render;
q('#ref24New').onclick=()=>window.open('./index.html?origem=painel','_blank','noopener');

const previousEnter=enterPanel;
enterPanel=async function(){
 await previousEnter();
 if(q('#panelScreen')?.classList.contains('hidden'))return;
 showHome();
};
const previousLoad=loadClients;
loadClients=async function(){
 await previousLoad();
 if(dashboard.classList.contains('active'))render();
};
})();