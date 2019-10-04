import axios from 'axios';

let tagsCached;
let tagsCountCached;

const clearCaches = () => {
	tagsCached = null;
	tagsCountCached = null;
}

export const getAllTags = () => {
	if (!tagsCached) {
		tagsCached = axios.get('/posttags').then(res => {
			const tags = res.data;
			tags.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
			return tags;
		});
	}
	return tagsCached;
};

export const updateTags = (postId, tagIds) => {
	return axios.post('/posttags/post', { postId, tagIds }).then(res => res.data);
};

export const addTag = (name, categoryId) => {
	return axios.put('/posttags', { name, categoryId }).then(res => {
		tagsCached = null;
		return res.data;
	});
};

export const updateTag = tag=> {
	return axios.post('/posttags', { tag }).then(res =>{
		tagsCached = null;
		return res.data;
	});
}

export const deleteTag = tagId => {
	return axios.delete(`/posttags/${tagId}`).then(res => {
		tagsCached = null;
		return res.data;
	});
}
