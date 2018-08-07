// Main page
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { renderToStaticMarkup } from 'react-dom/server';

import Header from './Header';

export const getPageHtml = postHtml => {
	return renderToStaticMarkup(
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link href="https://fonts.googleapis.com/css?family=Slabo+27px" rel="stylesheet" />
				<link href="../../css/style.css" rel="stylesheet" />
			</head>
			<body>
				<Header />
				{ ReactHtmlParser(postHtml) }
			</body>
		</html>
	);
};
