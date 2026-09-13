(function(){
 const oldRender=renderClients;
 renderClients=function(){oldRender();document.querySelectorAll('#clientList .client-card').forEach(card=>{const c=clients.find(x=>String(x.id)===String(card.dataset.id));if(!c||!['aprovado','reprovado'].includes(c.status))return;const open=card.querySelector('.open-btn');if(!open)return;let actions=card.querySelector('.client-actions');if(!actions){actions=document.createElement('div');actions.className='client-actions';open.parentNode.insertBefore(actions,open);actions.appendChild(open)}const del=document.createElement('button');del.type='button';del.className='delete-client-btn';del.title='Excluir cadastro';del.setAttribute('aria-label','Excluir cadastro');del.textContent='🗑️';del.onclick=async e=>{e.stopPropagation();await deleteClient(c)};actions.appendChild(del)});
 };
 async function deleteClient(c){
  if(!['aprovado','reprovado'].includes(c.status))return alert('Só é possível excluir cadastros aprovados ou reprovados.');
  const nome=c.nome_completo||'este cliente';
  if(!confirm(`Tem certeza que deseja excluir o cadastro de ${nome}?\n\nEssa ação não poderá ser desfeita.`))return;
  const {error}=await db.from('pre_cadastros').delete().eq('id',c.id).in('status',['aprovado','reprovado']);
  if(error)return alert('Não foi possível excluir o cadastro.');
  alert('Cadastro excluído com sucesso.');await loadClients();
 }
})();