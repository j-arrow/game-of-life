import { calculateWrap } from "./utils";

const createCellControl = (cellElement, row, col) => ({
	kill: () => cellElement.removeAttribute('alive'),
	reproduce: () => cellElement.setAttribute('alive', true),
	isAlive: () => cellElement.getAttribute('alive'),
	countAliveNeighbours: (gridCellControls) => {
		const minRow = row - 1;
		const maxRow = row + 1;
		const minCol = col - 1;
		const maxCol = col + 1;

		let neighboursAlive = 0;
		for (let r = minRow; r <= maxRow; r++) {
			for (let c = minCol; c <= maxCol; c++) {
				if (r === row && c === col) {
					continue;
				}

				const potentiallyWrappedR = calculateWrap(r);
				const potentiallyWrappedC = calculateWrap(c);

				const neighbourCell = gridCellControls[potentiallyWrappedR][potentiallyWrappedC];
				if (neighbourCell.isAlive()) {
					neighboursAlive++;
				}
			}
		}
		return neighboursAlive;
	}
});

export const addNewCell = (gridElement, row, col) => {
	const cell = document.createElement('div');
	cell.className = 'cell';
	gridElement.appendChild(cell);
	return createCellControl(cell, row, col);
};
