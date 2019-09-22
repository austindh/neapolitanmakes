const sqlite = require( 'sqlite3' ).verbose();
const path = require( 'path' );
const dateformat = require('dateformat');

const dbPath = path.resolve( __dirname, '../../site.sqlite' );

let connectionPromise;

// Connect to database and return db object
const getConnection = () => {
	if (connectionPromise) {
		return Promise.resolve(connectionPromise);
	}
	connectionPromise = new Promise( ( resolve, reject ) => {
		const db = new sqlite.Database( dbPath, err => {
			if ( err ) {
				reject( err );
			} else {
				resolve( db.get('PRAGMA foreign_keys = ON') );
			}
		});
	});
	return connectionPromise;
};

// Close database connection
const close = db => {
	return new Promise( ( resolve, reject ) => {
		db.close( err => {
			if ( err ) {
				reject( err );
			} else {
				resolve();
			}
		});
	});
};

const selectAll = async ( sql, ...params ) => {
	const db = await getConnection();
	return new Promise( ( resolve, reject ) => {
		db.all( sql, [ ...params ], ( err, rows ) => {
			if ( err ) {
				reject( err );
			} else {
				resolve( rows );
			}
		});
	});
};

const selectOne = async (sql, ...params) => {
	const rows = await selectAll(sql, ...params);
	return rows[0];
};

const run = async ( sql, ...params ) => {
	const db = await getConnection();
	return new Promise((resolve, reject) => {
		db.run(sql, [...params], function (err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(this.lastID); // inserted id
			}
		});
	});
};

module.exports = {

	///////////////
	// POSTS
	///////////////
	async getPosts() {
		const posts = await selectAll('select * from posts');
		return posts;
	},
	
	async createPost() {
		const now = new Date();
		const dateString = dateformat(now, 'm/d/yy');
		const title = 'New Post 1';
		
		const newPostId = await run("insert into posts(title, date) values(?, ?)", title, dateString);
		return await selectOne('select * from posts where id = ?', newPostId);
	},
	
	async updatePost(post) {
		let { id, date, title, cleanTitle, body, thumbnail } = post;
		date = dateformat(new Date(date), 'm/d/yy');
		if (!cleanTitle) {
			cleanTitle = title.replace(/[^\w\s]/g, '').toLowerCase().split(/\s+/).join('-');
		}
		
		return await run('update posts set date = ?, title = ?, cleanTitle = ?, body = ?, thumbnail = ? where id = ?', 
		date, title, cleanTitle, body, thumbnail, id);
	},
	
	async deletePost(postId) {
		return await run('delete from posts where id = ?', postId);
	},

	async addTagToPost(postId, tagId) {
		await run('insert into post_tag(post_id, tag_id) values(?, ?)', postId, tagId);
	},

	///////////////
	// PAGES
	///////////////
	async getPages() {
		const pages = await selectAll('select * from pages');
		return pages;
	},

	async createPage() {
		const title = 'Page';
		const url = 'page';
		
		const newPageId = await run("insert into pages(title, url) values(?, ?)", title, url);
		return await selectOne('select * from pages where id = ?', newPageId);
	},

	async updatePage(page) {
		let { id, title, url, body } = page;
		return await run('update pages set title = ?, url = ?, body = ? where id = ?',
			title, url, body, id);
	},

	async deletePage(pageId) {
		return await run('delete from pages where id = ?', pageId);
	},

	// ATODO temp
	async _resetDbForBlogger() {
		const queries = [
			'drop table if exists posts;',
			`create table posts(
				id integer primary key autoincrement,
				date text default CURRENT_DATE,
				title text,
				cleanTitle text,
				body text,
				thumbnail text
			);`,
			'drop table if exists tags',
			`create table tags(
				id integer primary key autoincrement,
				name text unique,
				category_id integer,
				foreign key(category_id) references categories(id) on delete set null
			);`,
			'drop table if exists post_tag',
			`create table post_tag(
				post_id integer,
				tag_id integer,
				foreign key(post_id) references posts(id) on delete cascade,
				foreign key(tag_id) references tags(id) on delete cascade
			);`
		];

		for (let query of queries) {
			await run(query);
		}
	},

	///////////////
	// CATEGORIES
	///////////////
	async getCategories() {
		return await selectAll('select * from categories');
	},

	///////////////
	// TAGS
	///////////////
	// Insert tag if it doesn't exist
	async addTagIfNeeded(name, categoryId) {
		const selectOneArgs = ['select * from tags where name = ?', name];
		const tag = await selectOne(...selectOneArgs);
		if (tag) {
			return tag;
		}
		await run('insert into tags(name, category_id) values(?, ?)', name, categoryId);
		return await selectOne(...selectOneArgs);
	},

	async getTagsForPost(postId) {
		let tags = await selectAll(`
			select t.name
			from post_tag pt
			left join tags t on pt.tag_id = t.id
			where post_id = ?
		`, postId);
		return tags.map(x => x.name);
	},

	// Get lookup of tags to post
	async getTagToPostsLookup() {
		const lookup = {};
		const tags = await selectAll(`
			select t.name, group_concat(post_id) as posts
			from tags t
			left join post_tag pt on t.id = pt.tag_id
			group by t.name;
		`);
		tags.forEach(t => {
			const posts = t.posts.split(',').map(x => parseInt(x));
			lookup[t.name] = posts;
		});
		return lookup;
	}

};
