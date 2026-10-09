/* v17 — componentes do layout aprovado; não modifica cadastros */
(function(){
 const nav=document.querySelector('.sidebar-nav'),wrap=document.querySelector('.panel-wrap');
 if(!nav||!wrap)return;
 const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
 const approved=c=>['aprovado','finalizado'].includes(c.status);
 const menu=document.querySelector('.topbar');
 const topLeft=document.createElement('div');topLeft.className='v17-top-left';
 topLeft.innerHTML='<button type="button" class="v17-menu" aria-label="Abrir pré-cadastros">☰</button><label class="v17-search"><span>⌕</span><input type="search" placeholder="Buscar cliente por nome, CPF, telefone ou protocolo..."></label>';
 menu.insertBefore(topLeft,menu.firstChild);
 const topSearch=topLeft.querySelector('input');
 topSearch.addEventListener('input',()=>{document.getElementById('sideClients')?.click();const field=document.getElementById('searchInput');if(field){field.value=topSearch.value;field.dispatchEvent(new Event('input',{bubbles:true}))}});
 topLeft.querySelector('button').addEventListener('click',()=>document.getElementById('sideClients')?.click());
 const overview=[...nav.querySelectorAll('.mgmt-btn')].find(b=>/Visão geral/.test(b.textContent));
 const recovery=[...nav.querySelectorAll('.mgmt-btn')].find(b=>/Recuperar/.test(b.textContent));
 const reports=[...nav.querySelectorAll('.mgmt-btn')].find(b=>/Relatórios/.test(b.textContent));
 const clientsButton=document.getElementById('sideClients'),employeesButton=document.getElementById('sideEmployees');
 const icon={overview:'⌂',clients:'▤',approved:'✓',rejected:'✕',recovery:'➤',purchases:'▣',reports:'▥',employees:'♙'};
 if(overview)overview.querySelector('span')?.replaceChildren(document.createTextNode('Visão geral'));
 const addFilter=(label,status)=>{const b=document.createElement('button');b.className='mgmt-btn';b.type='button';b.innerHTML='<span style="font-size:18px" aria-hidden="true">'+icon[label]+'</span><span>'+({approved:'Aprovados',rejected:'Reprovados'}[label])+'</span>';b.onclick=()=>{clientsButton?.click();const f=document.getElementById('statusFilter');if(f){f.value=status;f.dispatchEvent(new Event('change',{bubbles:true}))}activate(b)};return b};
 const approvedBtn=addFilter('approved','aprovado'),rejectedBtn=addFilter('rejected','reprovado');
 const purchases=document.createElement('button');purchases.type='button';purchases.className='mgmt-btn';purchases.innerHTML='<span style="font-size:18px" aria-hidden="true">▣</span><span>Controle de compras</span>';purchases.onclick=()=>{clientsButton?.click();const f=document.getElementById('purchaseFilter');if(f){f.value='';f.dispatchEvent(new Event('change',{bubbles:true}))}activate(purchases)};
 const ordered=[overview,clientsButton,approvedBtn,rejectedBtn,recovery,purchases,reports,employeesButton].filter(Boolean);
 ordered.forEach(x=>nav.appendChild(x));
 function activate(button){nav.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===button))}
 ordered.filter(x=>![approvedBtn,rejectedBtn,purchases].includes(x)).forEach(b=>b.addEventListener('click',()=>activate(b)));
 const page=document.createElement('section');page.id='v17Home';page.className='mgmt-page';
 page.innerHTML='<div class="v17-header"><h1>Bem-vindo ao Vem ser Maranhão!</h1><p>Acompanhe os resultados do seu crediário em tempo real.</p></div><div class="v17-dashboard-grid" id="v17Kpis"></div><div class="v17-section-head"><div><h2>Lista de pré-cadastros</h2><p>Gerencie os cadastros, aprovações e compras.</p></div><button type="button" class="primary small" id="v17ViewClients">Ver clientes</button></div><div class="mgmt-card" id="v17Recent"></div>';
 wrap.appendChild(page);
 document.getElementById('v17ViewClients').onclick=()=>clientsButton?.click();
 function renderHome(){
  const all=Array.isArray(clients)?clients:[],ok=all.filter(approved),no=all.filter(x=>x.status==='reprovado');
  const today=new Date().toISOString().slice(0,10),newToday=all.filter(x=>String(x.created_at||'').slice(0,10)===today).length;
  document.getElementById('v17Kpis').innerHTML=[
   ['Total de pré-cadastros',all.length,'Todos os cadastros',''],
   ['Novos hoje',newToday,'Recebidos hoje','new'],
   ['Aprovados',ok.length,'Clientes liberados','approved'],
   ['Reprovados',no.length,'Cadastros recusados','rejected']
  ].map(([name,value,sub,cls])=>'<div class="v17-kpi '+cls+'"><span>'+name+'</span><strong>'+value+'</strong><small>'+sub+'</small></div>').join('');
  document.getElementById('v17Recent').innerHTML='<h2 style="font-size:16px">Cadastros recentes</h2>'+all.slice(0,6).map(c=>'<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;border-top:1px solid #e8edf3;padding:12px 0;font-size:12px"><div><strong>'+safe(c.nome_completo||'Cliente')+'</strong><div style="color:#7b8798">'+safe(c.status||'Novo')+'</div></div><span style="font-weight:700;color:'+(c.comprou?'#078044':'#b42318')+'">'+(c.comprou?'Comprou':'Não comprou')+'</span></div>').join('');
 }
 const oldEnter=enterPanel;enterPanel=async function(){await oldEnter();showHome()};
 const oldLoad=loadClients;loadClients=async function(){await oldLoad();renderHome()};
 function showHome(){document.getElementById('clientsArea')?.classList.add('hidden');document.getElementById('employeesArea')?.classList.add('hidden');document.querySelectorAll('.mgmt-page').forEach(x=>x.classList.remove('active'));page.classList.add('active');activate(overview);renderHome()}
 if(overview){overview.onclick=showHome}
})();
