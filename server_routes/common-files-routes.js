'use strict'

const { renderFile } = require('../stdlib.js');

exports.files_routes = (app) =>{

    renderFile(`scripts/js/blog-config`, `../public/scripts/blog-config.js`, app);
    renderFile(`scripts/js/stdlib`, `../public/scripts/stdlib.js`, app);
    renderFile(`scripts/js/edit-page`, `../public/scripts/edit-page.js`, app);
    renderFile(`scripts/js/index`, `../public/scripts/index.js`, app);
    renderFile(`scripts/js/page-post-select`, `../public/scripts/page-post-select.js`, app);

}