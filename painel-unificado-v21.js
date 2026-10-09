/* v21 — interface unificada baseada no modelo aprovado; ações existentes preservadas */
(function(){
const nav=document.querySelector('.sidebar-nav'),wrap=document.querySelector('.panel-wrap'),area=document.getElementById('clientsArea'),top=document.querySelector('.topbar');
if(!nav||!wrap||!area||!top)return;
const clientBtn=document.getElementById('sideClients'),staffBtn=document.getElementById('sideEmployees');
const allMgmt=[...nav.querySelectorAll('.mgmt-btn')];
const overview=allMgmt.find(b=>/Visão geral/.test(b.textContent)),recovery=allMgmt.find(b=>/Recuperar/.test(b.textContent)),reports=allMgmt.find(b=>/Relatórios/.test(b.textContent));
const label=(s)=>String(s||'').replace(/[^\wÀ-ÿ ]/g,'').trim();
const make=(name,icon,fn)=>{const b=document.createElement('button');b.type='button';b.className='mgmt-btn v21-nav';b.innerHTML='<span class="v21-nav-icon" aria-hidden="true">'+icon+'</span><span>'+name+'</span>';b.addEventListener('click',()=>fn(b));return b};
const approved=make('Aprovados','✓',b=>openList('aprovado',b)),rejected=make('Reprovados','✕',b=>openList('reprovado',b)),purchases=make('Controle de compras','▣',b=>openList('',b));
const order=[overview,clientBtn,approved,rejected,recovery,purchases,reports,staffBtn].filter(Boolean);order.forEach(b=>nav.appendChild(b));
const activate=b=>nav.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));
const oldClientClick=()=>{document.querySelectorAll('.mgmt-page').forEach(p=>p.classList.remove('active'));document.getElementById('employeesArea')?.classList.add('hidden');area.classList.remove('hidden')};
function openList(status,b){clientBtn?.click();oldClientClick();const sf=document.getElementById('statusFilter'),pf=document.getElementById('purchaseFilter');if(sf){sf.value=status;sf.dispatchEvent(new Event('change',{bubbles:true}))}if(pf){pf.value='';pf.dispatchEvent(new Event('change',{bubbles:true}))}activate(b)}
clientBtn?.addEventListener('click',()=>{oldClientClick();const sf=document.getElementById('statusFilter');if(sf){sf.value='';sf.dispatchEvent(new Event('change',{bubbles:true}))}activate(clientBtn)});
[overview,recovery,reports,staffBtn].forEach(b=>b?.addEventListener('click',()=>activate(b)));
const logo=document.querySelector('.sidebar-brand img')?.getAttribute('src')||'';
const header=document.createElement('div');header.className='v21-top';header.innerHTML='<button type="button" class="v21-hamburger" aria-label="Ir para pré-cadastros">☰</button><label class="v21-top-search"><span>⌕</span><input type="search" placeholder="Buscar cliente por nome, CPF, telefone ou protocolo..."></label><div class="v21-identity"><div class="v21-avatar">●</div><div><strong id="v21ProfileName">Equipe Maranhão</strong><small id="v21ProfileRole">Gestão de crediário</small></div></div>';
top.insertBefore(header,top.firstChild);header.querySelector('.v21-hamburger').onclick=()=>clientBtn?.click();
header.querySelector('input').addEventListener('input',e=>{openList('',clientBtn);const search=document.getElementById('searchInput');if(search){search.value=e.target.value;search.dispatchEvent(new Event('input',{bubbles:true}))}});
const dashboard=document.createElement('section');dashboard.className='v21-dashboard';dashboard.id='v21Dashboard';
dashboard.innerHTML='<div class="v21-intro"><div><h1 id="v21Greeting">Bem-vindo!</h1><p>Acompanhe os resultados do seu crediário em tempo real.</p></div><div class="v21-date" id="v21Date"></div></div><div class="v21-kpis" id="v21Kpis"></div><div class="v21-filters"><label>Status<select id="v21Status"><option value="">Todos os status</option><option value="novo">Novos</option><option value="em_analise">Em análise</option><option value="aprovado">Aprovados</option><option value="reprovado">Reprovados</option></select></label><label>Situação da compra<select id="v21Purchase"><option value="">Todas</option><option value="yes">Comprou</option><option value="no">Não comprou</option></select></label><label>Período<input id="v21Period" type="date"></label><button id="v21Search" type="button">⌕ &nbsp; Buscar</button></div><div class="v21-list-title"><div class="v21-title-icon">▤</div><div><h2>Lista de pré-cadastros</h2><p>Gerencie os cadastros, aprove, reprove e acompanhe a situação de compra.</p></div><button type="button" id="v21SeeAll">Ver todos</button></div><div id="v21Rows" class="v21-rows"></div>';
wrap.appendChild(dashboard);
dashboard.querySelector('#v21SeeAll').onclick=()=>openList('',clientBtn);
dashboard.querySelector('#v21Search').onclick=()=>renderDashboard();
dashboard.querySelector('#v21Status').onchange=renderDashboard;
dashboard.querySelector('#v21Purchase').onchange=renderDashboard;
dashboard.querySelector('#v21Period').onchange=renderDashboard;
function renderDashboard(){
const now=new Date();dashboard.querySelector('#v21Date').textContent='▦ Hoje · '+now.toLocaleDateString('pt-BR')+' · '+now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
const name=String(profile?.nome||'').trim().split(/\s+/)[0]||'';
dashboard.querySelector('#v21Greeting').textContent='Bem-vindo'+(name?', '+name:'')+'!';
header.querySelector('#v21ProfileName').textContent=profile?.nome||'Equipe Maranhão';
header.querySelector('#v21ProfileRole').textContent=profile?.perfil==='mestre'?'Administrador':'Funcionário';
const data=Array.isArray(clients)?clients:[],today=now.toLocaleDateString('en-CA');
const cards=[['Total de pré-cadastros',data.length,'Todos os cadastros','total','♙'],['Novos hoje',data.filter(c=>new Date(c.created_at).toLocaleDateString('en-CA')===today).length,'Aguardando análise','new','▤'],['Aprovados',data.filter(c=>c.status==='aprovado'||c.status==='finalizado').length,'Clientes liberados','approved','✓'],['Reprovados',data.filter(c=>c.status==='reprovado').length,'Cadastros recusados','rejected','✕']];
dashboard.querySelector('#v21Kpis').innerHTML=cards.map(([label,value,sub,cls,icon])=>'<div class="v21-kpi '+cls+'"><div class="v21-kpi-icon">'+icon+'</div><div><span>'+label+'</span><strong>'+value+'</strong><small>'+sub+'</small></div></div>').join('');
const sf=dashboard.querySelector('#v21Status').value,pf=dashboard.querySelector('#v21Purchase').value,date=dashboard.querySelector('#v21Period').value;
const filtered=data.filter(c=>(!sf||c.status===sf)&&(!pf||(pf==='yes'?c.comprou===true:c.comprou!==true))&&(!date||String(c.created_at||'').slice(0,10)===date));
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rows=dashboard.querySelector('#v21Rows');rows.innerHTML='<div class="v21-table-head"><span>Nome</span><span>CPF</span><span>Telefone</span><span>Data</span><span>Status</span><span>Compra</span><span>Ações</span></div>'+filtered.slice(0,20).map(c=>{const initials=String(c.nome_completo||'C').split(' ').slice(0,2).map(x=>x[0]).join('');return '<div class="v21-row"><div class="v21-person"><span class="v21-person-icon">'+escape(initials)+'</span><div><strong>'+escape(c.nome_completo)+'</strong><small>'+escape(c.protocolo)+'</small></div></div><div class="v21-cpf">'+escape(typeof formatCPF==='function'?formatCPF(c.cpf):'')+'</div><div class="v21-phone">'+escape(c.whatsapp)+'</div><div class="v21-rowdate">'+new Date(c.created_at).toLocaleDateString('pt-BR')+'</div><div><span class="v21-pill '+escape(c.status)+'">'+escape(typeof labelStatus==='function'?labelStatus(c.status):c.status)+'</span></div><div class="v21-buy '+(c.comprou?'yes':'no')+'">'+(c.comprou?'Comprou':'Não comprou')+'</div><div><button type="button" class="v21-open" data-id="'+escape(c.id)+'">◉ Abrir</button></div></div>'}).join('');
rows.querySelectorAll('.v21-open').forEach(b=>b.onclick=()=>openClient(b.dataset.id));
if(!filtered.length)rows.innerHTML='<p class="v21-noresults">Nenhum cadastro encontrado.</p>';
}
function showDashboard(){area.classList.add('hidden');document.getElementById('employeesArea')?.classList.add('hidden');document.querySelectorAll('.mgmt-page').forEach(x=>x.classList.remove('active'));dashboard.classList.add('active');activate(overview);renderDashboard()}
overview?.addEventListener('click',showDashboard);
for(const b of [clientBtn,recovery,reports,staffBtn,approved,rejected,purchases])b?.addEventListener('click',()=>dashboard.classList.remove('active'));
const oldEnter=enterPanel;enterPanel=async function(){await oldEnter();if(document.getElementById('panelScreen').classList.contains('hidden'))return;staffBtn.style.display=profile?.perfil==='mestre'?'':'none';showDashboard()};
const oldLoad=loadClients;loadClients=async function(){await oldLoad();if(dashboard.classList.contains('active'))renderDashboard()};
})();
