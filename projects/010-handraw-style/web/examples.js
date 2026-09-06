const resultDialog=document.getElementById('result-dialog');
document.querySelectorAll('[data-result]').forEach(button=>button.addEventListener('click',()=>{
 const image=document.getElementById('result-image');image.src='./generated/'+button.dataset.result;image.alt=button.dataset.title;
 document.getElementById('result-title').textContent=button.dataset.title;
 document.getElementById('result-download').href=image.getAttribute('src');
 resultDialog.showModal();
}));
document.getElementById('result-close').addEventListener('click',()=>resultDialog.close());
resultDialog.addEventListener('click',event=>{if(event.target===resultDialog){const r=resultDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)resultDialog.close();}});
