/* Ajustes de navegação v15: visual fiel à referência sem criar ações falsas */
(function(){
 const side=document.querySelector('.sidebar-nav');
 if(!side)return;
 const clients=document.getElementById('sideClients');
 const employees=document.getElementById('sideEmployees');
 const overview=[...side.querySelectorAll('.mgmt-btn')].find(x=>/Visão geral/i.test(x.textContent));
 const recovery=[...side.querySelectorAll('.mgmt-btn')].find(x=>/Recuperar/i.test(x.textContent));
 const reports=[...side.querySelectorAll('.mgmt-btn')].find(x=>/Relatórios/i.test(x.textContent));
 // Ordenar apenas destinos que realmente existem e já possuem ação.
 for(const node of [overview,clients,recovery,reports,employees])if(node)side.appendChild(node);
 const head=document.querySelector('.topbar-title');
 if(head){head.textContent='VEM SER MARANHÃO';const sub=document.createElement('small');sub.textContent='Gestão de crediário';head.appendChild(sub)}
 const updateActive=()=>{
 const activePage=[...document.querySelectorAll('.mgmt-page.active')].length>0;
 if(activePage)return;
 if(!document.getElementById('employeesArea')?.classList.contains('hidden'))return;
 if(clients)clients.classList.add('active');
 };
 clients?.addEventListener('click',updateActive);
 // Acesso do funcionário permanece sob o controle existente do painel.
})();
