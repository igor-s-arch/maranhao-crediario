/* v19: aplicar o modelo aprovado aos componentes REAIS do painel */
(function(){
const nav=document.querySelector('.sidebar-nav'), area=document.getElementById('clientsArea'), wrap=document.querySelector('.panel-wrap');
if(!nav||!area||!wrap)return;
const overview=[...nav.querySelectorAll('.mgmt-btn')].find(x=>/Visão geral/.test(x.textContent));
const clientsBtn=document.getElementById('sideClients');
const employeeBtn=document.getElementById('sideEmployees');
const head=area.querySelector('.heading-row'),stats=document.getElementById('stats'),filters=area.querySelector('.filters'),list=document.getElementById('clientList');
const loading=document.getElementById('loading'),empty=document.getElementById('empty');
const welcome=document.createElement('div');welcome.className='v19-welcome';
welcome.innerHTML='<div><h1>Bem-vindo ao Vem ser Maranhão!</h1><p>Acompanhe os resultados do seu crediário em tempo real.</p></div><div class="v19-today"></div>';
area.insertBefore(welcome,head);
const section=document.createElement('div');section.className='v19-list-title';
section.innerHTML='<div class="v19-list-symbol" aria-hidden="true">▤</div><div><h2>Lista de pré-cadastros</h2><p>Gerencie os cadastros, aprove, reprove e acompanhe a situação de compra.</p></div><button type="button" class="v19-new" id="v19New">+ Novo cadastro</button>';
filters.after(section);
const btn=document.getElementById('v19New');btn.addEventListener('click',()=>{const existing=document.querySelector('#clientsArea button[id*="new"],#clientsArea button[id*="New"],#clientsArea button[id*="cadastro"]');if(existing&&existing!==btn)existing.click();else document.getElementById('searchInput')?.focus()});
const search=document.getElementById('searchInput');
const searchTop=document.querySelector('.v17-search input');
if(searchTop){searchTop.addEventListener('input',()=>{clientsBtn.click();search.value=searchTop.value;search.dispatchEvent(new Event('input',{bubbles:true}))})}
const sideOrder=[overview,clientsBtn,...[...nav.querySelectorAll('.mgmt-btn')].filter(x=>/Aprovados|Reprovados|Recuperar|Controle de compras|Relatórios/.test(x.textContent)),employeeBtn].filter(Boolean);
sideOrder.forEach(x=>nav.appendChild(x));
function active(btn){nav.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===btn))}
function showClients(asHome){
document.querySelectorAll('.mgmt-page').forEach(x=>x.classList.remove('active'));
document.getElementById('employeesArea')?.classList.add('hidden');
area.classList.remove('hidden');area.classList.toggle('v19-home',!!asHome);
active(asHome?overview:clientsBtn);
renderHeader();
}
function renderHeader(){
const name=String(profile?.nome||'').trim().split(/\s+/)[0]||'';
welcome.querySelector('h1').textContent='Bem-vindo'+(name?', '+name:'')+'!';
const now=new Date();welcome.querySelector('.v19-today').textContent='▦  Hoje · '+now.toLocaleDateString('pt-BR')+' · '+now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
}
overview?.addEventListener('click',()=>showClients(true));
clientsBtn?.addEventListener('click',()=>showClients(false));
const oldEnter=enterPanel;enterPanel=async function(){await oldEnter();if(document.getElementById('panelScreen').classList.contains('hidden'))return;showClients(true)};
const oldLoad=loadClients;loadClients=async function(){await oldLoad();renderHeader()};
const oldStats=renderStats;renderStats=function(){oldStats();const all=[...stats.querySelectorAll('.stat')];const analysis=all.find(x=>/Em análise/i.test(x.textContent));if(analysis)analysis.style.display='none';const labels=['Total de pré-cadastros','Novos hoje','Aprovados','Reprovados'];const kept=all.filter(x=>x!==analysis);kept.forEach((el,i)=>{const label=el.querySelector('span');if(label)label.textContent=labels[i]||label.textContent});
const newCard=kept.find(x=>x.classList.contains('stat-new'));if(newCard){const today=new Date().toLocaleDateString('en-CA');const n=clients.filter(x=>{const d=new Date(x.created_at);return !isNaN(d)&&d.toLocaleDateString('en-CA')===today}).length;const value=newCard.querySelector('b');if(value)value.textContent=n}
};
const oldClients=renderClients;renderClients=function(){oldClients();const cards=[...list.querySelectorAll('.client-card.client-row')];cards.forEach(card=>{const person=card.querySelector('.client-person');const id=card.dataset.id;const c=clients.find(x=>String(x.id)===String(id));if(!c||!person)return;const text=person.querySelector('.client-name');if(text&&!person.querySelector('.v19-person-meta')){const meta=document.createElement('small');meta.className='v19-person-meta';meta.textContent=new Date(c.created_at).toLocaleDateString('pt-BR');text.after(meta)}});
};
const bell=document.getElementById('notificationBell');if(bell){bell.style.fontSize='12px';if(!bell.querySelector('svg')){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('width','19');svg.setAttribute('height','19');svg.innerHTML='<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" fill="none" stroke="currentColor" stroke-width="2"/>';bell.insertBefore(svg,bell.firstChild)}}
})();
