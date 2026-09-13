function normalizeEmployeeUser(value){return String(value||'').trim().split(/\s+/)[0].normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9._-]/g,'')}
(function setupSimpleEmployeeAccess(){
  const loginLabel=document.querySelector('label[for="usuario"]');
  const loginInput=document.getElementById('usuario');
  if(loginLabel)loginLabel.textContent='Primeiro nome';
  if(loginInput)loginInput.placeholder='Ex.: maria';

  const nameInput=document.getElementById('newEmployeeName');
  const userInput=document.getElementById('newEmployeeUser');
  const passInput=document.getElementById('newEmployeePass');
  const createBtn=document.getElementById('createEmployee');
  if(!nameInput||!userInput||!passInput||!createBtn)return;

  const nameLabel=nameInput.closest('label');
  const userLabel=userInput.closest('label');
  if(nameLabel){nameLabel.childNodes[0].textContent='Primeiro nome';nameInput.placeholder='Ex.: Maria';}
  if(userLabel)userLabel.style.display='none';

  createBtn.onclick=async()=>{
    const primeiroNome=String(nameInput.value||'').trim().split(/\s+/)[0];
    const usuario=normalizeEmployeeUser(primeiroNome);
    const senha=passInput.value;
    const msg=document.getElementById('employeeMsg');
    if(primeiroNome.length<2||usuario.length<2){msg.textContent='Informe o primeiro nome do funcionário.';msg.className='error';return}
    if(senha.length<6){msg.textContent='A senha precisa ter pelo menos 6 caracteres.';msg.className='error';return}
    try{
      await masterRequest('POST',{acao:'criar',nome:primeiroNome,usuario,senha});
      msg.textContent=`Funcionário criado. Acesso: ${usuario} + senha cadastrada.`;
      msg.className='notice success-note';
      nameInput.value='';userInput.value='';passInput.value='';
      await loadEmployees();
    }catch(e){msg.textContent=e.message;msg.className='error'}
  };
})();