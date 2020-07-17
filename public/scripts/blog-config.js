'use strict'

let send_menu = [];

const renderElem = (elemType, id, appendchild, str, vlu, _type) =>{
    
    let elem = document.createElement(elemType);
    elem.id = id;
    elem.innerText = str;
    elem.value = vlu;
    elem.type = _type;

    if(elemType=='a'){
        elem.href = `/ePage:${id}`;
    }

    getID(appendchild).appendChild(elem);

    if(_type=='button'){
        elem.addEventListener('click', ()=>{ delButton(elem.id) } ,false);
    }
    
};

const get_response = () =>{
    let res = getID('from-server').innerText;
    res = res.split(',');

    getID('from-server').remove();

    res.forEach(index => {
        renderElem('a', index, 'actual-pages', index, null, null);

        renderElem('input', `_${index}`, 'actual-pages', null, 'X', 'button');

        send_menu.push(index)
    });

    insert_into_send_menu();

};

const delButton = (id) =>{

    id = id.replace('_', '');
    send_menu.splice(send_menu.indexOf[id], 1);
    getID(id).remove();
    insert_into_send_menu();
    getID(`_${id}`).remove();

};

const insert_into_send_menu = () =>{
    getID('send-menu').value = (send_menu.join(','));
};

const addItem = getID('add-menu').addEventListener(`click`,()=>{

    let index = (getID('menu-text').value);

    for(let i of send_menu){
        if(i==index){
            alert('Item Duplicado!');
            return false;
        }
    }

    renderElem('p', index, 'actual-pages', index, null, null);
    renderElem('input', `_${index}`, index, null, 'X', 'button');
    send_menu.push(index);
    insert_into_send_menu();

},false);

get_response();