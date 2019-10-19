import React from 'react';
import { socialIcons } from './Header';

const Sidebar = props => {
	return([
		<div id="sidebar">
			<div className="pic">
				<img alt="Nea Hughes" src="/img/nea.jpg"></img>
			</div>
		</div>,
		<div id="small-sidebar">
			{ socialIcons }
		</div>
	]);
}

export default Sidebar;
