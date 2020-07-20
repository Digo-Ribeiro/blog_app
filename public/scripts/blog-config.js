let navbar_items = [];
let old_navbar = [];

const get_from_server = () =>{
    let _items = getID('from-server').value;
    navbar_items = _items.split(',');
};

get_from_server();


let str_to_add = null;

const _save = (id) =>{
    str_to_add = getID(id).value
}

const _save_string = (_id) =>{
    navbar_items.splice(navbar_items.indexOf(_id), 1);
    navbar_items.push(str_to_add);
    getID('from-server').value=navbar_items;

    old_navbar = getID('old_navbar').value;
    old_navbar = old_navbar.split(',');
    old_navbar.push(`${_id}:${str_to_add}`);
    getID('old_navbar').value = old_navbar;


    alert_message('[  OK  ]', `Item "${_id}" alterado para "${str_to_add}"`, 'success');
    getID(_id).id = str_to_add;
}

const _delete_navbar_item = (id) =>{
    let _confirm = confirm('Tem certeza que deseja deletar uma página completa? Suas postagens serão perdidas...');
    if(_confirm){
        getID(`-container-${id}`).remove();
        navbar_items.splice(navbar_items.indexOf(id), 1);
        getID('from-server').value=navbar_items;
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
    let _str = `<div class="col-sm-6" style="margin-top: 25px;" id="-container-${id}">
    <div class="card">
      <div class="card-body">
        <input style="border: 0px;" type="text" id="${id}" onkeyup="_save(this.id)" class="card-title" value="${id}">
        <a href="/ePage:${id}" class="btn btn-primary">Edit Page</a>
        <button type="button" onclick="_save_string('${id}')" class="btn btn-outline-success">Confirm Changes</button>
        <button type="button" onclick="_delete_navbar_item('${id}')" class="btn btn-outline-danger">X</button>
      </div>
    </div>
  </div>`;

  getID('navbar_container').insertAdjacentHTML('afterbegin',_str);
  navbar_items.push(id);
  getID('from-server').value=navbar_items;
}