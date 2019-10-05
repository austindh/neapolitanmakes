import React from 'react';
import ReactDOM from 'react-dom';

import Modal from './Modal';
import { getAllCategories } from '../js/categories';
import './TagEditor.scss';
import { addTag, updateTag, deleteTag } from '../js/tags';

export default class TagEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			selectedCategory: '',
			tagName: '',
			tagId: null,
			editMode: false
		}

		getAllCategories().then(categories => {
			this.setState({ categories, selectedCategory: categories[0].id });
		})

	}

	componentDidUpdate(prevProps) {
		if (prevProps.selectedTag !== this.props.selectedTag) {
			if (this.props.selectedTag) {
				const { selectedTag: tag } = this.props;
				this.setState({ editMode: true, selectedCategory: tag.categoryId, tagName: tag.name, tagId: tag.id });
			}
		}
	}

	onClose = (reloadTags = false) => {
		this.setState({ selectedCategory: this.state.categories[0].id, tagName: '', editMode: false })
		this.props.onClose(reloadTags);
	}

	onSave = async () => {
		const { tagName: name, selectedCategory: categoryId, tagId: id, editMode } = this.state;
		if (editMode) {
			await updateTag({ id, name, categoryId });
		} else {
			await addTag(name, categoryId);
		}
		this.onClose(true);
	}

	categoryChange = e => {
		const selectedCategory = e.target.value;
		this.setState({ selectedCategory });
	}

	tagNameChange = e => {
		const tagName = e.target.value;
		this.setState({ tagName });
	}

	delete = async () => {
		const { tagName, tagId } = this.state;
		const shouldDelete = window.confirm(`Are you sure you want to delete tag "${tagName}"?`);
		if (!shouldDelete) {
			return;
		}

		await deleteTag(tagId);
		this.onClose(true);
	}

	render() {

		const { categories, selectedCategory, tagName, editMode } = this.state;
	
		const categoryOptions = categories.map((c, i) => (
			<option key={c.id} value={c.id}>{c.name}</option>
		));

		const title = editMode ? 'Edit Tag' : 'Create New Tag';
		const actionButtonText = editMode ? 'Save' : 'Create';

		const deleteButton = editMode ? 
			[<button key="del" className="warn" onClick={this.delete}>Delete</button>, <div key="space" className="spacer"></div>] :
			'';

		return ReactDOM.createPortal(
			<Modal open={this.props.open} onClose={this.onClose}>
				<div className="title">{title}</div>
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
					<div className="tag-preview">
						<div className="tag">{tagName}</div>
					</div>
				</div>
				<div className="buttons">
					{deleteButton}
					<button onClick={this.onClose}>Cancel</button>
					<button className="primary" onClick={this.onSave} disabled={!tagName}>{actionButtonText}</button>
				</div>
			</Modal>,
			document.getElementById('tag-modal')
		)
	}
}
