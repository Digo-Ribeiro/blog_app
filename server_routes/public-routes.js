'use strict'


exports.public_routes = (app, sql) =>{


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

    app.get(`/`, (req,res)=>{

        let get_menu = [];

        sql.query(`SELECT menu_items FROM navbar`, (err, rows)=>{
            for(let index of rows){
                get_menu.push(index.menu_items);
            }

            res.render(`../public/index.html`, { navbar: get_menu });
        });

    });

}