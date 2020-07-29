'use strict'

// -> Important ( SERVER-CONFIGURATIONS ) START

const server_listen_port = 3000; // ! IMPORTANT ! NOT NULL !

// -> ( SERVER-CONFIGURATIONS ) END


// -> (GLOBAL VARIABLES) START

const { echo } = require('./stdlib.js');

const express = require('express');
const app = new express;
const ejs = require('ejs');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { sql } = require('./sql-conn.js');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

// -> (GLOBAL VARIABLES) END

const start_server = () =>{

    app.set('views', `${__dirname}/public`);
    app.engine('html', ejs.renderFile);
    app.set('view engine', 'html');
    app.use(express.urlencoded());
    app.use('/images', express.static(`${__dirname}/public/images`))

    routes();

    http.listen(server_listen_port, ()=>{ echo(`[  OK  ] Server Started at port ${server_listen_port}`)});

};

const renderFile = (target, filename) =>{
    app.get(`/${target}`, (req,res)=>{
        res.sendFile(filename);
    });
};

const routes = () =>{

    renderFile(`scripts/js/blog-config`, `${__dirname}/public/scripts/JS/blog-config.js`);
    renderFile(`scripts/js/stdlib`, `${__dirname}/public/scripts/JS/stdlib.js`);
    renderFile(`scripts/js/edit-page`, `${__dirname}/public/scripts/JS/edit-page.js`);
    renderFile(`scripts/js/index`, `${__dirname}/public/scripts/JS/index.js`);
    renderFile(`scripts/js/page-post-select`, `${__dirname}/public/scripts/JS/page-post-select.js`);

    app.post('/upload', (req,res)=>{

        var form = new formidable.IncomingForm();

        form.parse(req, function (err, fields, files) {

            var oldpath = files.file.path;
            var newpath = `${__dirname}/public/images/${files.file.name}`;

            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });

        });

    });

    app.get(`/`, (req,res)=>{

        let get_menu = [];

        sql.query(`SELECT menu_items FROM navbar`, (err, rows)=>{
            for(let index of rows){
                get_menu.push(index.menu_items);
            }

            res.render(`../public/index.html`, { navbar: get_menu });
        });

    });

    app.get('/pages_content:page&:post', (req,res)=>{

        let _related = req.params.page;
        let _posts = req.params.post;

        _related = _related.replace(':', '');
        _posts = _posts.replace(':', '');

        sql.query(`SELECT post_content FROM blog_posts WHERE (related_to = '${_related}' AND post_title = '${_posts}')`, (err, rows)=>{
            if (err) throw err

            res.render(`../public/views/page-post-view.html`, { content: rows[0].post_content });
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
            
            res.render(`../public/views/page-post-select.html`,{
                package: _pack,
                page_name: req.params.page
            });

        });

    });


    io.sockets.on('connection', (socket)=>{

        socket.on('delete_post', (id)=>{

            id = id.split(':');

            sql.query(`SELECT id FROM blog_posts WHERE (post_title='${id[1]}' AND related_to='${id[0]}')`, (err,rows)=>{
                if(err) throw err
                sql.query(`DELETE FROM blog_posts WHERE id='${rows[0].id}'`);
                socket.emit('deleted_info', 'Post Apagado!');
            });

        });

        socket.on('post', (id)=>{
            
            id = id.split(':');

            sql.query(`SELECT post_title, post_description, post_content FROM blog_posts WHERE (post_title='${id[1]}' AND related_to = '${id[0]}')`, (err, rows)=>{
                if(err) throw err

                let _pack = {
                    _title: rows[0].post_title,
                    _description: rows[0].post_description,
                    _content: rows[0].post_content
                }

                socket.emit('package', _pack);

            });

        });

        socket.on('save_publish', (_pack)=>{

            sql.query(` SELECT id FROM blog_posts WHERE post_title = '${_pack._title}' `,(err, rows)=>{ 
                if(err) throw err

                if(rows.length!=0){

                    sql.query(` SELECT * FROM blog_posts WHERE id = '${rows[0].id}' `, (err, rows)=>{
                        if(err) throw err

                        sql.query(` DELETE FROM blog_posts WHERE id = '${rows[0].id}' `, (err)=>{if(err)throw err});

                        sql.query(`INSERT INTO blog_posts (post_title, post_description, post_content, related_to) VALUES ('${_pack._title}', '${_pack._description}', '${_pack._content}', '${_pack._page}')`, (err)=>{ if(err) throw err});

                        socket.emit('save_reload', 'Post salvo e publicado!');
                    });

                }else{

                    sql.query(`INSERT INTO blog_posts (post_title, post_description,post_content,related_to) VALUES ('${_pack._title}', '${_pack._description}', '${_pack._content}', '${_pack._page}')`);
                    socket.emit('save_reload', 'Post salvo e publicado!');

                };


                
                
            });

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

};


start_server();