import React from 'react';
import { getAllTags } from '../js/tags';

import './PostTagEditor.scss';

export default class PostTagEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTags: new Set(),
			allTags: [],
			searchText: ''
		}

		getAllTags().then(tags => {
			tags.sort((a, b) => {
				return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
			});
			this.setState({ allTags: tags });
		});
	}

	resetTags = () => {
		const currentPost = this.props.post || {};
		const currentTags = currentPost.tags || [];
		const currentTagIds = currentTags.map(t => t.id);
		this.setState({ currentTags: new Set(currentTagIds) });
	}

	componentDidUpdate(prevProps) {
		const currentPost = this.props.post || {};
		const prevPost = prevProps.post || {};
		const currentTags = currentPost.tags || [];
		const prevTags = prevPost.tags || [];

		if (currentTags.length !== prevTags.length) {
			this.resetTags();
		}
	}

	addTag = id => {
		console.log('add');
		const currentTags = new Set(this.state.currentTags);
		currentTags.add(id);
		this.setState({ currentTags });
	}
	
	removeTag = id => {
		console.log('remove');
		const currentTags = new Set(this.state.currentTags);
		currentTags.delete(id);
		this.setState({ currentTags });
	}

	onCancel = () => {
		this.props.onCancel();
		this.resetTags();
		this.setState({ searchText: '' });
	}

	onSearchTextChange = e => {
		const searchText = e.target.value;
		this.setState({ searchText });
	}

	render() {

		const { allTags, currentTags, searchText } = this.state;

		const makeTagCurrent = (t, i) => <div className="tag current" key={i} onClick={() => this.removeTag(t.id)}>{t.name}</div>;
		const makeTag = (t, i) => <div className="tag" key={i} onClick={() => this.addTag(t.id)}>{t.name}</div>;
		const current = allTags.filter(t => currentTags.has(t.id));
		
		const filterText = searchText.toLowerCase().trim();
		const other = allTags.filter(t => {
			if (currentTags.has(t.id)) {
				return false;
			}
			return t.name.toLowerCase().includes(filterText);
		});

		const currentEls = current.map(makeTagCurrent);
		const otherEls = other.map(makeTag);

		return (
			<div id="post-tags-modal">
				<div className="title">Post Tags</div>
				<div className="body">
					<div className="tags">{ currentEls }</div>
					<div className="divider"></div>
					<input type="text" placeholder="search..." value={searchText} onChange={this.onSearchTextChange}></input>
					<div className="tags">{ otherEls }</div>
				</div>
				<div className="buttons">
					<button onClick={this.onCancel}>Cancel</button>
					<button className="primary">Save</button>
				</div>
			</div>
		);
	}
}
