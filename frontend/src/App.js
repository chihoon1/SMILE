import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import QuestionSession from './QuestionSession';
import Home from './Home';

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path="/:sessionID" component={QuestionSession} />
      </Switch>
    </Router>
    
  );
}

export default App;
