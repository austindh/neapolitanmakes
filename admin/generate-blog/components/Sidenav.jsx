import React from 'react';
import { tabNames } from './Header';

const tabs = tabNames.map(name => (
	<div className="tab">{name}</div>
));

const Sidenav = props => {
	return(
		<div id="sidenav">
			{tabs}
		</div>
	);
}

export default Sidenav;
