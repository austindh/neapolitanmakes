// Main page
import React from 'react';

const Header = props => {
	return(
		[
			<div id="header">
				<span id="nea">NEA</span>
				<span id="politan">POLITAN</span>
				<span id="makes">MAKES</span>
			</div>,
			<div id="tabs">
				<div className="tab active">Home</div>
				<div className="tab">About</div>
			</div>
		]
	);
}

export default Header;
