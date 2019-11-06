import * as React from 'react';

import './LoadingBar.scss';

interface LoadingBarProps {
	show: boolean;
}

const LoadingBar = (props: LoadingBarProps) => {

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
