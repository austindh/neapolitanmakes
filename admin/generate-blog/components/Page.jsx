// Main page
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { renderToStaticMarkup } from 'react-dom/server';

import Header from './Header';

export const getPageHtml = (postHtml, isFirst = false) => {
	
	const cssUrl = '/css/style.css'; 
	
	return renderToStaticMarkup(
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link href="https://fonts.googleapis.com/css?family=Montserrat|Homemade+Apple" rel="stylesheet" />
				<link href={cssUrl} rel="stylesheet" />
				<link rel="shortcut icon" href="icons/favicon.ico" />
				<title>NeapolitanMakes</title>
			</head>
			<body>
				<Header />
				<div id="body">
					{ ReactHtmlParser(postHtml) }
					<div id="sidebar">
						<div className="pic">
							<img alt="Nea Hughes" src="/img/nea.jpg"></img>
						</div>
					</div>
				</div>		
			</body>
		</html>
	);
};
