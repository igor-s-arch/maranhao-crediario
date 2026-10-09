/* Prévia isolada do layout aprovado. Não altera banco nem ações do painel. */
(function(){
const $=s=>document.querySelector(s);
const nav=$('.sidebar-nav'),area=$('#clientsArea'),stats=$('#stats'),filters=$('#clientsArea .filters'),list=$('#clientList');
if(!nav||!area)return;
const overview=[...nav.querySelectorAll('.mgmt-btn')].find(b=>/Visão geral/.test(b.textContent));
const clientsButton=$('#sideClients');
const make=(title,icon,action)=>{const b=document.createElement('button');b.type='button';b.className='preview-nav mgmt-btn';b.innerHTML='<span class="preview-symbol">'+icon+'</span><span>'+title+'</span>';b.addEventListener('click',()=>action(b));return b};
const goList=(status,b)=>{clientsButton.click();const sf=$('#statusFilter');sf.value=status;sf.dispatchEvent(new Event('change',{bubbles:true}));mark(b)};
const approved=make('Aprovados','✓',b=>goList('aprovado',b));
const rejected=make('Reprovados','✕',b=>goList('reprovado',b));
const purchases=make('Controle de compras','▣',b=>goList('',b));
const recovery=[...nav.querySelectorAll('.mgmt-btn')].find(b=>/Recuperar/.test(b.textContent));
const reports=[...nav.querySelectorAll('.mgmt-btn')].find(b=>/Relatórios/.test(b.textContent));
const employees=$('#sideEmployees');
const order=[overview,clientsButton,approved,rejected,recovery,purchases,reports,employees].filter(Boolean);
order.forEach(b=>nav.appendChild(b));
function mark(b){nav.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b))}
clientsButton.addEventListener('click',()=>{mark(clientsButton);const sf=$('#statusFilter');sf.value='';sf.dispatchEvent(new Event('change',{bubbles:true}))});
[overview,recovery,reports,employees].forEach(b=>b?.addEventListener('click',()=>mark(b)));
const header=$('.topbar'),left=document.createElement('div');left.className='preview-top-search';left.innerHTML='<span>⌕</span><input placeholder="Buscar cliente por nome, CPF, telefone ou protocolo..." aria-label="Buscar cliente">';
header.insertBefore(left,header.firstChild);
left.querySelector('input').addEventListener('input',e=>{clientsButton.click();$('#searchInput').value=e.target.value;$('#searchInput').dispatchEvent(new Event('input',{bubbles:true}))});
const home=document.createElement('section');home.id='previewHome';home.className='mgmt-page';
home.innerHTML='<div class="preview-intro"><div><h1 id="previewGreeting">Bem-vindo!</h1><p>Acompanhe os resultados do seu crediário em tempo real.</p></div><div id="previewToday"></div></div><div class="preview-kpis" id="previewKpis"></div><div class="preview-filter"><label>Status<select id="previewStatus"><option value="">Todos os status</option><option value="novo">Novo</option><option value="aprovado">Aprovado</option><option value="reprovado">Reprovado</option></select></label><label>Situação da compra<select id="previewPurchase"><option value="">Todas</option><option value="yes">Comprou</option><option value="no">Não comprou</option></select></label><label>Período<input type="date" id="previewDate"></label><button type="button" id="previewSearch">⌕ Buscar</button></div><div class="preview-list-head"><span class="preview-list-icon">▤</span><div><h2>Lista de pré-cadastros</h2><p>Gerencie os cadastros, aprove, reprove e acompanhe a situação de compra.</p></div><button type="button" id="previewSeeAll">Ver todos</button></div><div id="previewRows"></div>';
$('.panel-wrap').appendChild(home);
function escape(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function localDay(s){const d=new Date(s);return Number.isNaN(+d)?'':d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function render(){
const now=new Date(),all=Array.isArray(clients)?clients:[];
$('#previewGreeting').textContent='Bem-vindo'+(profile?.nome?', '+profile.nome.split(' ')[0]:'')+'!';
$('#previewToday').textContent='▦ Hoje · '+now.toLocaleDateString('pt-BR')+' · '+now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
const kpis=[['Total de pré-cadastros',all.length,'total','♙'],['Novos hoje',all.filter(c=>localDay(c.created_at)===localDay(now)&&c.status==='novo').length,'new','▤'],['Aprovados',all.filter(c=>['aprovado','finalizado'].includes(c.status)).length,'approved','✓'],['Reprovados',all.filter(c=>c.status==='reprovado').length,'rejected','✕']];
$('#previewKpis').innerHTML=kpis.map(([name,n,cls,ico])=>'<div class="preview-kpi '+cls+'"><span class="preview-kpi-icon">'+ico+'</span><div><label>'+name+'</label><strong>'+n+'</strong></div></div>').join('');
const st=$('#previewStatus').value,buy=$('#previewPurchase').value,date=$('#previewDate').value;
const filtered=all.filter(c=>(!st||c.status===st)&&(!buy||(buy==='yes'?c.comprou===true:c.comprou!==true))&&(!date||localDay(c.created_at)===date));
$('#previewRows').innerHTML='<div class="preview-table-header"><span>Nome</span><span>CPF</span><span>Telefone</span><span>Data</span><span>Status</span><span>Compra</span><span>Ações</span></div>'+filtered.map(c=>'<div class="preview-row"><div class="preview-person"><span class="preview-avatar">'+escape(String(c.nome_completo||'C').slice(0,1))+'</span><div><strong>'+escape(c.nome_completo)+'</strong><small>'+escape(c.protocolo)+'</small></div></div><span class="preview-cpf">'+escape(formatCPF(c.cpf))+'</span><span class="preview-phone">'+escape(c.whatsapp)+'</span><span class="preview-date">'+escape(new Date(c.created_at).toLocaleDateString('pt-BR'))+'</span><span><em class="preview-pill '+escape(c.status)+'">'+escape(labelStatus(c.status))+'</em></span><span><em class="preview-pill '+(c.comprou?'bought':'not-bought')+'">'+(c.comprou?'Comprou':'Não comprou')+'</em></span><button type="button" class="preview-open" data-id="'+escape(c.id)+'">Abrir</button></div>').join('');
$('#previewRows').querySelectorAll('.preview-open').forEach(b=>b.onclick=()=>openClient(b.dataset.id));
}
function showHome(){area.classList.add('hidden');$('#employeesArea').classList.add('hidden');document.querySelectorAll('.mgmt-page').forEach(p=>p.classList.remove('active'));home.classList.add('active');mark(overview);render()}
overview?.addEventListener('click',showHome);
[clientsButton,approved,rejected,purchases,recovery,reports,employees].forEach(b=>b?.addEventListener('click',()=>home.classList.remove('active')));
$('#previewSeeAll').onclick=()=>clientsButton.click();
['previewStatus','previewPurchase','previewDate'].forEach(id=>$('#'+id).addEventListener('change',render));
$('#previewSearch').onclick=render;
const oldEnter=enterPanel;enterPanel=async function(){await oldEnter();if(!$('#panelScreen').classList.contains('hidden'))showHome()};
const oldLoad=loadClients;loadClients=async function(){await oldLoad();if(home.classList.contains('active'))render()};
})();
