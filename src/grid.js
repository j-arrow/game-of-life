import { getConfigurationContext } from "./config";
import { createCell } from "./cell";
import { createSpawner } from "./spawners";

const _createGridControl = (gridElement, cellControls) => ({
	tick: () => {
		const config = getConfigurationContext();
		const gridDimension = config.getGridDimension();

		const operationBuffer = [];

		for (let row = 0; row < gridDimension; row++) {
			for (let col = 0; col < gridDimension; col++) {
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
	createSpawner: () => {
		const cellControlProvider = (row, cell) => _controlCell(cellControls, row, cell);
		return createSpawner(cellControlProvider);
	},
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
	const gridDimension = getConfigurationContext().getGridDimension();

	const getFirstInGridIndicesIfTooSmall = () => {
		let current = pos;
		while (current < 0) {
			current += gridDimension;
		}
		return current;
	}

	return pos >= gridDimension ?
		pos % gridDimension : (pos < 0) ?
			getFirstInGridIndicesIfTooSmall() : pos;
};

const _resize = (gridElement) => {
	const gridDimension = getConfigurationContext().getGridDimension();
	const minInner = Math.min(window.innerHeight, window.innerWidth);
	const adjustedMinInner = Math.floor(minInner * 0.95);
	gridElement.style = `
		--grid-dimension: ${gridDimension};
		--grid-size: ${adjustedMinInner}px;
	`;
};

export const initGrid = () => {
	const t0 = performance.now();

	const gridDimension = getConfigurationContext().getGridDimension();

	const gridElement = document.getElementById('grid');
	_resize(gridElement);

	const cellControls = [];

	for (let r = 0; r < gridDimension; r++) {
		const row = [];

		for (let c = 0; c < gridDimension; c++) {
			const cellControl = createCell();
			cellControl.appendTo(gridElement);
			row.push(cellControl);
		}

		cellControls.push(row);
	}

	const gridControl = _createGridControl(gridElement, cellControls);

	const t1 = performance.now();
	console.debug(`Initialized: ${t1 - t0}ms for ${gridDimension}x${gridDimension} grid`);

	window.addEventListener('resize', () => gridControl.resize());

	return gridControl;
};
