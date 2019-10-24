// Given markdown string, extract first image url and return thumbnail version
export const getThumbnailUrlFromMarkdown = markdown => {
	const url = /\((\/img\/.*\..*)\)/.exec(markdown);
	// @ts-ignore
	const [, firstUrl] = url;
	const [file, ext] = firstUrl.split('.');
	return file + '-thumb.' + ext;
};
