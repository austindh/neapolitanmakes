/* eslint-disable react/jsx-no-target-blank */
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
			posts: [],
			pages: []
		};
	}

	componentDidMount() {
		this.reloadPostsAndPages();
	}

	reloadPostsAndPages() {

		axios.get('/posts').then(res => {
			const { data: posts } = res;
			posts.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1); // newest at top
			this.setState({ posts });
		});

		axios.get('/pages').then(res => {
			const pages = res.data;
			this.setState({ pages });
		});
	}

	newPost = () => {
		axios.put('/posts').then(res => {
			const post = res.data;
			this.setState({ newPost: post });
		});
	}

	newPage = () => {
		axios.put('/pages').then(res => {
			const page = res.data;
			this.setState({ newPost: page });
		});
	}

	render() {

		const postList = this.state.posts.map((p, i) => {
			p.tags.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
			const postTags = p.tags.map((t, i) => {
				return(
					<div key={i} className="tag">{t.name}</div>
				);
			});

			return (
				<tr key={i}>
					<td className="post-title">
						<Link to={{
							pathname: '/editor',
							state: { post: p }
						}}>
							{p.title}
						</Link>
						<div className="tags">{ postTags }</div>
					</td>
					<td className="date">{p.date}</td>
				</tr>
			);
		});

		const pageList = this.state.pages.map((p, i) => {
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
					<td className="date">/{p.url}</td>
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
				<h1>NeapolitanMakes Admin</h1>
				<div className="preview">
					<a href="http://localhost:8082" target="_blank">
						<button className="secondary">Preview Site</button>
					</a>
				</div>
				<div className="card">
					<div className="title">Blog Posts</div>
					<div className="top-right">
						<button className="primary" onClick={this.newPost}>New Post</button>
					</div>
					<div className="posts">
						<table>
							<thead>
								<tr>
									<th className="table-title">Title</th>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>
								{postList}
							</tbody>
						</table>
					</div>
				</div>
				<div className="card">
					<div className="title">Pages</div>
					<div className="top-right">
						<button className="primary" onClick={this.newPage}>New Page</button>
					</div>
					<table className="pages">
						<thead>
							<tr>
								<th className="table-title">Title</th>
								<th>url</th>
							</tr>
						</thead>
						<tbody>
							{pageList}
						</tbody>
					</table>
				</div>
			</div>
		);

	}

}
