const mysql = require('mysql');

const con = mysql.createConnection({
    // host: "ti-dev-instance-1.coaemr3aq8th.ap-south-1.rds.amazonaws.com",
    host: "34.47.206.4",
    user: "new_dev",
    password: "StrongPassword123!",
    database: "ti_dev_copy"
});

con.connect((err) => {
    // if (err) throw err;
    if (err) {
        console.log(err);
    } else {
        console.log("MYSQL Database Connected!");
    }
});

module.exports = con;