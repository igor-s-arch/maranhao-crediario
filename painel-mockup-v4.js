(function(){
  const statusIcon={novo:'📄',em_analise:'◷',aprovado:'✓',reprovado:'✕'};
  const statText={novo:'Aguardando análise',em_analise:'Em verificação',aprovado:'Clientes liberados',reprovado:'Cadastros recusados'};
  const whatsappSvg='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3A13 13 0 0 0 5 23.1L3.6 29 9.7 27.4A13 13 0 1 0 16 3Zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.6.9.9-3.5-.2-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.8.2-.2.3-.9 1-.9 1.2-.2.2-.4.2-.7.1-2-.9-3.3-2-4.6-4-.3-.5.3-.5.9-1.7.1-.2.1-.4 0-.6l-.9-2.2c-.2-.5-.5-.5-.8-.5h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.9 5.1.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.4-.3-.7-.5Z"/></svg>';
  const waHref=phone=>{let d=String(phone||'').replace(/\D/g,'');if(d.length===10||d.length===11)d='55'+d;return d?'https://wa.me/'+d:''};
  async function copyPhone(value,button){
    const text=String(value||'').trim();if(!text)return;
    try{
      if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);
      else{const input=document.createElement('textarea');input.value=text;input.style.position='fixed';input.style.opacity='0';document.body.appendChild(input);input.select();document.execCommand('copy');input.remove();}
      if(button){const old=button.textContent;button.textContent='Copiado';button.classList.add('copied');setTimeout(()=>{button.textContent=old;button.classList.remove('copied')},1200)}
    }catch(e){alert('Não foi possível copiar o telefone.')}
  }

  renderStats=function(){
    const c=s=>clients.filter(x=>x.status===s).length;
    $('#stats').innerHTML=`
      <div class="stat stat-total"><div class="stat-icon">👥</div><div><span>Total</span><b>${clients.length}</b><small>Todos os pré-cadastros</small></div></div>
      <div class="stat stat-new"><div class="stat-icon">${statusIcon.novo}</div><div><span>Novos</span><b>${c('novo')}</b><small>${statText.novo}</small></div></div>
      <div class="stat stat-analysis"><div class="stat-icon">${statusIcon.em_analise}</div><div><span>Em análise</span><b>${c('em_analise')}</b><small>${statText.em_analise}</small></div></div>
      <div class="stat stat-approved"><div class="stat-icon">${statusIcon.aprovado}</div><div><span>Aprovados</span><b>${c('aprovado')}</b><small>${statText.aprovado}</small></div></div>
      <div class="stat stat-rejected"><div class="stat-icon">${statusIcon.reprovado}</div><div><span>Negados</span><b>${c('reprovado')}</b><small>${statText.reprovado}</small></div></div>`;
  };

  renderClients=function(){
    const raw=$('#searchInput').value.trim().toLowerCase(),q=raw.replace(/\D/g,''),sf=$('#statusFilter').value;
    const f=clients.filter(c=>{const h=[c.nome_completo,c.protocolo,c.whatsapp,c.whatsapp_2,c.cpf].map(v=>String(v||'').toLowerCase());return(!raw||h.some(v=>v.includes(raw))||(q&&h.some(v=>v.replace(/\D/g,'').includes(q))))&&(!sf||c.status===sf)});
    $('#empty').classList.toggle('hidden',f.length>0);
    if(!f.length){$('#clientList').innerHTML='';return}
    $('#clientList').innerHTML=`<div class="client-table-head"><span>Nome</span><span>CPF</span><span>WhatsApp</span><span>Protocolo</span><span>Data</span><span>Status</span><span>Ações</span></div>`+f.map(c=>{
      const nome=esc(c.nome_completo||'Sem nome'),ini=esc((String(c.nome_completo||'CL').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('')||'CL').toUpperCase());
      const phone=String(c.whatsapp||'').trim(),wa=esc(phone||'—'),waUrl=waHref(phone);
      return `<article class="client-card client-row" data-id="${esc(c.id)}">
        <div class="client-person"><span class="client-avatar">${ini}</span><div><div class="client-name">${nome}</div></div></div>
        <div class="cell"><span class="mobile-label">CPF</span>${esc(formatCPF(c.cpf))}</div>
        <div class="cell whatsapp-cell"><span class="mobile-label">WhatsApp</span><div class="phone-contact">${waUrl?`<a class="phone-wa-link" href="${esc(waUrl)}" target="_blank" rel="noopener" title="Abrir no WhatsApp">${whatsappSvg}</a>`:''}<span class="phone-number-text" title="Selecione o número para copiar">${wa}</span>${phone?`<button class="phone-copy-btn" type="button" data-copy-phone="${esc(phone)}" title="Copiar telefone">⧉</button>`:''}</div></div>
        <div class="cell protocol-cell"><span class="mobile-label">Protocolo</span>${esc(c.protocolo||'—')}</div>
        <div class="cell date-cell"><span class="mobile-label">Data</span>${fmtDate(c.created_at)}</div>
        <div class="cell"><span class="status status-${esc(c.status)}">${labelStatus(c.status)}</span></div>
        <div class="client-actions"><button class="open-btn" type="button">◉ Abrir</button></div>
      </article>`}).join('')+`<div class="table-footer">Mostrando ${f.length} de ${clients.length} pré-cadastro${clients.length===1?'':'s'}</div>`;
    document.querySelectorAll('#clientList .phone-contact').forEach(el=>el.addEventListener('click',e=>e.stopPropagation()));
    document.querySelectorAll('#clientList .phone-copy-btn').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();copyPhone(btn.dataset.copyPhone,btn)}));
    document.querySelectorAll('#clientList .client-card').forEach(el=>el.onclick=()=>openClient(el.dataset.id));
  };
})();