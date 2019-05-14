import React from 'react';
import axios from 'axios';
import _ from 'underscore';
import {
	BrowserRouter as Router,
	Route,
	Link,
	Switch,
	Redirect
} from 'react-router-dom';
import { markdown } from 'markdown';
import ReactHtmlParser from 'react-html-parser';

import './Editor.scss';

export default class Editor extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			savedPost: {},
			post: {},
			bodyCursorPos: 0,
			postDeleted: false
		}

		this.bodyText = React.createRef();
		this.fileInput = React.createRef();

		this.addImage = this.addImage.bind(this);
		this.save = this.save.bind(this);
		this.delete = this.delete.bind(this);

		this.onTitleChange = this.onTitleChange.bind(this);
		this.onDateChange = this.onDateChange.bind(this);
		this.onBodyChange = this.onBodyChange.bind(this);
		this.onBodyBlur = this.onBodyBlur.bind(this);
		this.onFileChange = this.onFileChange.bind(this);
	}
	
	componentDidMount() {
		const { state } = this.props.location || {};
		const { post } = state || {};
		const savedPost = Object.assign({}, post);
		this.setState({ post, savedPost });
	}

	addImage(url) {
		// TODO allow name change on image
		
		const textarea = this.bodyText.current;

		let { bodyCursorPos } = this.state;
		const val = textarea.value;
		const beforeText = val.substring(0, bodyCursorPos);
		const afterText = val.substring(bodyCursorPos, val.length);

		const imgMarkdown = `![Image](${url})`;

		const body = [beforeText, imgMarkdown, afterText].join('');
		bodyCursorPos += imgMarkdown.length;

		let { post } = this.state;
		post.body = body;
		this.setState({ post });

		textarea.focus();
		setTimeout(() => {
			this.bodyText.current.setSelectionRange(bodyCursorPos, bodyCursorPos);
		});

	}

	save() {
		const { post, savedPost } = this.state;
		axios.post('/posts', { post }).then(res => {
			Object.assign(savedPost, post);
			this.setState({ savedPost });
			console.log( 'res:', res );
		});
	}

	delete() {
		const { post } = this.state;
		const { title } = post;
		const shouldDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
		if (!shouldDelete) {
			return;
		}

		axios.delete('/posts/' + post.id).then(res => {
			this.setState({ postDeleted: true });
			console.log( 'res:', res );
		});
	}

	onTitleChange(e) {
		const { post } = this.state;
		post.title = e.target.value;
		this.setState({ post });
	}

	onDateChange(e) {
		const { post } = this.state;
		post.date = e.target.value;
		this.setState({ post });
	}

	onFileChange(e) {
		const [file] = e.target.files;
		e.target.value = null;

		const reader = new FileReader();
		reader.onloadend = () => {
			const data = reader.result.split(",", 2)[1];
			axios.post('/images', { imageData: data, filename: file.name }).then(res => {
				this.addImage(`/temp/${file.name}`)
			});
		};
		reader.readAsDataURL(file);
	}

	onBodyChange(e) {
		const { post } = this.state;
		post.body = e.target.value;
		this.setState({ post });
	}

	// save cursor position so we can place text where it was placed
	onBodyBlur(e) {
		const bodyCursorPos = e.target.selectionStart;
		this.setState({ bodyCursorPos });
	}
	
	render() {
		const { savedPost, post, postDeleted } = this.state;

		const hasChanges = !_.isEqual(savedPost, post);

		if (postDeleted) {
			return <Redirect to="/"/>
		}

		let { date: textDate, title, body } = post || {};
		body = body || '';
		let date = new Date(textDate).toDateString();

		const bodyHtml = markdown.toHTML(body);

		return (
			<div id="editor">
				<div className="header">
					<Link to={{
						pathname: '/',
						state: { reloadPosts: true }
					}}>
						<button>Back</button>
					</Link>
					<button onClick={() => this.fileInput.current.click() }>Add Image</button>
					<input ref={this.fileInput} hidden={true} type="file" onChange={this.onFileChange}></input>
					<button className="" disabled={!hasChanges} onClick={this.save}>Save</button>
					<button className="" onClick={this.delete}>Delete</button>
				</div>
				<div className="info">
					<input type="text" value={title} onChange={this.onTitleChange}></input>
					<input type="text" value={textDate} onChange={this.onDateChange}></input>
					<span>{date}</span>
				</div>
				<div className="main">
					<textarea ref={this.bodyText} value={body} onChange={this.onBodyChange} 
						onBlur={this.onBodyBlur}></textarea>
					<div className="post">
						<h1>{title}</h1>
						<hr />
						{ ReactHtmlParser(bodyHtml) }
					</div>
				</div>
			</div>
		);
	}

}
