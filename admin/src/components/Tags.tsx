import React from 'react';
import {
	Link,
} from 'react-router-dom';


import './Tags.scss';
import { getAllTags } from '../js/tags';
import TagEditor from './TagEditor';

export default class Tags extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = {
			tags: [],
			searchText: '',
			selectedTag: null,
			addingNewTag: false
		}
		this.loadTags();
	}
	
	loadTags = () => {
		getAllTags().then(tags => {
			this.setState({ tags });
		})
	}

	onInputChange = e => {
		const searchText = e.target.value;
		this.setState({ searchText });
	}

	onClose = (reloadTags) => {
		if (reloadTags) {
			this.loadTags();
		}
		this.setState({ selectedTag: null, addingNewTag: false });
	}

	selectTag = tag => {
		this.setState({ selectedTag: tag });
	}

	addNewTag = () => {
		this.setState({ addingNewTag: true });
	}

	render() {
		const { tags, searchText, selectedTag, addingNewTag } = this.state;
		const tagEls = tags
			.filter(t => t.name.toLowerCase().includes(searchText.toLowerCase()))
			.map(t => <div className="tag" key={t.id} onClick={() => this.selectTag(t)}>{t.name}<span className="count">{t.count}</span></div>)

		return (
			<div id="admin" className="tags-page">
				<h1>Manage Tags</h1>
				<div className="preview">
					<div className="buttons">
					<Link to={{
						pathname: '/',
					}}>
						<button>Back</button>
					</Link>
					</div>
				</div>
				<div className="card">
					<div>
						<input placeholder="search" value={searchText} onChange={this.onInputChange}></input>
						<button className="secondary" onClick={this.addNewTag}>+ New Tag</button>
					</div>
					<div className="tags">
						{tagEls}
					</div>
				</div>
				<TagEditor open={!!selectedTag || addingNewTag} onClose={this.onClose} selectedTag={selectedTag}></TagEditor>
			</div>
		);
	}
}
