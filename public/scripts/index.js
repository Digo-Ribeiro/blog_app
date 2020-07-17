let menu_items = []

const _main = () =>{
    let res = getID('from-server').innerText;
    res = res.split(',');
    menu_items = res;
    printf(res)
    getID('from-server').remove();
    _showMenu();
};

const _showMenu = () =>{
    menu_items.forEach(index => {

        let elem = document.createElement('a');
        elem.innerText = index;
        elem.href = `/pages_${index}`;
        getID('menu').appendChild(elem);
        
    });
};

_main();