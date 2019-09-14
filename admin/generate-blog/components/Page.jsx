// Main page
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { renderToStaticMarkup } from 'react-dom/server';

import Header from './Header';

export const getPageHtml = (postHtml, isFirst = false) => {
	
	// const cssPrefix = isFirst ? '' : '../../';
	// const cssUrl = cssPrefix + 'css/style.css'; 
	const cssUrl = '/css/style.css'; 
	
	return renderToStaticMarkup(
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" />
				<link href={cssUrl} rel="stylesheet" />
			</head>
			<body>
				<Header />
				{ ReactHtmlParser(postHtml) }
			</body>
		</html>
	);
};
