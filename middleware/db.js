const mysql = require("mysql2/promise");

const useDB = mysql.createPool({
    user : 'root',
    password : '0000',
    port : 15628,
    database : 'cafe_team'
});

module.exports = useDB;