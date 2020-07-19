'use strict'

const {print, renderFile} = require('./stdlib.js');
const { sql } = require('./sql-conn.js');

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
        this.frontEndFilesPath = (type)=>{
            let types = {
                _js: (type==`js`) ? true : false,
                _css: (type==`css`) ? true : false
            };

            if(types._js){
                return `/scripts/js/`;
            }else{
                return `/scripts/css/`
            }

        };
    }

    _render(){
        const app = this.server._start();

        sql.connect((err)=>{

            if (err) throw err
            print(`[  OK  ] MySql Connect`);

            renderFile(`scripts/js/blog-config`, `public/scripts/blog-config.js`, app);
            renderFile(`scripts/js/stdlib`, `public/scripts/stdlib.js`, app);
            renderFile(`scripts/js/edit-page`, `public/scripts/edit-page.js`, app);
            renderFile(`scripts/js/index`, `public/scripts/index.js`, app);
            renderFile(`scripts/js/page-post-select`, `public/scripts/page-post-select.js`, app);

            app.locals.pointer = ['Hello', 'From', 'Server'];

            app.get('/pages_content:page&:post', (req,res)=>{

                let _related = req.params.page;
                let _posts = req.params.post;

                _related = _related.replace(':', '');
                _posts = _posts.replace(':', '');

                sql.query(`SELECT post_content FROM blog_posts WHERE (related_to = '${_related}' AND post_title = '${_posts}')`, (err, rows)=>{
                    if (err) throw err

                    res.send(rows[0].post_content);
                });

            });

            app.get(`/pages_:page`, (req,res)=>{

                sql.query(`SELECT reg_date, post_title,post_description FROM blog_posts WHERE related_to="${req.params.page}";`, (err, rows)=>{
                    if (err) throw err

                    let _pack = {
                        _date: [],
                        _title: [],
                        _description: []
                    }

                    for(let index of rows){
                        _pack._date.push(index.reg_date)
                        _pack._title.push(index.post_title);
                        _pack._description.push(index.post_description); 
                    };
                    
                    res.render(`${__dirname}/public/views/page-post-select.html`,{
                        package: _pack,
                        page_name: req.params.page
                    });

                });

            });

            app.get(`/`, (req,res)=>{

                let get_menu = [];

                sql.query(`SELECT menu_items FROM navbar`, (err, rows)=>{
                    for(let index of rows){
                        get_menu.push(index.menu_items);
                    }

                    res.render(`${__dirname}/public/index.html`, { navbar: get_menu });
                });

            });

            app.post(`/savePost`, (req,res)=>{

                let send_to_db = {
                    post_title: req.body.title,
                    post_description: req.body.description,
                    post_content: req.body.content,
                    post_related: req.body.related
                };

                sql.query(`INSERT INTO blog_posts (post_title,post_description,post_content,related_to) VALUES ('${send_to_db.post_title}', '${send_to_db.post_description}','${send_to_db.post_content}','${send_to_db.post_related}')`, (err)=>{if (err) throw err});


                res.redirect(`/cPanel`);

            });

            app.get(`/ePage:id`, (req,res)=>{

                let getPage = req.params.id;
                getPage= getPage.replace(':', '');
                res.render(`${__dirname}/public/views/edit-page.html`, { page: getPage });

            });

            app.get(`/cPanel`, (req,res)=>{

                sql.query(`SELECT menu_items FROM navbar`, (err, rows)=>{
                    if (err) throw err

                    let result = []

                    for(let index = 0; index < rows.length; index++){
                        result.push(rows[index].menu_items);
                    }

                    res.render(`${__dirname}/public/views/blog-config.html`, {
                        pages:  result
                    })
                    

                });
            });

            app.post(`/setnewconfiguration`, (req,res)=>{

                let menu_items = req.body.menu;
                menu_items = menu_items.split(',');

                sql.query(`DELETE FROM navbar`,(err)=>{
                    if (err) throw err
                });
                
                for(let index of menu_items){
                    sql.query(`INSERT INTO navbar (menu_items) VALUES ("${index}")`, (err)=>{
                        if (err) throw err
                    });
                };

                res.redirect('/cPanel');
            });

        });

    

        this.server._listen();
    }

};


const start = () =>{
    let main = new server_structure;
    main._render();
}

start();