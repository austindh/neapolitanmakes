import React from 'react';
import ReactDOM from 'react-dom';
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

import Modal from './Modal';
import PostTagEditor from './PostTagEditor';

import './Editor.scss';

export default class Editor extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			savedPost: {},
			post: {},
			bodyCursorPos: 0,
			postDeleted: false,
			goBack: false,
			nonPost: false, // used for other pages, like About Me, etc.
			tagModalOpen: false,
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
		const nonPost = !!post.url;
		this.setState({ post, savedPost, nonPost });
	}

	addImage(url) {
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
		const { post, savedPost, nonPost } = this.state;
		const endPoint = nonPost ? '/pages' : '/posts';
		axios.post(endPoint, { post }).then(res => {
			Object.assign(savedPost, post);
			this.setState({ savedPost });
		});
	}

	delete() {
		const { post, nonPost } = this.state;
		const { title } = post;
		const shouldDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
		if (!shouldDelete) {
			return;
		}

		const endPoint = nonPost ? '/pages/' : '/posts/';
		axios.delete(endPoint + post.id).then(res => {
			this.setState({ postDeleted: true });
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

	onUrlChange = e => {
		const { post } = this.state;
		post.url = e.target.value;
		this.setState({ post });
	}

	onFileChange(e) {
		const [file] = e.target.files;
		e.target.value = null;

		const reader = new FileReader();
		reader.onloadend = () => {
			const data = reader.result.split(",", 2)[1];
			axios.post('/images', { imageData: data, filename: file.name }).then(res => {
				this.addImage(`/img/${res.data.path}`)
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

	hasChanges = () => {
		const { savedPost, post } = this.state;
		const saved = Object.assign({}, savedPost);
		const current = Object.assign({}, post);
		// Don't compare tags because those are updated separately
		delete saved.tags;
		delete current.tags;
		return !_.isEqual(saved, current);
	}

	openTagModal = () => {
		this.setState({ tagModalOpen: true });
	}

	closeTagModal = () => {
		this.setState({ tagModalOpen: false });
	}

	tagsUpdated = (tags) => {
		const { post } = this.state;
		post.tags = tags;
		this.setState({ post });
	}

	goBack = () => {
		const hasChanges = this.hasChanges();
		let shouldGoBack = true;
		if (hasChanges) {
			const confirm = window.confirm('You have unsaved changes. Are you sure you want to go back?');
			if (!confirm) {
				shouldGoBack = false;
			}
		}

		if (shouldGoBack) {
			this.setState({ goBack: true });
		}
	}
	
	render() {
		const { post, postDeleted, nonPost, tagModalOpen, goBack } = this.state;

		const hasChanges = this.hasChanges();

		if (postDeleted || goBack) {
			return <Redirect to="/"/>
		}

		let { date: textDate, title, body, url } = post || {};
		body = body || '';
		let date = new Date(textDate).toDateString();

		const bodyHtml = markdown.toHTML(body);

		const secondaryInputWithDisplay = nonPost ? 
			[
				<label key="1">
					Page Url:
					<input type="text" value={url || ''} onChange={this.onUrlChange}></input>
					<span key="2">/{url}</span>
				</label>,
			] :
			[
				<label key="1" className={date === 'Invalid Date' ? 'err' : ''}>
					Post Date:
					<input type="text" value={textDate || ''} onChange={this.onDateChange}></input>
					<span key="2">{date}</span>
				</label>,
			];

		const tagsModal = ReactDOM.createPortal(
			<Modal open={tagModalOpen} onClose={this.closeTagModal}>
				<PostTagEditor post={post} onCancel={this.closeTagModal} onSave={this.tagsUpdated}></PostTagEditor>
			</Modal>,
			document.getElementById('modal')
		);

		const postTags = (post.tags || []).map((t, i) => <div key={i} className="tag">{t.name}</div>);

		return (
			<div id="editor">
				<div className="header">
					<div className="info">
						<label>
							Title:
							<input type="text" value={title || ''} onChange={this.onTitleChange}></input>
						</label>
						{secondaryInputWithDisplay}
						<div className="tags">
							{ postTags }
							<button className="edit-tags primary" onClick={this.openTagModal}>Edit tags</button>
						</div>
					</div>
					<div className="buttons">
						<button onClick={this.goBack}>Back</button>
						<button className="secondary" onClick={() => this.fileInput.current.click() }>Add Image</button>
						<input ref={this.fileInput} hidden={true} type="file" onChange={this.onFileChange}></input>
						<button className="primary" disabled={!hasChanges} onClick={this.save}>Save</button>
						<button className="warn" onClick={this.delete}>Delete</button>
					</div>
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
				{ tagsModal }
			</div>
		);
	}

}
