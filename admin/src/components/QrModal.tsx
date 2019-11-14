import React, { useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import QRCode from 'qrcodejs2';
import ReactDOM from 'react-dom';

// console.log('temp', temp);


interface QrModalProps {
	open: boolean
	onClose: (e: any) => void
}

export function QrModal(props: QrModalProps) {

	useEffect(() => {
		axios.get('/ip').then(res => {
			// @ts-ignore
			new QRCode(document.getElementById('qr'), {
				text: res.data,
				width: 300,
				height: 300,
				correctLevel: QRCode.CorrectLevel.L
			});
		})
	}, []);

	return (
		ReactDOM.createPortal(
			<Modal open={props.open} onClose={props.onClose}>
				<div id="qr"></div>
			</Modal>,
			// @ts-ignore
			document.getElementById('modal')
		)
	)
}
