const _createCellControl = (cellElement) => ({
	kill: () => cellElement.removeAttribute('alive'),
	reproduce: () => cellElement.setAttribute('alive', true),
	isAlive: () => cellElement.getAttribute('alive'),
	appendTo: (gridElement) => gridElement.appendChild(cellElement)
});

export const createCell = () => {
	const cell = document.createElement('div');
	cell.className = 'cell';
	return _createCellControl(cell);
};
