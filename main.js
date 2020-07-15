'use strict'

const {print, renderFile} = require('./stdlib.js');

const net = {
    express: require('express'),
    app: null,
    ejs: require('ejs'),
    port: 3000
};

class server {

    constructor(){

        net.app = new net.express;

        this.express = net.express
        this.app = net.app;
        this.ejs = net.ejs;
        this.port = net.port

    }

    _start(){
        this.app.set('views', `${__dirname}/public`);
        this.app.engine('html', this.ejs.renderFile);
        this.app.set('view engine', 'html');
        this.app.use(this.express.urlencoded());
        return this.app;
    }

    _listen(){
        this.app.listen(this.port, ()=>{ print(`[  OK  ] Server Started at port ${this.port}`) });
    }

};

class server_structure {

    constructor(){
        this.server = new server;
    }

    _render(){
        const app = this.server._start();

        app.get(`/`, (req, res)=>{
            res.send(`Hello World!!`);
            res.end();
        });

        app.end();

        this.server._listen();
    }

};


const start = () =>{
    let main = new server_structure;
    main._render();
}



start();