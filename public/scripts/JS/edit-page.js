let socket = io();
let page_name = null;

const _main = () =>{
    page_name = getID('from-server').innerText;
    getID('from-server').remove();
};

socket.on('package', (pack)=>{
    getID('post_title').value = pack._title;
    getID('post_description').value = pack._description;
    getID('content').innerHTML = pack._content;
    getID('reader').scrollIntoView();
});

socket.on('save_reload', (save_info)=>{
    alert(save_info);
    window.location.href = `/ePage:${page_name}`;
});

const _send_to_delete = (id) =>{

    let _str = `${page_name}:${id}`

    socket.emit('post', _str);

};

socket.on('deleted_info', (str)=>{
    alert(str);
    window.location.href = `/ePage:${page_name}`;
});

const delete_post = (id) =>{

    let _str = `${page_name}:${id}`

    let _get_confirm = confirm(`Tem certesa disso? [ ALERT ] Sua publicação "${id}" será apagada para sempre!`);

    (_get_confirm) ? socket.emit('delete_post', _str) : ()=>{return false} ;

};

const save_publish = () =>{

    let send_pack = {
        _title: getID('post_title').value,
        _description: getID('post_description').value,
        _content: getID('content').innerHTML,
        _page: page_name
    }

    socket.emit('save_publish', send_pack);

};



getID('file').onchange = function (evt) {

    let tgt = evt.target || window.event.srcElement, files = tgt.files;

    if (FileReader && files && files.length) {

        var fr = new FileReader();

        fr.onload = () => {
            let elem = document.createElement('img');
            elem.src = fr.result;
            elem.width = 500;
            elem.id = "user-image";
            elem.className = "ui-resizable";
            getID('content').appendChild(elem);
        }

        fr.readAsDataURL(files[0]);

    }


}

getID('add_shell').addEventListener('click',(event)=>{
    
    let elemss = document.createElement('div');
    elemss.innerHTML = '<br />';
    getID('content').appendChild(elemss);
    let elem = document.createElement('div');
    elem.id = 'shell_command';
    elem.innerHTML = '<span style="color: #98c379;"> user:~/$ </span> command';
    getID('content').appendChild(elem);
    let elems = document.createElement('div');
    elems.innerHTML = '<br />';
    getID('content').appendChild(elems);
   
    

},false);

getID('add_space').addEventListener('click',(event)=>{
    
    let elem = document.createElement('div');
    elem.innerHTML = '<br />';
    getID('content').appendChild(elem);

    

},false);




_main();