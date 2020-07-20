const getid = (id) =>{
    return document.getElementById(id);
}

const changeCSS = (wd, trans, id)=>{
    getid(id).style.width = `${wd}%`;
    getid(id).style.transition = `${trans}s linear`;
}


getid('check').addEventListener(`click`,()=>{

    let _getCheck = getid('check').checked;

    if(_getCheck){
        changeCSS(78, 1, 'check');
    };

    if(!_getCheck){
        changeCSS(100, 1, 'check');
    };

},false);
