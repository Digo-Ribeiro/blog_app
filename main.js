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

                sql.query(`SELECT reg_date, post_title FROM blog_posts WHERE related_to="${getPage}";`, (err, rows)=>{
                    if (err) throw err

                    let _pack = {
                        _date: [],
                        _title: []
                    }

                    for(let index of rows){
                        _pack._date.push(index.reg_date)
                        _pack._title.push(index.post_title);
                    };
                    
                    res.render(`${__dirname}/public/views/edit-page.html`,{
                        package: _pack,
                        page_name: getPage
                    });

                });

                //res.render(`${__dirname}/public/views/edit-page.html`, { page: getPage });

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

                let kill_operation = false;
                let navbar_items = req.body.navbar_items;
                navbar_items = navbar_items.split(',');

                let get_deleted_items = req.body.deleted_items;
                get_deleted_items = get_deleted_items.split(',');

               get_deleted_items.forEach((index)=>{
                sql.query(`DELETE FROM navbar WHERE menu_items = '${index}'`, (err)=>{ if(err) throw err });
                sql.query(`DELETE FROM blog_posts WHERE related_to = '${index}'`, (err)=>{ if(err) throw err });
               }); 


                navbar_items.forEach((index)=>{

                    let separator_counter = 0;
                    let getString = index.length;

                    for(let i = 0; i < getString; i++){
                        if(index[i]==':'){ separator_counter++ };
                    }

                    if(separator_counter>1){
                        print('[  ALERT  ] SQL injection detected! Operation blocked!');
                        kill_operation=true;
                    }

                });

                sql.query('SELECT menu_items FROM navbar', (err,rows)=>{

                    let saved_page = [];

                    for(let index = 0; index < rows.length; index++){
                        saved_page.push(rows[index].menu_items);
                    }

                    (!kill_operation) ? navbar_items.forEach((index)=>{

                        index = index.split(':');
                        //index_array: 0 = original; 1 = editado;

                        let já_existe = false;

                        saved_page.forEach((i)=>{
                            (index[0]==i) ? já_existe = true : false;
                        });

                        (!já_existe) ? sql.query(`INSERT INTO navbar (menu_items) VALUES ('${index[1]}')`,(err)=>{ if(err) throw err }) : false;

                        já_existe = false;

                        if(index[0]!=index[1]){
                            
                            sql.query(`UPDATE navbar SET menu_items = '${index[1]}' WHERE menu_items = '${index[0]}'`, (err)=>{ if(err) throw err });
                            sql.query(`UPDATE blog_posts SET related_to = '${index[1]}' WHERE related_to = '${index[0]}'`, (err)=>{ if(err) throw err });
                            
                        }

                    }) : false;

                });

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