// Main page
import React from 'react';

export const tabNames = [
	'Sewing',
	'Food',
	'Crafts',
	'Home',
	'Shop',
	'Etsy',
	'About'
];
const tabs = [<div className="divider"></div>];
tabNames.forEach((tabName, i) => {
	tabs.push(<div className="tab">{tabName}</div>);
	tabs.push(<div className="divider"></div>)
});

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
	return(
		[
			<div id="header">
				<div className="logo">
					<div className="main">
						<span id="nea">NEA</span>
						<span id="politan">POLITAN</span>
						<span id="makes">MAKES</span>
					</div>
					<div className="sub-title">Flavors of Creativity</div>
				</div>
				{ socialIcons }
			</div>,
			<div id="tabs">
				<div className="container">
					{tabs}
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
