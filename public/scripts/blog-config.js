'use strict'

let str_to_add = null;

const _delete_navbar_item = (id) =>{
    let _confirm = confirm('Tem certeza que deseja deletar uma página completa? Suas postagens serão perdidas...');
    if(_confirm){
        getID(`-container-${id}`).remove();
        alert_message('[  OK  ] ', `A página "${id}" foi apagada! Ainda é possível recuperar sua página, aperte F5 para retroceder está ação, clique em Save para deletar definitivamente.`,'danger');
    }
};

const alert_message = (alertTitle, alertMessage, alertType) =>{
    let _str = `<div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
    <strong>${alertTitle}</strong> ${alertMessage}
    <button tyape="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`;

  getID('alert_message').insertAdjacentHTML('afterend',_str);
};

const addnewpage = (id) =>{

  if(getID('page-name').value == ""){
    return false;
  }

  getID('page-name').value="";

  let index_value = getID('items_length').value;
  index_value = parseInt(index_value);

    let _str = `<div class="col-sm-6" style="margin-top: 25px;" id="-container-${id}">
    <div class="card">
      <div class="card-body">
        <span id="->${index_value}"><input autocomplete="false" style="border: 0px;" type="text" id="${id}" class="card-title" value="${id}">
        <a href="/ePage:${id}" class="btn btn-primary">Edit Page</a>
        <button type="button" class="btn btn-outline-danger">X</button>
      </div>
    </div>
  </div>`;

  getID('navbar_container').insertAdjacentHTML('afterbegin',_str);
  index_value++;
  getID('items_length').value = index_value;

  alert_message('[ OK ]', `Adicionado "${id}" ao menu`, 'success');
  
}

const _perform_submit = () =>{

  let navbar_index = getID('items_length').value;
  let navbar_items = [];

  for(let index = 0; index < navbar_index; index++){

    let perform_id = `->${index}`;
    
    navbar_items.push(`${getID(perform_id).childNodes[0].id}:${getID(perform_id).childNodes[0].value}`);

    getID('navbar').value = navbar_items;
  };

};