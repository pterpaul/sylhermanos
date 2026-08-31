	// document.addEventListener('keydown', function(e) { 
	// 	// disable features 
	// if (e.key === 'F12') {
	// 	e.preventDefault();
	// 	return false;
	// }
	// if (e.ctrlKey && e.shiftKey && e.key === 'I') {
	// 	e.preventDefault();
	// 	return false;
	// }
	// if (e.ctrlKey && e.key === 'U') {
	// 	e.preventDefault();
	// 	return false;
	// }
	// if (e.ctrlKey && e.shiftKey && e.key === 'J') {
	// 	e.preventDefault();
	// 	return false;
	// }
	// if (e.ctrlKey && e.shiftKey && e.key === 'C') {
	// 	e.preventDefault();
	// 	return false;
	// }
	// if (e.ctrlKey && e.key === 'p') {
	// 	e.preventDefault();
	// 	return false;
	// }
	// if (e.ctrlKey && e.shiftKey && e.key === 'P') {
	// 	e.preventDefault();
	// 	return false;
	// }
	// if (e.key === 'PrintScreen') {
	// 	e.preventDefault();
	// 	blockScreenshotMoment();
	// 	return false;
	// }
	// if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === 's' || e.key === '4')) {
	// 	e.preventDefault();
	// 	blockScreenshotMoment();
	// 	return false;
	// }
	// });

	// function blockScreenshotMoment() {
	// document.documentElement.classList.add('screenshot-blocked');
	// setTimeout(() => {
	// 	document.documentElement.classList.remove('screenshot-blocked');
	// }, 300);
	// // Optional fallback: show warning
	// const warning = document.createElement('div');
	// warning.textContent = 'Screenshot is blocked. Please do not capture this content.';
	// warning.style.position = 'fixed';
	// warning.style.left = '50%';
	// warning.style.top = '10px';
	// warning.style.transform = 'translateX(-50%)';
	// warning.style.background = 'rgba(0,0,0,0.8)';
	// warning.style.color = '#fff';
	// warning.style.padding = '8px 14px';
	// warning.style.borderRadius = '8px';
	// warning.style.zIndex = '999999999';
	// warning.style.pointerEvents = 'none';
	// document.body.appendChild(warning);
	// setTimeout(() => warning.remove(), 1200);
	// }

	// window.addEventListener('visibilitychange', function() {
	// if (document.visibilityState === 'hidden') {
	// 	document.documentElement.classList.add('screenshot-blocked');
	// } else {
	// 	setTimeout(() => document.documentElement.classList.remove('screenshot-blocked'), 150);
	// }
	// });

	// document.addEventListener('contextmenu', function(e) {
	// if (e.target.tagName === 'IMG') {
	// 	e.preventDefault();
	// 	return false;
	// }
	// });
	// window.print = function() {
	// alert('Printing is disabled on this page.');
	// return false;
	// };
	// window.addEventListener('beforeprint', function(e) {
	// e.preventDefault();
	// alert('Printing is disabled on this page.');
	// });
	// // Optional: Detect!
	// let devtoolsOpen = false;
	// let alertInterval = null;

	// const threshold = 160;

	// const detectDevTools = () => {
	// const isOpen =
	// 	window.outerHeight - window.innerHeight > threshold ||
	// 	window.outerWidth - window.innerWidth > threshold;

	// if (isOpen) {
	// 	if (!devtoolsOpen) {
	// 	devtoolsOpen = true;
	// 	alertInterval = setInterval(() => {
	// 		alert('Developer tools detected. Your Device, IP Address and logs are detected! Please close the developer tools now for better experience.');
	// 	}, 800);
	// 	}
	// } else {
	// 	if (devtoolsOpen) {
	// 	devtoolsOpen = false;
	// 	clearInterval(alertInterval);
	// 	alertInterval = null;
	// 	}
	// }
	// };

	// setInterval(detectDevTools, 500);
