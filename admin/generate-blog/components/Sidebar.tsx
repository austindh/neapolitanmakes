import * as React from 'react';
import { socialIcons } from './Header';

const Sidebar = props => (
	<React.Fragment>
		<div id="sidebar">
			<div className="pic">
				<img alt="Nea Hughes" src="/img/nea.jpg"></img>
			</div>
		</div>
		<div id="small-sidebar">
			{ socialIcons }
		</div>
	</React.Fragment>
);

export default Sidebar;
