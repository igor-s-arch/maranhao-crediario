const FUNCTION_URL='https://mcebteebdfnrksnrokvt.supabase.co/functions/v1/enviar-pre-cadastro';
const $=s=>document.querySelector(s);
let step=0;
const data={tipo_documento:'RG'};
const files={};

const fields={
  input(id,label,type='text',placeholder='',required=true){return `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" placeholder="${placeholder}" ${required?'required':''}></div>`},
  select(id,label,options,required=true){return `<div class="field"><label for="${id}">${label}</label><select id="${id}" name="${id}" ${required?'required':''}><option value="">Selecione</option>${options.map(o=>`<option value="${o}">${o}</option>`).join('')}</select></div>`}
};

const steps=[
  {
    title:'Seus dados pessoais', sub:'Preencha suas informações com atenção.', progress:0,
    html:()=>`${fields.input('nome_completo','Nome completo','text','Digite seu nome completo')}
      ${fields.input('data_nascimento','Data de nascimento','date')}
      ${fields.select('estado_civil','Estado civil',['Solteiro(a)','Casado(a)','União estável','Divorciado(a)','Viúvo(a)'])}
      ${fields.input('cpf','CPF','text','Digite seu CPF')}
      ${fields.input('whatsapp','Telefone/WhatsApp','tel','(99) 9 0000-0000')}`
  },
  {
    title:'Endereço', sub:'Informe seu endereço atual.', progress:1,
    html:()=>`${fields.input('cep','CEP','text','Digite seu CEP')}
      ${fields.input('rua','Endereço','text','Digite seu endereço')}
      <div class="field-row">${fields.input('numero','Número','text','Nº')}${fields.input('complemento','Complemento (opcional)','text','Apto, bloco, etc.',false)}</div>
      ${fields.input('bairro','Bairro','text','Digite seu bairro')}
      ${fields.input('cidade','Cidade','text','Digite sua cidade')}
      ${fields.select('estado','Estado',['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'])}`
  },
  {
    title:'Dados do trabalho', sub:'Informe onde você trabalha.', progress:2,
    html:()=>`${fields.input('profissao','Profissão','text','Digite sua profissão')}
      ${fields.input('empresa_trabalho','Empresa / local de trabalho','text','Digite o nome da empresa')}
      ${fields.input('renda_mensal','Renda mensal','number','Digite sua renda mensal')}
      <div class="helper"><span class="i">i</span><span>Essas informações são usadas apenas para análise de crédito.</span></div>`
  },
  {
    title:'Referência pessoal', sub:'Informe uma pessoa de confiança.', progress:3,
    html:()=>`${fields.input('referencia_nome','Nome completo','text','Digite o nome da referência')}
      ${fields.input('referencia_telefone','Telefone','tel','(99) 9 0000-0000')}
      ${fields.input('referencia_relacao','Relação/Parentesco','text','Ex.: mãe, irmão, amigo')}
      <div class="helper"><span class="i">i</span><span>Sua referência será usada somente para auxiliar a análise do cadastro.</span></div>`
  },
  {
    title:'Envio de documentos', sub:'Envie fotos ou PDF legíveis.', progress:null,
    html:()=>`<div class="doc-choice"><button type="button" data-doc="RG" class="${data.tipo_documento==='RG'?'active':''}">RG</button><button type="button" data-doc="CNH" class="${data.tipo_documento==='CNH'?'active':''}">CNH</button></div>
      <div class="upload-grid">
        ${uploadCard('documento_frente','📷',data.tipo_documento==='CNH'?'CNH':'RG - frente','Tirar foto ou escolher')}
        ${data.tipo_documento==='RG'?uploadCard('documento_verso','🪪','RG - verso','Tirar foto ou escolher'):''}
        ${uploadCard('comprovante_endereco','⌂','Comprovante de residência','Tirar foto ou escolher')}
        ${uploadCard('selfie','◯','Selfie (seu rosto)','Tirar foto ou escolher','image/jpeg,image/png,image/webp')}
      </div>`
  },
  {
    title:'Autorização', sub:'Leia e aceite os termos para finalizar.', progress:null,
    html:()=>`<label class="consent-box"><input id="autorizado_analise" type="checkbox" required><span>Autorizo a análise dos meus dados, documentos e informações para fins de cadastro e avaliação de crediário na Maranhão. Declaro que as informações prestadas são verdadeiras e estou ciente de que a aprovação está sujeita à análise.</span></label>
      <div class="privacy-block"><span class="lock">♙</span><b>Seus dados estão protegidos.</b><br>As informações são enviadas com segurança para análise do seu cadastro.</div>`
  }
];

function uploadCard(id,icon,title,desc,accept='image/jpeg,image/png,image/webp,application/pdf'){
  const has=!!files[id];
  return `<label class="upload-card ${has?'has-file':''}"><span class="up-icon">${icon}</span><strong>${title}</strong><span>${has?files[id].name:desc}</span><input type="file" id="${id}" accept="${accept}"></label>`;
}

function renderStepper(active){
  const el=$('#stepper');
  if(active===null){el.innerHTML='';el.style.display='none';return}
  el.style.display='flex';
  el.innerHTML=[0,1,2,3].map((n,i)=>`<div class="step-node ${i<active?'done':''} ${i===active?'active':''}"><span class="step-circle">${i+1}</span>${i<3?'<span class="step-line"></span>':''}</div>`).join('');
}

function render(){
  const s=steps[step];
  renderStepper(s.progress);
  $('#stepContent').innerHTML=`<h1 class="section-title">${s.title}</h1><p class="section-sub">${s.sub}</p>${s.html()}`;
  restoreValues();
  bindDynamic();
  $('#nextBtn').innerHTML=step===steps.length-1?'ENVIAR CADASTRO <span>›</span>':'PRÓXIMO <span>›</span>';
}

function restoreValues(){
  Object.entries(data).forEach(([k,v])=>{const e=document.getElementById(k);if(e&&e.type!=='checkbox'&&e.type!=='file')e.value=v});
  const consent=document.getElementById('autorizado_analise'); if(consent) consent.checked=!!data.autorizado_analise;
}

function bindDynamic(){
  document.querySelectorAll('[data-doc]').forEach(btn=>btn.addEventListener('click',()=>{saveCurrent();data.tipo_documento=btn.dataset.doc;if(data.tipo_documento==='CNH')delete files.documento_verso;render()}));
  document.querySelectorAll('.upload-card input[type=file]').forEach(inp=>inp.addEventListener('change',()=>{const file=inp.files?.[0];if(!file)return;if(file.size>5*1024*1024){alert('Cada arquivo deve ter no máximo 5 MB.');inp.value='';return}files[inp.id]=file;render()}));
}

function saveCurrent(){
  document.querySelectorAll('#stepContent input,#stepContent select').forEach(e=>{
    if(e.type==='file')return;
    if(e.type==='checkbox')data[e.id]=e.checked;
    else data[e.id]=e.value;
  });
}

function validateCurrent(){
  saveCurrent();
  const controls=[...document.querySelectorAll('#stepContent input:not([type=file]),#stepContent select')];
  for(const e of controls){if(!e.checkValidity()){e.reportValidity();return false}}
  if(step===0){
    if((data.cpf||'').replace(/\D/g,'').length!==11){alert('Digite um CPF com 11 números.');return false}
    if((data.whatsapp||'').replace(/\D/g,'').length<10){alert('Digite um WhatsApp válido.');return false}
  }
  if(step===4){
    if(!files.documento_frente){alert(`Envie a foto da frente do ${data.tipo_documento}.`);return false}
    if(data.tipo_documento==='RG'&&!files.documento_verso){alert('Envie a foto do verso do RG.');return false}
    if(!files.comprovante_endereco){alert('Envie o comprovante de residência.');return false}
    if(!files.selfie){alert('Envie uma selfie.');return false}
  }
  if(step===5&&!data.autorizado_analise){alert('Você precisa autorizar a análise para enviar o pré-cadastro.');return false}
  return true;
}

function fileToPayload(file){
  if(!file)return Promise.resolve(null);
  return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve({base64:r.result,nome:file.name,tipo:file.type});r.onerror=reject;r.readAsDataURL(file)});
}

async function submit(){
  const btn=$('#nextBtn');btn.disabled=true;btn.textContent='ENVIANDO...';
  try{
    const payload={...data,consentimento:true,autorizado_analise:true,arquivos:{
      documento_frente:await fileToPayload(files.documento_frente),
      documento_verso:await fileToPayload(files.documento_verso),
      comprovante_endereco:await fileToPayload(files.comprovante_endereco),
      selfie:await fileToPayload(files.selfie)
    }};
    const res=await fetch(FUNCTION_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    let out={};try{out=await res.json()}catch{}
    if(!res.ok)throw new Error(out.error||out.message||'Não foi possível enviar o pré-cadastro.');
    $('#protocol').textContent=out.protocolo||'MA-XXXXXXXX';
    $('#formScreen').classList.add('hidden');
    $('#successScreen').classList.remove('hidden');
    window.scrollTo(0,0);
  }catch(err){alert(err.message||'Erro ao enviar. Tente novamente.');btn.disabled=false;btn.innerHTML='ENVIAR CADASTRO <span>›</span>'}
}

$('#startBtn').addEventListener('click',()=>{$('#cover').classList.add('hidden');$('#formScreen').classList.remove('hidden');step=0;render();window.scrollTo(0,0)});
$('#backBtn').addEventListener('click',()=>{saveCurrent();if(step===0){$('#formScreen').classList.add('hidden');$('#cover').classList.remove('hidden')}else{step--;render()}window.scrollTo(0,0)});
$('#nextBtn').addEventListener('click',async()=>{if(!validateCurrent())return;if(step<steps.length-1){step++;render();window.scrollTo(0,0)}else await submit()});
$('#finishBtn').addEventListener('click',()=>location.reload());
