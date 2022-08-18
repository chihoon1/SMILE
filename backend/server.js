const socketMain = require('./socketServer');

// use the mongodb atlas url for the smile project
// use the dbname where session collection is stored
const url = "mogodb_atlas_url";
const dbName = "dbname"


const port = 4000;
socketMain(url, port, dbName);