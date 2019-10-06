// Main page
import React from 'react';


const tabs = [];
const addTab = (name, url) => {
	const t = { name, url };
	tabs.push(t)
}
addTab('Sewing', '/sewing');
addTab('Food', '/food');
addTab('Crafts', '/crafts');
addTab('Home', '/home');
addTab('Shop', '/shop');
addTab('Etsy', '/etsy');
addTab('About', '/about');

export const blogTabs = tabs;

export const socialIcons = (
	<div className="nea-social">
		<img alt="pinterest" src="/icons/pinterest original.svg"></img>
		<img alt="facebook" src="/icons/facebook original.svg"></img>
		<div className="wrapper">
			<img id="instagram" alt="instagram" src="/icons/instagram.svg"></img>
		</div>
		<div className="wrapper wrapper2">
			<img id="instagram" alt="instagram" src="/icons/instagram.svg"></img>
		</div>
	</div>
);

const Header = props => {
	const { currentUrl } = props;
	const headerTabs = [<div className="divider"></div>];
	tabs.forEach((t, i) => {
		let activePage = false;
		if (currentUrl) {
			const cleanUpRegex = /[^a-z]/ig;
			const tabUrl = t.url.replace(cleanUpRegex, '').toLowerCase();
			const pageUrl = currentUrl.replace(cleanUpRegex, '').toLowerCase();
			activePage = tabUrl === pageUrl;
		}
		if (activePage) {
			headerTabs.push(<div className="tab active">{t.name}</div>)
		} else {
			headerTabs.push(<a href={t.url} className="tab"><div>{t.name}</div></a>);
		}
		headerTabs.push(<div className="divider"></div>)
	});

	return(
		[
			<div id="header">
				<div className="logo">
					<a className="main" href="/">
						<span id="nea">NEA</span>
						<span id="politan">POLITAN</span>
						<span id="makes">MAKES</span>
					</a>
					<div className="sub-title">Flavors of Creativity</div>
				</div>
				{ socialIcons }
			</div>,
			<div id="tabs">
				<div className="container">
					{headerTabs}
				</div>
			</div>,
			<div id="hamburger">
				<div className="top"></div>
				<div className="middle"></div>
				<div className="bottom"></div>
			</div>
		]
	);
}

export default Header;
