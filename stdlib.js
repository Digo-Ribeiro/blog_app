//Standart library to Node

exports.int = (str) =>{
    //Verify if the param is an integer number and returns it if is true
    let int = parseInt(str)
    if(isNaN(int)) { return int }
}

exports.char = (str) =>{
    //Verify if the param is an string and returns it if is true
    let char = parseFloat(str)
    if(isNaN(char)!=true) { return char }
}

exports.print = (con, http, res) =>{
    //Print 'con' in console, if http is true, print in console of your http page

    if(http){
        return res.send(`<script> console.log("${con}") </script>`)
    }

    return console.log(con)
}

exports.printf = (con, times) =>{
    //Print 'con' in console many 'times'
    for(let i = 0; i < times; i++){
        console.log(con)
    }
}

exports.httpRenderCode = (str, res) =>{
    return res.send(`<script> ${str} </script>`)
}

exports.renderFile = (path, file, app) =>{
    return app.get(`/${path}`, (req, res)=>{res.sendFile(`${__dirname}/${file}`)})
}

