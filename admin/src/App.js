import React from 'react';
import logo from './logo.svg';
import './App.scss';

import {
	BrowserRouter as Router,
	Route,
	Link,
	Switch,
	Redirect
} from 'react-router-dom';

import PostsList from './components/PostsList';
import Editor from './components/Editor';

function App() {
  return (
    <Router>
				<Switch>
					<Route exact path="/" component={PostsList}></Route>
					<Route path="/editor" component={Editor}></Route>
				</Switch>
			</Router>
  );
}

export default App;
