'use strict'

const mysql = require('mysql');
const {print} = require('./stdlib.js');

exports.sql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blogApp'
});

/*
sql.connect((err)=>{
    if (err) throw err
    print(`[  OK  ] MySql Connect`);
});

    sql.query(`ALTER TABLE navbar ADD teste VARCHAR(255);`, (err, result)=>{
        if (err) throw err
        print(result.affectedRows);
    });
*/