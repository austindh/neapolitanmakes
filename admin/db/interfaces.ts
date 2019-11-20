export interface IPost {
	id: number
	date: Date
	title: string
	cleanTitle: string
	body: string
	thumbnail: string
	tags?: any[]
}

export interface IBuildPost extends IPost {
	htmlPath: string
	fullUrl: string
	next: string
	prev: string
}

export interface IPage {
	id: number
	title: string
	url: string
	body: string
}

export interface ICategory {
	id: number
	name: string
}

export interface ITag {
	id: number
	name: string
	categoryId: number
	count?: number
}

export interface IRecipeStep {
	description: string
	step_number?: number
}

export interface IRecipeIngredient {
	amount: string
	name: string
	order?: number
}

export interface IRecipe {
	id?: number
	postId: number
	title: string
	yield?: string
	time?: string
	steps: IRecipeStep[]
	ingredients: IRecipeIngredient[]
}
