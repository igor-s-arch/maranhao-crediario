(function(){
  function phoneLink(numero,label){
    const d=String(numero||'').replace(/\D/g,'');
    if(!d)return '—';
    const wa=(d.length===10||d.length===11)?'55'+d:d;
    return `<a href="https://wa.me/${wa}" target="_blank" rel="noopener" style="font-weight:700;text-decoration:none">💬 ${esc(numero)} <small>Abrir WhatsApp</small></a>`;
  }

  function updateDetailForNewForm(){
    if(!current)return;
    const sections=[...document.querySelectorAll('#detailBody .section')];
    const personal=sections.find(s=>s.querySelector('h3')?.textContent.trim()==='Dados pessoais');
    const address=sections.find(s=>s.querySelector('h3')?.textContent.trim()==='Endereço');
    const reference=sections.find(s=>s.querySelector('h3')?.textContent.trim()==='Referência');

    if(reference) reference.remove();

    if(personal){
      const rows=[...personal.querySelectorAll('.kv')];
      const waRow=rows.find(r=>r.querySelector('span')?.textContent.trim()==='WhatsApp');
      if(waRow){
        const spans=waRow.querySelectorAll('span');
        spans[0].textContent='WhatsApp principal';
        spans[1].innerHTML=phoneLink(current.whatsapp,'WhatsApp principal');
        const second=document.createElement('div');
        second.className='kv';
        second.innerHTML=`<span>Segundo WhatsApp</span><span>${phoneLink(current.whatsapp_2,'Segundo WhatsApp')}</span>`;
        waRow.insertAdjacentElement('afterend',second);
      }
    }

    if(address){
      [...address.querySelectorAll('.kv')].forEach(r=>{
        const first=r.querySelector('span');
        if(first?.textContent.trim()==='Complemento') first.textContent='Complemento / Próximo de';
      });
    }
  }

  const previousOpenClient=openClient;
  openClient=async function(id){
    await previousOpenClient(id);
    updateDetailForNewForm();
  };

  const previousRenderClients=renderClients;
  renderClients=function(){
    previousRenderClients();
    const raw=$('#searchInput')?.value.trim().toLowerCase()||'';
    if(!raw)return;
    const q=raw.replace(/\D/g,'');
    const ids=new Set(clients.filter(c=>{
      const v=String(c.whatsapp_2||'').toLowerCase();
      return v.includes(raw)||(q&&v.replace(/\D/g,'').includes(q));
    }).map(c=>String(c.id)));
    if(!ids.size)return;
    const sf=$('#statusFilter')?.value||'';
    ids.forEach(id=>{
      const c=clients.find(x=>String(x.id)===id);
      if(!c|| (sf&&c.status!==sf))return;
      if(document.querySelector(`#clientList .client-card[data-id="${CSS.escape(id)}"]`))return;
      const temp=document.createElement('div');
      temp.innerHTML=`<article class="client-card" data-id="${esc(c.id)}"><div><div class="client-name">${esc(c.nome_completo||'Sem nome')}</div><div class="client-meta">${esc(c.protocolo||'')} · ${fmtDate(c.created_at)}</div></div><div><div class="client-meta">CPF</div><strong>${esc(formatCPF(c.cpf))}</strong></div><div><span class="status status-${esc(c.status)}">${labelStatus(c.status)}</span></div><button class="open-btn">ABRIR</button></article>`;
      const card=temp.firstElementChild;
      card.onclick=()=>openClient(card.dataset.id);
      $('#clientList').appendChild(card);
    });
    $('#empty').classList.toggle('hidden',!!document.querySelector('#clientList .client-card'));
  };
})();