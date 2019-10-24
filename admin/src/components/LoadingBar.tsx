import * as React from 'react';

import './LoadingBar.scss';

const LoadingBar = props => {

	const { show } = props;
	const classes = ['container'];
	if (show) {
		classes.push('show');
	}

	return (
		<div className={classes.join(' ')}>
			<div className="bar"></div>
		</div>
	);
}

export default LoadingBar;
