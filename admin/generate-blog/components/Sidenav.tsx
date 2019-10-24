import * as React from 'react';
import { blogTabs } from './Header';

const tabs = blogTabs.map(t => (
	<a href={t.url} className="tab">
		<div>{t.name}</div>
	</a>
));

const Sidenav = props => {
	return(
		<div id="sidenav">
			{tabs}
		</div>
	);
}

export default Sidenav;
