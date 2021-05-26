import './App.scss';
import {BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Solitaire from './View/Solitaire'
import Home from './View/Home'

function App() {
  return (
    <Router>
        <Switch>
          <Route path="/home">
            <Home/>
          </Route>
          <Route path="/solitaire">
            <Solitaire />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
