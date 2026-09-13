async function compressImageForUpload(file){
  if(!file || !String(file.type||'').startsWith('image/')) return file;
  if(file.size <= 900*1024) return file;
  const bitmap = await createImageBitmap(file);
  const maxSide = 1600;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  canvas.getContext('2d').drawImage(bitmap,0,0,width,height);
  if(bitmap.close) bitmap.close();
  const blob = await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Não foi possível preparar a imagem.')),'image/jpeg',0.78));
  return new File([blob], String(file.name||'foto').replace(/\.[^.]+$/,'')+'.jpg', {type:'image/jpeg', lastModified:Date.now()});
}

fileToPayload = async function(file){
  if(!file) return null;
  const prepared = await compressImageForUpload(file);
  if(prepared.size > 5*1024*1024) throw new Error('Um dos arquivos ficou maior que 5 MB. Escolha uma imagem ou PDF menor.');
  return await new Promise((resolve,reject)=>{
    const r=new FileReader();
    r.onload=()=>resolve({base64:r.result,nome:prepared.name,type:prepared.type});
    r.onerror=()=>reject(new Error('Não foi possível ler um dos arquivos.'));
    r.readAsDataURL(prepared);
  });
};
