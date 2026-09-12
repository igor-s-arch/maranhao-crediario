const SUPABASE_URL='https://mcebteebdfnrksnrokvt.supabase.co';
const SUPABASE_KEY='sb_publishable_7nRIYvEhkDYvw_1oEOVtDw_2xCXnDaT';
const { createClient }=supabase;
const db=createClient(SUPABASE_URL,SUPABASE_KEY);
const $=s=>document.querySelector(s);
let clients=[];
let current=null;

async function boot(){
  const {data:{session}}=await db.auth.getSession();
  if(session) await enterPanel(); else showLogin();
}
function showLogin(){ $('#loginScreen').classList.remove('hidden'); $('#panelScreen').classList.add('hidden'); }
async function enterPanel(){
  const {data:{user}}=await db.auth.getUser();
  if(!user){showLogin();return}
  const {data:access,error}=await db.from('loja_usuarios').select('nome,ativo').eq('user_id',user.id).maybeSingle();
  if(error||!access?.ativo){ await db.auth.signOut(); $('#loginError').textContent='Este usuário não tem acesso ativo ao Painel da Loja.'; $('#loginError').classList.remove('hidden'); showLogin(); return; }
  $('#staffName').textContent=access.nome||user.email||'Funcionário';
  $('#loginScreen').classList.add('hidden'); $('#panelScreen').classList.remove('hidden');
  await loadClients();
}

$('#loginForm').addEventListener('submit',async e=>{
  e.preventDefault(); const btn=$('#loginBtn'); btn.disabled=true; btn.textContent='ENTRANDO...'; $('#loginError').classList.add('hidden');
  const {error}=await db.auth.signInWithPassword({email:$('#email').value.trim(),password:$('#password').value});
  btn.disabled=false; btn.textContent='ENTRAR';
  if(error){$('#loginError').textContent='E-mail ou senha inválidos.';$('#loginError').classList.remove('hidden');return}
  await enterPanel();
});
$('#logoutBtn').onclick=async()=>{await db.auth.signOut();location.reload()};
$('#refreshBtn').onclick=loadClients;
$('#searchInput').addEventListener('input',renderClients);
$('#statusFilter').addEventListener('change',renderClients);
$('#closeDialog').onclick=()=>$('#detailDialog').close();

async function loadClients(){
  $('#loading').classList.remove('hidden'); $('#clientList').innerHTML=''; $('#empty').classList.add('hidden');
  const {data,error}=await db.from('pre_cadastros').select('*').order('created_at',{ascending:false});
  $('#loading').classList.add('hidden');
  if(error){alert('Não foi possível carregar os pré-cadastros.');return}
  clients=data||[]; renderStats(); renderClients();
}
function renderStats(){
  const count=s=>clients.filter(c=>c.status===s).length;
  $('#stats').innerHTML=`<div class="stat"><span>Total</span><b>${clients.length}</b></div><div class="stat"><span>Novos</span><b>${count('novo')}</b></div><div class="stat"><span>Em análise</span><b>${count('em_analise')}</b></div><div class="stat"><span>Aprovados</span><b>${count('aprovado')}</b></div>`;
}
function renderClients(){
  const q=$('#searchInput').value.trim().toLowerCase().replace(/\D/g,'');
  const raw=$('#searchInput').value.trim().toLowerCase();
  const sf=$('#statusFilter').value;
  const filtered=clients.filter(c=>{
    const hay=[c.nome_completo,c.protocolo,c.whatsapp,c.cpf].map(v=>String(v||'').toLowerCase());
    const textOk=!raw||hay.some(v=>v.includes(raw))||(q&&hay.some(v=>v.replace(/\D/g,'').includes(q)));
    return textOk&&(!sf||c.status===sf);
  });
  $('#empty').classList.toggle('hidden',filtered.length>0);
  $('#clientList').innerHTML=filtered.map(c=>`<article class="client-card" data-id="${c.id}"><div><div class="client-name">${esc(c.nome_completo||'Sem nome')}</div><div class="client-meta">${esc(c.protocolo||'')} · ${fmtDate(c.created_at)}</div></div><div><div class="client-meta">CPF</div><strong>${esc(formatCPF(c.cpf))}</strong></div><div><span class="status status-${esc(c.status)}">${labelStatus(c.status)}</span></div><button class="open-btn">ABRIR</button></article>`).join('');
  document.querySelectorAll('.client-card').forEach(el=>el.addEventListener('click',()=>openClient(el.dataset.id)));
}

async function openClient(id){
  current=clients.find(c=>String(c.id)===String(id)); if(!current)return;
  $('#detailName').textContent=current.nome_completo||'Cliente'; $('#detailProtocol').textContent=current.protocolo||'';
  const docs=[['documento_frente_url','Documento frente'],['documento_verso_url','Documento verso'],['comprovante_endereco_url','Comprovante endereço'],['selfie_url','Selfie']].filter(([k])=>current[k]);
  $('#detailBody').innerHTML=`<div class="detail-grid">
    <section class="section"><h3>Dados pessoais</h3>${kv('CPF',formatCPF(current.cpf))}${kv('Nascimento',fmtDateOnly(current.data_nascimento))}${kv('WhatsApp',current.whatsapp)}${kv('Estado civil',current.estado_civil)}${kv('Profissão',current.profissao)}${kv('Renda',money(current.renda_mensal))}${kv('Empresa',current.empresa_trabalho)}</section>
    <section class="section"><h3>Endereço</h3>${kv('CEP',current.cep)}${kv('Rua',current.rua)}${kv('Número',current.numero)}${kv('Complemento',current.complemento)}${kv('Bairro',current.bairro)}${kv('Cidade/UF',`${current.cidade||''}/${current.estado||''}`)}</section>
    <section class="section"><h3>Referência</h3>${kv('Nome',current.referencia_nome)}${kv('Telefone',current.referencia_telefone)}${kv('Relação',current.referencia_relacao)}</section>
    <section class="section"><h3>Cadastro</h3>${kv('Protocolo',current.protocolo)}${kv('Status',labelStatus(current.status))}${kv('Enviado em',fmtDate(current.created_at))}${kv('Responsável',current.responsavel)}</section>
    <section class="section full"><h3>Documentos</h3><div class="docs">${docs.map(([k,l])=>`<button class="doc-btn" data-path="${esc(current[k])}">${l}</button>`).join('')||'Nenhum documento disponível.'}</div></section>
    <section class="section full"><h3>Análise do crediário</h3><div class="analysis-grid"><label>Status<select id="editStatus"><option value="novo">Novo</option><option value="em_analise">Em análise</option><option value="pendente_documentos">Pendente documentos</option><option value="aprovado">Aprovado</option><option value="reprovado">Reprovado</option><option value="finalizado">Finalizado</option></select></label><label>Limite aprovado<input id="editLimit" type="number" min="0" step="0.01" placeholder="R$ 0,00"></label></div><label>Responsável<input id="editResponsible" placeholder="Nome do funcionário"></label><label>Observações<textarea id="editNotes" rows="4" placeholder="Observações da análise"></textarea></label><div class="analysis-actions"><button class="save-btn" id="saveAnalysis">SALVAR ANÁLISE</button><button class="approve-btn" id="approveAnalysis">APROVAR</button><button class="reject-btn" id="rejectAnalysis">REPROVAR</button></div></section>
  </div>`;
  $('#editStatus').value=current.status||'novo'; $('#editLimit').value=current.limite_aprovado??''; $('#editResponsible').value=current.responsavel||$('#staffName').textContent||''; $('#editNotes').value=current.observacoes||'';
  document.querySelectorAll('.doc-btn').forEach(b=>b.onclick=()=>openDocument(b.dataset.path));
  $('#saveAnalysis').onclick=()=>saveAnalysis(); $('#approveAnalysis').onclick=()=>saveAnalysis('aprovado'); $('#rejectAnalysis').onclick=()=>saveAnalysis('reprovado');
  $('#detailDialog').showModal();
}

async function openDocument(path){
  const {data,error}=await db.storage.from('pre_cadastros_documentos').createSignedUrl(path,300);
  if(error||!data?.signedUrl){alert('Não foi possível abrir este documento.');return}
  window.open(data.signedUrl,'_blank','noopener');
}
async function saveAnalysis(forceStatus){
  const status=forceStatus||$('#editStatus').value; const limit=$('#editLimit').value===''?null:Number($('#editLimit').value);
  if(status==='aprovado'&&(!limit||limit<=0)){alert('Informe um limite aprovado maior que zero.');return}
  const payload={status,limite_aprovado:status==='aprovado'?limit:null,responsavel:$('#editResponsible').value.trim()||null,observacoes:$('#editNotes').value.trim()||null};
  const {error}=await db.from('pre_cadastros').update(payload).eq('id',current.id);
  if(error){alert('Não foi possível salvar a análise.');return}
  alert('Análise salva com sucesso.'); $('#detailDialog').close(); await loadClients();
}

function kv(a,b){return `<div class="kv"><span>${esc(a)}</span><span>${esc(b||'—')}</span></div>`}
function esc(v){return String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function fmtDate(v){if(!v)return'—';return new Date(v).toLocaleString('pt-BR')}
function fmtDateOnly(v){if(!v)return'—';const [y,m,d]=String(v).split('-');return d&&m&&y?`${d}/${m}/${y}`:v}
function money(v){if(v===null||v===undefined||v==='')return'—';return Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
function formatCPF(v){const d=String(v||'').replace(/\D/g,'');return d.length===11?d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4'):v||'—'}
function labelStatus(s){return({novo:'Novo',em_analise:'Em análise',pendente_documentos:'Pendente documentos',aprovado:'Aprovado',reprovado:'Reprovado',finalizado:'Finalizado'})[s]||s||'—'}
boot();