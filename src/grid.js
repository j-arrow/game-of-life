import { GRID_DIMENSION } from "./config";
import { createCell } from "./cell";

const _createGridControl = (gridElement, cellControls) => ({
	tick: () => {
		const operationBuffer = [];

		for (let row = 0; row < GRID_DIMENSION; row++) {
			for (let col = 0; col < GRID_DIMENSION; col++) {
				const cellControl = _controlCell(cellControls, row, col);

				const aliveNeighboursCount = _countAliveNeighbours(cellControls, row, col);
				const alive = cellControl.isAlive();

				if (alive && (aliveNeighboursCount < 2 || aliveNeighboursCount > 3)) {
					operationBuffer.push(() => cellControl.kill()); // underpopulation or overpopulation
				} else if (!alive && aliveNeighboursCount == 3) {
					operationBuffer.push(() => cellControl.reproduce()); // reproduction
				}
			}
		}
	
		operationBuffer.forEach(fn => fn());
	},
	// TODO
	// createSpawner: () => ,
	resize: () => _resize(gridElement)
});

const _countAliveNeighbours = (cellControls, row, col) => {
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

			const neighbourCell = _controlCell(cellControls, r, c);
			if (neighbourCell.isAlive()) {
				neighboursAlive++;
			}
		}
	}
	return neighboursAlive;
};

const _controlCell = (cellControls, row, col) => cellControls[_calculateWrap(row)][_calculateWrap(col)];

const _calculateWrap = (pos) => {
	// TODO support division/multiplication by GRID_DIMENSION instead of subtraction/addition
	return pos >= GRID_DIMENSION ?
		pos % GRID_DIMENSION : (pos < 0) ?
			pos + GRID_DIMENSION : pos;
};

const _resize = (gridElement) => {
	const minInner = Math.min(window.innerHeight, window.innerWidth);
	const adjustedMinInner = Math.floor(minInner * 0.95);
	gridElement.style = `
		--grid-dimension: ${GRID_DIMENSION};
		--grid-size: ${adjustedMinInner}px;
	`;
};

export const initGrid = () => {
	const gridElement = document.getElementById('grid');
	_resize(gridElement);

	const cellControls = [];

	for (let r = 0; r < GRID_DIMENSION; r++) {
		const row = [];

		for (let c = 0; c < GRID_DIMENSION; c++) {
			const cellControl = createCell();
			cellControl.appendTo(gridElement);
			row.push(cellControl);
		}

		cellControls.push(row);
	}

	return _createGridControl(gridElement, cellControls);
};
