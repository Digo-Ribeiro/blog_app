const _main = () =>{
    getID('page_name').value = getID('from-server').innerText;
    getID('from-server').remove();
};

_main();