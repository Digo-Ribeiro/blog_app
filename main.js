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

        app.get(`/`, (req, res)=>{
            res.render(`${__dirname}/public/index.html`, {msg: "Teste Engine"});
        });

        sql.connect((err)=>{

            if (err) throw err
            print(`[  OK  ] MySql Connect`);

            renderFile(`scripts/js/blog-config`, `public/scripts/blog-config.js`, app);
            renderFile(`scripts/js/stdlib`, `public/scripts/stdlib.js`, app);
            renderFile(`scripts/js/edit-page`, `public/scripts/edit-page.js`, app);

            let main_pages = [];

            sql.query(`DESCRIBE pages_content`, (err, result)=>{

                if (err) throw err;

                for(let index = 2; index < result.length; index++){
                    main_pages.push(result[index].Field);
                };

                for(let index of main_pages){
                    app.get(`/pages_${index}`, (req,res)=>{
                        sql.query(`SELECT ${index} FROM pages_content`, (err, result)=>{
                            res.send(result[0][index]);
                        });
                    });
                }
                
            });

            app.post(`/savepagechanges`, (req,res)=>{

                let page = req.body.page_name;
                let content = req.body.content;

                

                let check_exists = sql.query(`SHOW COLUMNS FROM pages_content LIKE '${page}'`, (err, result)=>{
                        if (err) throw err

                        let getUndef = (result.length);

                        if(getUndef=0){
                            sql.query(`ALTER TABLE pages_content ADD ${page} VARCHAR (255)`);
                            sql.query(`INSERT INTO pages_content (${page}) VALUES ("${content}")`);
                        }else{
                            sql.query(`ALTER TABLE pages_content DROP ${page}`);
                            sql.query(`ALTER TABLE pages_content ADD ${page} VARCHAR (255)`);
                            sql.query(`INSERT INTO pages_content (${page}) VALUES ('${content}')`);
                        }

                    }
                    
                );

                res.redirect(`/ePage:${page}`);

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