const _main = () =>{
    getID('to_server').value = getID('from-server').innerText;
    getID('from-server').remove();
};

_main();