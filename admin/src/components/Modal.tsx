import React, { Component } from 'react';

import './Modal.scss';

interface ModalProps {
	onClose: (e: any) => void
	open: boolean
}

class Modal extends Component<ModalProps, any> {

	clickOutside = e => {
		this.props.onClose( e );
	}

	bodyClick = e => {
		e.stopPropagation();
	}

	render() {
		const { open } = this.props;
		const classes = open ? 'open' : '';
		return (
			<div id="modal-overlay" className={classes} onClick={this.clickOutside}>
				<div id="modal" onClick={this.bodyClick}>
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Modal;
