(function(){
  const bucket='pre_cadastros_documentos';
  const urlCache=new Map();

  async function signed(path){
    if(!path)return null;
    if(urlCache.has(path))return urlCache.get(path);
    const {data,error}=await db.storage.from(bucket).createSignedUrl(path,900);
    if(error||!data?.signedUrl)return null;
    urlCache.set(path,data.signedUrl);
    return data.signedUrl;
  }

  function isImage(path){return /\.(jpe?g|png|webp)$/i.test(String(path||''));}
  function isPdf(path){return /\.pdf$/i.test(String(path||''));}

  async function applyClientSelfies(){
    const cards=[...document.querySelectorAll('#clientList .client-card[data-id]')];
    await Promise.all(cards.map(async card=>{
      const c=clients.find(x=>String(x.id)===String(card.dataset.id));
      const avatar=card.querySelector('.client-avatar');
      if(!c||!avatar||!c.selfie_url)return;
      const u=await signed(c.selfie_url);if(!u)return;
      avatar.innerHTML=`<img src="${u}" alt="Selfie de ${esc(c.nome_completo||'cliente')}" loading="lazy">`;
      avatar.classList.add('has-photo');
    }));
  }

  const priorRender=renderClients;
  renderClients=function(){
    priorRender();
    applyClientSelfies();
  };

  async function upgradeDocuments(){
    if(!current)return;
    const section=[...document.querySelectorAll('#detailBody .section')].find(s=>s.querySelector('h3')?.textContent.trim()==='Documentos');
    if(!section)return;
    const defs=[
      ['documento_frente_url','Documento frente'],
      ['documento_verso_url','Documento verso'],
      ['comprovante_endereco_url','Comprovante de endereço'],
      ['selfie_url','Selfie']
    ].filter(([k])=>current[k]);
    if(!defs.length){section.innerHTML='<h3>Documentos</h3><p class="doc-empty">Nenhum documento disponível.</p>';return}
    section.innerHTML=`<div class="docs-title"><div><h3>Documentos</h3><p>Visualize os arquivos enviados pelo cliente e baixe quando precisar.</p></div><span class="docs-count">${defs.length} arquivo${defs.length===1?'':'s'}</span></div><div class="doc-gallery">${defs.map(([k,l])=>`<article class="doc-card-pro" data-key="${k}"><div class="doc-preview"><div class="doc-loading">Carregando...</div></div><div class="doc-info"><strong>${l}</strong><span>${isPdf(current[k])?'PDF':'Imagem'}</span></div><div class="doc-actions-pro"><button class="doc-view" type="button">👁 Visualizar</button><button class="doc-download" type="button">⬇ Baixar</button></div></article>`).join('')}</div>`;

    await Promise.all([...section.querySelectorAll('.doc-card-pro')].map(async card=>{
      const key=card.dataset.key,path=current[key],u=await signed(path),preview=card.querySelector('.doc-preview');
      if(!u){preview.innerHTML='<div class="doc-error">Não foi possível carregar</div>';return}
      if(isImage(path)) preview.innerHTML=`<img src="${u}" alt="${card.querySelector('.doc-info strong').textContent}" loading="lazy">`;
      else preview.innerHTML='<div class="pdf-preview"><span>PDF</span><small>Documento</small></div>';
      card.querySelector('.doc-view').onclick=e=>{e.stopPropagation();window.open(u,'_blank','noopener')};
      card.querySelector('.doc-download').onclick=e=>{e.stopPropagation();downloadDocument(path,card.querySelector('.doc-info strong').textContent)};
      preview.onclick=e=>{e.stopPropagation();window.open(u,'_blank','noopener')};
    }));
  }

  const priorOpen=openClient;
  openClient=async function(id){
    await priorOpen(id);
    await upgradeDocuments();
  };
})();