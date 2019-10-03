import React from 'react';
import ReactDOM from 'react-dom';

import Modal from './Modal';
import { getAllCategories } from '../js/categories';
import './TagEditor.scss';

export default class TagEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			selectedCategory: '',
			tagName: ''
		}

		getAllCategories().then(categories => {
			this.setState({ categories, selectedCategory: categories[0].id });
		})

	}

	componentDidUpdate(prevProps) {
		// const currentPost = this.props.post || {};
		// const prevPost = prevProps.post || {};
		// const currentTags = currentPost.tags || [];
		// const prevTags = prevPost.tags || [];

		// if (currentTags.length !== prevTags.length || currentPost.id !== prevPost.id) {
		// 	this.resetTags();
		// }
	}

	onClose = () => {
		this.setState({ selectedCategory: this.state.categories[0].id, tagName: '' })
		this.props.onClose();
	}

	onSave = () => {
		console.log('save');
	}

	categoryChange = e => {
		const selectedCategory = e.target.value;
		this.setState({ selectedCategory });
	}

	tagNameChange = e => {
		const tagName = e.target.value;
		this.setState({ tagName });
	}

	render() {

		const { categories, selectedCategory, tagName } = this.state;
	
		const categoryOptions = categories.map((c, i) => (
			<option key={c.id} value={c.id}>{c.name}</option>
		));

		return ReactDOM.createPortal(
			<Modal open={this.props.open} onClose={this.onClose}>
				<div className="title">Create New Tag</div>
				<div className="body">
					<label>
						<span>Category:</span>
						<select value={selectedCategory} onChange={this.categoryChange}>
							{categoryOptions}
						</select>
					</label>
					<label>
						<span>Name:</span>
						<input type="text" value={tagName} onChange={this.tagNameChange}></input>
					</label>
					<div className="tag">{tagName}</div>
				</div>
				<div className="buttons">
					<button onClick={this.onClose}>Cancel</button>
					<button className="primary" onClick={this.onSave} disabled={!tagName}>Create</button>
				</div>
			</Modal>,
			document.getElementById('tag-modal')
		)
	}
}
