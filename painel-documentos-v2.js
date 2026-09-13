(function(){
  const previousOpenClient=openClient;
  openClient=async function(id){
    await previousOpenClient(id);
    await enhanceDocumentsPreview();
  };

  function isImagePath(path){return /\.(jpe?g|png|webp)$/i.test(String(path||''));}
  function safeLabel(label){return String(label||'Documento').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  async function signedUrl(path){
    const {data,error}=await db.storage.from('pre_cadastros_documentos').createSignedUrl(path,600);
    if(error||!data?.signedUrl)return null;
    return data.signedUrl;
  }

  async function enhanceDocumentsPreview(){
    if(!current)return;
    const section=[...document.querySelectorAll('#detailBody .section')].find(s=>s.querySelector('h3')?.textContent.trim()==='Documentos');
    if(!section)return;

    const items=[
      ['documento_frente_url','Documento frente','🪪'],
      ['documento_verso_url','Documento verso','🪪'],
      ['comprovante_endereco_url','Comprovante de endereço','🏠'],
      ['selfie_url','Selfie','👤']
    ].filter(([key])=>current[key]);

    if(!items.length){section.innerHTML='<h3>Documentos</h3><div class="docs-empty">Nenhum documento disponível.</div>';return;}

    section.innerHTML='<div class="docs-section-head"><div><h3>Documentos</h3><p>Visualize ou baixe os arquivos enviados pelo cliente.</p></div><span class="docs-count">'+items.length+' arquivo'+(items.length>1?'s':'')+'</span></div><div class="docs-preview-grid"></div>';
    const grid=section.querySelector('.docs-preview-grid');

    for(const [key,label,icon] of items){
      const path=current[key];
      const url=await signedUrl(path);
      const card=document.createElement('article');
      card.className='document-preview-card';
      let visual='';
      if(url&&isImagePath(path)) visual=`<button type="button" class="document-thumb" aria-label="Visualizar ${safeLabel(label)}"><img src="${url}" alt="${safeLabel(label)}" loading="lazy"></button>`;
      else visual=`<button type="button" class="document-thumb document-file" aria-label="Abrir ${safeLabel(label)}"><span>${icon}</span><b>${/\.pdf$/i.test(path)?'PDF':'ARQUIVO'}</b></button>`;

      card.innerHTML=`${visual}<div class="document-card-body"><div><strong>${safeLabel(label)}</strong><span>Enviado pelo cliente</span></div><div class="document-actions"><button type="button" class="document-view">👁 Visualizar</button><button type="button" class="document-download">⬇ Baixar</button></div></div>`;
      const open=()=>{if(url)window.open(url,'_blank','noopener');else alert('Não foi possível abrir este documento.');};
      card.querySelector('.document-thumb').onclick=open;
      card.querySelector('.document-view').onclick=open;
      card.querySelector('.document-download').onclick=()=>downloadDocument(path,label);
      grid.appendChild(card);
    }
  }
})();