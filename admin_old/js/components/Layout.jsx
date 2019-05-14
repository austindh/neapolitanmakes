import React from 'react';
import axios from 'axios';

import {
	BrowserRouter as Router,
	Route,
	Link,
	Switch,
	Redirect
} from 'react-router-dom';

import PostsList from '../components/PostsList.jsx';
import Editor from '../components/Editor.jsx';


export default class Layout extends React.Component {

	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={PostsList}></Route>
					<Route path="/editor" component={Editor}></Route>
				</Switch>
			</Router>
		);
	}
	
}
