var mysql = require('mysql');
var db_config = {
    host     : 'localhost',
    user     : 'user',
    database : 'db',
    password: 'password',
    connectTimeout: 10000,
   connectionLimit: 10
};
var pool  = mysql.createPool(db_config);

pool.getConnection(function(err, connection) {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
});

pool.initializeDB = function(){
    let createTeacherStudentTable = `create table if not exists teacher_student_map(
        id int primary key auto_increment,
        teacherId varchar(255)not null,
        studentId varchar(255)not null,
        suspended tinyint(1) not null default 0
    )`;

pool.query(createTeacherStudentTable, function(err, results, fields) {
if (err) {
console.log(err.message);
}
});
}

pool.on('error', function(err) {
  console.log(err.code); // 'ER_BAD_DB_ERROR' 
  // https://www.npmjs.com/package/mysql#error-handling
});

module.exports = pool;