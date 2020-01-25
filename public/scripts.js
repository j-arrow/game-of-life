// Game of life



// constants
const GRID_DIMENSION = 70;
const gridElement = document.getElementById('grid');
const gridCellControls = [];



// logic
const calculateWrap = (pos) => {
	return pos >= GRID_DIMENSION ?
		pos - GRID_DIMENSION : (pos < 0) ?
			pos + GRID_DIMENSION : pos;
}

const createCellControl = (cellElement, row, col) => ({
	kill: () => cellElement.removeAttribute('alive'),
	reproduce: () => cellElement.setAttribute('alive', true),
	isAlive: () => cellElement.getAttribute('alive'),
	countAliveNeighbours: () => {
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

				if (gridCellControls[potentiallyWrappedR][potentiallyWrappedC].isAlive()) {
					neighboursAlive++;
				}
			}
		}
		return neighboursAlive;
	}
});

const addNewCell = (row, col) => {
	const cell = document.createElement('div');
	cell.className = 'cell';
	gridElement.appendChild(cell);
	return createCellControl(cell, row, col);
};

const fillGrid = () => {
	for (let y = 0; y < GRID_DIMENSION; y++) {
		const row = [];

		for (let x = 0; x < GRID_DIMENSION; x++) {
			const cellControl = addNewCell(y, x);
			row.push(cellControl);
		}

		gridCellControls.push(row);
	}
};

const applyGridStyle = (size) => {
	gridElement.style = `
		--grid-dimension: ${GRID_DIMENSION};
		--grid-size: ${size};
	`;
}

const resizeGrid = () => {
	const minInner = Math.min(window.innerHeight, window.innerWidth);
	const adjustedMinInner = Math.floor(minInner * 0.95);
	applyGridStyle(`${adjustedMinInner}px`);
};

window.addEventListener('resize', () => resizeGrid());

const init = () => {
	const t0 = performance.now();

	resizeGrid();
	fillGrid();

	const t1 = performance.now();
	console.debug(`Initialized: ${t1 - t0}ms for ${GRID_DIMENSION}x${GRID_DIMENSION} grid`);
};

const tick = () => {
	const buffer = [];
	for (let row = 0; row < GRID_DIMENSION; row++) {
		for (let col = 0; col < GRID_DIMENSION; col++) {
			const cell = gridCellControls[row][col];

			const aliveNeighbours = cell.countAliveNeighbours();
			const alive = cell.isAlive();
			if (alive && (aliveNeighbours < 2 || aliveNeighbours > 3)) {
				buffer.push(() => cell.kill()); // underpopulation or overpopulation
			} else if (!alive && aliveNeighbours == 3) {
				buffer.push(() => cell.reproduce()); // reproduction
			}
		}
	}

	buffer.forEach(fn => fn());
};

init();

let tickCount = 0;
setInterval(() => {
	const t0 = performance.now();
	tick();
	const t1 = performance.now();
	console.debug(`Tick: ${++tickCount}, time processing: ${t1 - t0}ms`);
}, 70);
