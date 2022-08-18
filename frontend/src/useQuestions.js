import { useState, useEffect, useRef } from 'react';
import socketIOClient from "socket.io-client";

const NEW_QUESTION_EVENT = "newQuestionMessage";
const SOCKET_SERVER_URL = "http://localhost:4000";  // temporary socket server endpoint

const useQuestion = (sessionID) => {
    const [questions, setQuestions] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
            query: { sessionID }
        });

        socketRef.current.on("initial connection", (data) => {
            console.log("heard initial connection");
            console.log(`current incoming messages ${data}`);
            setQuestions((questions) => [...data]);
        });

        socketRef.current.on(NEW_QUESTION_EVENT, (message) => {
            console.log(`new message received ${ message}`);
            setQuestions((questions) => [...questions, message] );
            console.log(`In front end, questions updated to: ${questions}`);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const sendQuestions = (questionBody) => {
        socketRef.current.emit(NEW_QUESTION_EVENT, {
            body: questionBody,
            senderID: socketRef.current.id,  // to be updated to user name
        });
    };

    return { questions, sendQuestions};
}

export default useQuestion;