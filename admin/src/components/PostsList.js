import React from 'react';
import axios from 'axios';
import {
	Link,
	Redirect
} from 'react-router-dom';

import './PostsList.scss';

export default class Editor extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			newPost: null,
			posts: []
		};

		this.newPost = this.newPost.bind(this);
	}

	componentDidMount() {
		this.reloadPosts();
	}

	reloadPosts() {
		axios.get('/posts').then(res => {
			const { data: posts } = res;
			posts.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1); // newest at top
			this.setState({ posts });
		});
	}

	newPost() {
		axios.put('/posts').then(res => {
			const post = res.data;
			this.setState({ newPost: post });
		});
	}

	render() {

		const postList = this.state.posts.map((p, i) => {
			return (
				<tr key={i}>
					<td>
						<Link to={{
							pathname: '/editor',
							state: { post: p }
						}}>
							{p.title}
						</Link>
					</td>
					<td>{p.date}</td>
				</tr>
			);
		});

		const { newPost } = this.state;

		if (newPost) {
			return(	
				<Redirect to={{
					pathname: '/editor',
					state: { post: newPost }
				}}/>
			) 
		}

		// ATODO make preview site build site before opening up preview
		return (
			<div id="admin">
				<h1>Admin</h1>
				<button onClick={this.newPost}>New Post</button>
				<button>
					<a href="http://localhost:8082">Preview Site</a>
				</button>
				<table className="posts">
					<thead>
						<tr>
							<th>Title</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{postList}
					</tbody>
				</table>
			</div>
		);

	}

}
