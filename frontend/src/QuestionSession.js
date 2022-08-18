import React from 'react';
import { useState } from 'react';
import useQuestions from './useQuestions';

const QuestionSession = (props) => {
    // just created this part for testing.
    const { sessionID } = props.match.params;
    const { questions, sendQuestions } = useQuestions(sessionID);
    const [ newQuestion, setNewQuestion] = useState("");

    const handleNewQuestionChange = (event) => {
        setNewQuestion(event.target.value);
    };

    const handleSendQuestion = () => {
        sendQuestions(newQuestion);
        setNewQuestion("");
    };

    return (
        <div className="question-session-container">
            <h1 className='session-name'>session: {sessionID}</h1>
            <div className="questions-container">
                <ol className='questions-list'>
                    { questions.map((question) => (
                        <li>{`${question.senderID} : ${question.question}`}</li>
                    ))}
                </ol>
            </div>
            <textarea
                value={newQuestion}
                onChange={handleNewQuestionChange}
                placeholder="Write your question"
                className='new-question-input-field'
            />
            <button onClick={handleSendQuestion}>Send</button>
        </div>
    );
};

export default QuestionSession;