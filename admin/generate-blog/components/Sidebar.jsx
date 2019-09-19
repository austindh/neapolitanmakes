import React from 'react';
import { socialIcons } from './Header';

const Sidebar = props => {
	return([
		<div id="sidebar" className="card">
			<div className="pic">
				<img alt="Nea Hughes" src="/img/nea.jpg"></img>
			</div>
			<div className="sidebar-text">Hi, I'm Nea! I like to sew, bake, and do crafts. This is where I'll share what I've been working on.</div>
		</div>,
		<div id="small-sidebar">
			{ socialIcons }
		</div>
	]);
}

export default Sidebar;
