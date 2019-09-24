// Main page
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { renderToStaticMarkup } from 'react-dom/server';

import Header from './Header';
import Sidebar from './Sidebar';
import Sidenav from './Sidenav';

export const getPageHtml = (postHtml, additionalJsFilename) => {
	
	const cssUrl = '/css/style.css';
	let additionalJs = additionalJsFilename ? <script src={`/js/${additionalJsFilename}`}></script> : '';
	
	return renderToStaticMarkup(
		<html>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link href="https://fonts.googleapis.com/css?family=Montserrat|Homemade+Apple" rel="stylesheet" />
				<link href={cssUrl} rel="stylesheet" />
				<link rel="shortcut icon" href="/icons/favicon.ico" />
				<title>NeapolitanMakes</title>
				<script src="/js/main.js"></script>
			</head>
			<body>
				<Header />
				<div id="body">
					<div className="spacer"></div>
					<div className="spacer"></div>
					{ ReactHtmlParser(postHtml) }
					<div className="spacer"></div>
					<Sidebar />
					<div className="spacer"></div>
				</div>
				<div id="backdrop" className="closed"></div>
				<Sidenav />
				<script src="/js/sidenav.js"></script>
				{ additionalJs }
			</body>
		</html>
	);
};
