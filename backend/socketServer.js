// npm install express --save
// npm install socket.io --save
// npm install mongodb
const http = require("http");
const httpServer = http.createServer();
const { Server } = require("socket.io");

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    },
});


function socketMain(url, port, dbName) {
    // param: url is url to mongo db database
    // param: port is endpoint to the socket server
    // if accessing database is not needed, delete url and dbName param
    // also, delete db connection part and dbConnection function invocation

    // connecting to the mongo db database
    const dbConnection = require('./dbConnection');
    const db_url = url
    // db connection part ended

    const PORT = port;
    const NEW_QUESTION_EVENT = "newQuestionMessage";

    io.on("connection", (socket) => {
        const { sessionID } = socket.handshake.query;
        socket.join(sessionID);
        console.log(`joining activity session ${sessionID} for questions`);
        
        
        // assumption: I assumed session collection has array
        // containing all questions created in that session
        // althought SMILE2012 version didn't have such data in schema
        // fetching saved questions from the previous acticities in the session
        dbConnection(db_url, { sessionID: sessionID }, dbName)
            .then((data) => {
                console.log("In the socket",data);
                const savedQuestions = [];
                if (data) {
                    for (let i = 0; i < data.length; i++) {
                        savedQuestions.push(data[i]);
                    }
                }
                // saved questions will only send to the user just joined the session
                socket.emit("initial connection", savedQuestions);
                console.log(savedQuestions)
            });

        socket.on(NEW_QUESTION_EVENT, (data) => {
            // sending new question to every one in the session when question received
            var new_question = {
                question: data.body,
                senderID: data.senderID
            }
            io.in(sessionID).emit(NEW_QUESTION_EVENT, new_question);
            // adding new question to mongdo db
            dbConnection(db_url, { sessionID: sessionID, newQuestion: new_question}, dbName);
        },);

        socket.on("disconnect", () => {
            socket.leave(sessionID);
        });
    });

    httpServer.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

module.exports = socketMain;