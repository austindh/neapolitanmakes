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

	async getPostsWithTags() {
		const getPosts = selectAll(`
			select p.id, p.date, p.title, p.cleanTitle, p.body, p.thumbnail, group_concat(pt.tag_id) as tags
			from posts p
			left join post_tag pt on p.id = pt.post_id
			group by p.id;
		`);
		const getTagLookup = this.getTagLookup();
		const [posts, tagLookup] = await Promise.all([getPosts, getTagLookup]);
		return posts.map(p => {
			const tags = (p.tags || '')
				.split(',')
				.map(x => parseInt(x))
				.map(x => tagLookup[x])
				.filter(x => !!x);
			p.tags = tags;
			return p;
		});
	},

	async getPostByCleanTitle(cleanTitle) {
		return await selectOne('select * from posts where cleanTitle = ?', cleanTitle);
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

	async updatePostTags(postId, tagIds) {
		await run('delete from post_tag where post_id = ?', postId);
		for (let tagId of tagIds) {
			await this.addTagToPost(postId, tagId);
		}
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

	async getCategoryPostsLookup() {
		const map = new Map();
		const categories = await this.getCategories();
		for (let c of categories) {
			map.set(c.id, new Set());
		}
		const rows = await selectAll(`
			select c.id, post_id
			from categories c
			left join tags t on c.id = t.category_id
			left join post_tag pt on t.id = pt.tag_id
			group by c.id, pt.post_id;
		`);
		rows.forEach(r => {
			map.get(r.id).add(r.post_id);
		});
		return map;
	},

	///////////////
	// TAGS
	///////////////
	// Insert tag if it doesn't exist
	async addTagIfNeeded(name, categoryId) {
		if (!name || !categoryId) {
			throw new Error('Tag needs name and categoryId')
		}
		const selectOneArgs = ['select * from tags where name = ?', name];
		const tag = await selectOne(...selectOneArgs);
		if (tag) {
			return tag;
		}
		await run('insert into tags(name, category_id) values(?, ?)', name, categoryId);
		return await selectOne(...selectOneArgs);
	},

	async updateTag(tag) {
		const { id, name, categoryId } = tag;
		return await run('update tags set name = ?, category_id = ? where id = ?', name, categoryId, id);
	},

	async deleteTag(tagId) {
		if (!tagId) {
			throw new Error('must specify tagId to delete');
		}
		return await run('delete from tags where id = ?', tagId);
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

	async getAllTags() {
		return await selectAll(`
			select t.*, ifnull(counts.count, 0) as count
			from tags t
			left join (
				select tag_id, count(*) as count
				from post_tag pt
				group by tag_id
			) counts on t.id = counts.tag_id
			group by name;
		`);
	},

	async getTagLookup() {
		const tags = await this.getAllTags();
		const lookup = {};
		tags.forEach(t => {
			lookup[t.id] = {
				id: t.id,
				name: t.name,
				category: t.category_id
			}
		});
		return lookup;
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
			if (!t.posts) {
				return;
			}
			const posts = t.posts.split(',').map(x => parseInt(x));
			lookup[t.name] = posts;
		});
		return lookup;
	},

	///////////////
	// RECIPES
	///////////////
	async insertRecipe(recipe) {
		const newId = await run('insert into recipes(post_id, title, yield, time) values(?, ?, ?, ?)', recipe.postId, recipe.title, recipe.yield, recipe.time);
		await this._updateRecipeIngredients(newId, recipe.ingredients);
		await this._updateRecipeSteps(newId, recipe.steps);
		return newId;
	},

	async updateRecipe(recipe) {
		const { id, title, yield: rYield, time, ingredients, steps } = recipe;
		await run('update recipes set title = ?, yield = ?, time = ? where id = ?', title, rYield, time, id);
		await this._updateRecipeIngredients(id, ingredients);
		await this._updateRecipeSteps(id, steps);
	},

	async deleteRecipe(id) {
		await run('delete from recipes where id = ?', id);
	},

	async getRecipesForPost(postId) {
		const recipes = await selectAll('select id, post_id as postId, title, yield, time from recipes where post_id = ?', postId);
		for (let r of recipes) {
			r.ingredients = await selectAll('select amount, name from recipe_ingredients where recipe_id = ? order by ordering', r.id);
			r.steps = await selectAll('select description from recipe_steps where recipe_id = ? order by step_number', r.id);
		}
		return recipes;
	},

	async _updateRecipeIngredients(recipeId, ingredients) {
		await run('delete from recipe_ingredients where recipe_id = ?', recipeId);
		ingredients = ingredients.map((ingredient, i) => {
			ingredient.order = i + 1;
			return ingredient;
		});
		for (let i of ingredients) {
			await run('insert into recipe_ingredients(recipe_id, ordering, amount, name) values(?, ?, ?, ?)', recipeId, i.order, i.amount, i.name);
		}
	},

	async _updateRecipeSteps(recipeId, steps) {
		await run('delete from recipe_steps where recipe_id = ?', recipeId);
		steps = steps.map((s, i) => {
			s.step_number = i + 1;
			return s;
		});
		for (let s of steps) {
			await run('insert into recipe_steps(recipe_id, step_number, description) values(?, ?, ?)', recipeId, s.step_number, s.description);
		}
	}

};

// ATODO temp
const main = async () => {
	const newRecipe = {
		postId: 1,
		title: 'Angel Biscuits',
		yield: '12 biscuits',
		time: '30 minutes',
		ingredients: [
			{ amount: '1 tbsp', name: 'active dry yeast' },
			{ amount: '2 tbsp', name: 'warm water' },
			{ amount: '2 3/4 cup', name: 'flour' },
			{ amount: '2 tbsp', name: 'sugar' },
			{ amount: '1 tsp', name: 'salt' },
			{ amount: '3 tsp', name: 'baking powder' },
			{ amount: '1/3 cup', name: 'vegetable shortening' },
			{ amount: '1 cup', name: 'buttermilk' },
			{ amount: '1 tsp', name: 'milk' },
			{ amount: '1 tbsp', name: 'butter' },
		],
		steps: [
			{ description: 'Preheat oven to 400 degrees. Line a skillet with parchment paper and spray with cooking spray.'	},
			{ description: 'Combine warm water and yeast in a small bowl. Combine remaining dry ingredients in a large bowl.' },
			{ description: 'Cut shortening into the dry ingredients. Mix yeast mixture with buttermilk and stir into the dry ingredients until just combined.' },
			{ description: 'Roll out on a lightly floured surface to 1" thick. Cut with a 2 1/2" circle cutter and place in the lined skillet. Brush the tops of the biscuits with milk.' },
			{ description: 'Bake 13-20 minutes, until they reach the desired golden color. Brush the tops of the baked biscuits with melted butter.' },
		]
	};

	const newRecipe2 = {
		postId: 1,
		title: 'Angel Biscuits 2',
		yield: '12 biscuits',
		time: '30 minutes',
		ingredients: [
			{ amount: '1 tbsp', name: 'active dry yeast' },
			{ amount: '2 tbsp', name: 'warm water' },
			{ amount: '2 3/4 cup', name: 'flour' },
			{ amount: '2 tbsp', name: 'sugar' },
			{ amount: '1 tsp', name: 'salt' },
			{ amount: '3 tsp', name: 'baking powder' },
			{ amount: '1/3 cup', name: 'vegetable shortening' },
			{ amount: '1 cup', name: 'buttermilk' },
			{ amount: '1 tsp', name: 'milk' },
			{ amount: '1 tbsp', name: 'butter' },
		],
		steps: [
			{ description: 'Preheat oven to 400 degrees. Line a skillet with parchment paper and spray with cooking spray.'	},
			{ description: 'Combine warm water and yeast in a small bowl. Combine remaining dry ingredients in a large bowl.' },
			{ description: 'Cut shortening into the dry ingredients. Mix yeast mixture with buttermilk and stir into the dry ingredients until just combined.' },
			{ description: 'Roll out on a lightly floured surface to 1" thick. Cut with a 2 1/2" circle cutter and place in the lined skillet. Brush the tops of the biscuits with milk.' },
			{ description: 'Bake 13-20 minutes, until they reach the desired golden color. Brush the tops of the baked biscuits with melted butter.' },
		]
	};

	try {
		// await run('delete from recipes where id is not null');
		// await module.exports.insertRecipe(newRecipe);
		// await module.exports.insertRecipe(newRecipe2);
		const recipes = await module.exports.getRecipesForPost(1);
		console.log(JSON.stringify(recipes, null, 4));
	} catch (e) {
		console.log(e);
	}
};
// main();
