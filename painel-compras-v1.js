/* Situação da primeira compra — Vem ser Maranhão */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    #purchaseFilter{min-width:165px}
    #clientList.purchase-enabled .client-table-head,
    #clientList.purchase-enabled .client-card.client-row{grid-template-columns:1.3fr .7fr .9fr 1.05fr .7fr .65fr .85fr .75fr}
    .purchase-pill{display:inline-block;padding:7px 9px;border-radius:15px;font-size:11px;font-weight:800;white-space:nowrap}
    .purchase-yes{background:#dcfae6;color:#067647}
    .purchase-no{background:#fee4e2;color:#b42318}
    .purchase-pending{background:#f2f4f7;color:#475467}
    .purchase-control{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .purchase-control select{max-width:230px;padding:9px;border:1px solid #d0d5dd;border-radius:8px}
    .purchase-inline{width:100%;max-width:135px;border:1px solid #d0d5dd;border-radius:9px;padding:7px 4px;font-size:11px;font-weight:800;cursor:pointer}
    .purchase-inline.purchase-yes{background:#dcfae6;color:#067647}
    .purchase-inline.purchase-no{background:#fee4e2;color:#b42318}
    .purchase-inline:disabled{opacity:.6;cursor:wait}
    @media(max-width:1050px){#clientList.purchase-enabled .client-card.client-row{grid-template-columns:1fr 1fr}.purchase-cell .mobile-label{display:block}}
    @media(max-width:800px){#clientList.purchase-enabled .client-card.client-row{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
  const filter=document.createElement('select');
  filter.id='purchaseFilter';
  filter.setAttribute('aria-label','Filtrar por situação da compra');
  filter.innerHTML='<option value="">Todas as compras</option><option value="yes">Comprou</option><option value="no">Não comprou</option>';
  document.querySelector('#clientsArea .filters')?.appendChild(filter);
  const hasField=c=>Object.prototype.hasOwnProperty.call(c,'comprou');
  const label=c=>!hasField(c)?'Não configurado':c.comprou?'Comprou':'Não comprou';
  const pill=c=>'<span class="purchase-pill '+(!hasField(c)?'purchase-pending':c.comprou?'purchase-yes':'purchase-no')+'">'+label(c)+'</span>';
  const previousRender=renderClients;
  renderClients=function(){
    previousRender();
    const list=document.getElementById('clientList');
    if(!list)return;
    list.classList.add('purchase-enabled');
    const head=list.querySelector('.client-table-head');
    if(head){const span=document.createElement('span');span.textContent='Compra';head.insertBefore(span,head.lastElementChild)}
    list.querySelectorAll('.client-card.client-row').forEach(card=>{
      const c=clients.find(x=>String(x.id)===card.dataset.id);
      if(!c)return;
      const cell=document.createElement('div');cell.className='cell purchase-cell';
      cell.innerHTML='<span class="mobile-label">Compra</span>';
      if(hasField(c)){
        const select=document.createElement('select');
        select.className='purchase-inline '+(c.comprou?'purchase-yes':'purchase-no');
        select.setAttribute('aria-label','Situação da compra de '+(c.nome_completo||'cliente'));
        select.innerHTML='<option value="false">Não comprou</option><option value="true">Comprou</option>';
        select.value=c.comprou===true?'true':'false';
        select.addEventListener('click',e=>e.stopPropagation());
        select.addEventListener('pointerdown',e=>e.stopPropagation());
        select.addEventListener('change',async e=>{
          e.stopPropagation();
          const oldValue=c.comprou===true;
          const newValue=select.value==='true';
          if(oldValue===newValue)return;
          select.disabled=true;
          const {error}=await db.from('pre_cadastros').update({comprou:newValue}).eq('id',c.id).select('id,comprou').single();
          if(error){
            select.value=String(oldValue);
            select.disabled=false;
            alert('Não foi possível salvar a situação da compra: '+error.message);
            return;
          }
          c.comprou=newValue;
          if(current&&String(current.id)===String(c.id))current.comprou=newValue;
          renderClients();
        });
        cell.appendChild(select);
      }else{cell.innerHTML+=pill(c)}
      card.insertBefore(cell,card.querySelector('.client-actions'));
    });
    const choice=filter.value;
    list.querySelectorAll('.client-card').forEach(card=>{
      const c=clients.find(x=>String(x.id)===card.dataset.id);
      if(!c)return;
      const match=!choice||(choice==='yes'&&c.comprou===true)||(choice==='no'&&c.comprou===false);
      card.style.display=match?'':'none';
    });
    const visible=[...list.querySelectorAll('.client-card')].filter(x=>x.style.display!=='none').length;
    document.getElementById('empty')?.classList.toggle('hidden',visible>0);
    const footer=list.querySelector('.table-footer');
    if(footer)footer.textContent='Mostrando '+visible+' de '+clients.length+' pré-cadastros';
  };
  filter.addEventListener('change',()=>renderClients());
  const previousLoad=loadClients;
  loadClients=async function(){await previousLoad();renderClients()};
})();
