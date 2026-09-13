(function(){
  const statusIcon={novo:'📄',em_analise:'◷',aprovado:'✓',reprovado:'✕'};
  const statText={novo:'Aguardando análise',em_analise:'Em verificação',aprovado:'Clientes liberados',reprovado:'Cadastros recusados'};

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
      const wa=esc(c.whatsapp||'—');
      return `<article class="client-card client-row" data-id="${esc(c.id)}">
        <div class="client-person"><span class="client-avatar">${ini}</span><div><div class="client-name">${nome}</div></div></div>
        <div class="cell"><span class="mobile-label">CPF</span>${esc(formatCPF(c.cpf))}</div>
        <div class="cell whatsapp-cell"><span class="mobile-label">WhatsApp</span>💬 ${wa}</div>
        <div class="cell protocol-cell"><span class="mobile-label">Protocolo</span>${esc(c.protocolo||'—')}</div>
        <div class="cell date-cell"><span class="mobile-label">Data</span>${fmtDate(c.created_at)}</div>
        <div class="cell"><span class="status status-${esc(c.status)}">${labelStatus(c.status)}</span></div>
        <div class="client-actions"><button class="open-btn" type="button">◉ Abrir</button></div>
      </article>`}).join('')+`<div class="table-footer">Mostrando ${f.length} de ${clients.length} pré-cadastro${clients.length===1?'':'s'}</div>`;
    document.querySelectorAll('#clientList .client-card').forEach(el=>el.onclick=()=>openClient(el.dataset.id));
  };
})();