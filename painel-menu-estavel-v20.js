/* v20: menu único; cada item tem uma ação real. */
(function(){
 const nav=document.querySelector('.sidebar-nav');
 if(!nav)return;
 const clients=document.getElementById('sideClients'),employees=document.getElementById('sideEmployees');
 const overview=[...nav.querySelectorAll('.mgmt-btn')].find(x=>/Visão geral/.test(x.textContent));
 const recovery=[...nav.querySelectorAll('.mgmt-btn')].find(x=>/Recuperar/.test(x.textContent));
 const reports=[...nav.querySelectorAll('.mgmt-btn')].find(x=>/Relatórios/.test(x.textContent));
 function select(button){nav.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===button))}
 function showList(status,purchase,button){
  clients?.click();
  const sf=document.getElementById('statusFilter'),pf=document.getElementById('purchaseFilter');
  if(sf){sf.value=status;sf.dispatchEvent(new Event('change',{bubbles:true}))}
  if(pf){pf.value=purchase;pf.dispatchEvent(new Event('change',{bubbles:true}))}
  select(button);
 }
 const make=(label,icon,action)=>{const b=document.createElement('button');b.type='button';b.className='mgmt-btn';b.innerHTML='<span aria-hidden="true" style="font-size:18px">'+icon+'</span><span>'+label+'</span>';b.addEventListener('click',()=>action(b));return b};
 const approved=make('Aprovados','✓',b=>showList('aprovado','',b));
 const rejected=make('Reprovados','×',b=>showList('reprovado','',b));
 const purchases=make('Controle de compras','▣',b=>showList('','',b));
 const order=[overview,clients,approved,rejected,recovery,purchases,reports,employees].filter(Boolean);
 order.forEach(x=>nav.appendChild(x));
 for(const item of [overview,clients,recovery,reports,employees])item?.addEventListener('click',()=>select(item));
 clients?.addEventListener('click',()=>{const sf=document.getElementById('statusFilter'),pf=document.getElementById('purchaseFilter');if(sf)sf.value='';if(pf)pf.value='';if(typeof renderClients==='function')renderClients()});
 // The employee menu follows the same master-only visibility as the original.
 const sync=()=>{if(employees){employees.hidden=document.getElementById('employeesBtn')?.classList.contains('hidden')??true;employees.style.display=employees.hidden?'none':''}};
 const originalEnter=enterPanel;
 enterPanel=async function(){await originalEnter();sync()};
 sync();
})();
