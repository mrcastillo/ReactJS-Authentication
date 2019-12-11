const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "207.246.84.96",
    user: "fortnite-dev",
    password: "846043ant",
    database: "fortnite"
});

export const connect = (callback) => {
	connection.connect((err) => {
		if(err){
            console.error(`Error 001: There was an error connecting to the database. \n${err.stack}`);
            return;
		} else {
            return callback(connection);
        }
	});
}
