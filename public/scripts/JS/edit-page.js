let socket = io();
let page_name = null;

const _main = () =>{
    page_name = getID('from-server').innerText;
    getID('from-server').remove();
};

socket.on('package', (pack)=>{
    getID('post_title').value = pack._title;
    getID('post_description').value = pack._description;
    getID('post_content').value = pack._content;
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
        _content: getID('post_content').value,
        _page: page_name
    }

    socket.emit('save_publish', send_pack);

};

_main();