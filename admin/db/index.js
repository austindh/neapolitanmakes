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
				resolve( db );
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
		let { id, date, title, cleanTitle, body } = post;
		date = dateformat(new Date(date), 'm/d/yy');
		cleanTitle = title.replace(/[^\w\s]/g, '').toLowerCase().split(/\s+/).join('-');

		return await run('update posts set date = ?, title = ?, cleanTitle = ?, body = ? where id = ?', 
			date, title, cleanTitle, body, id);
	},

	async deletePost(postId) {
		return await run('delete from posts where id = ?', postId);
	}

};
