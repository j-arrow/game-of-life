// Game of life
import './styles.css';



// constants
const GRID_DIMENSION = 100;
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

				const neighbourCell = gridCellControls[potentiallyWrappedR][potentiallyWrappedC];
				if (neighbourCell.isAlive()) {
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

	spawnFireMan();

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
const expectedTickTimeMs = 50;
setInterval(() => {
	const t0 = performance.now();
	tick();
	const t1 = performance.now();

	const tickProcessingTimeMs = t1 - t0;
	console.debug(`Tick: ${++tickCount}, time processing: ${tickProcessingTimeMs}ms`);
	if (tickProcessingTimeMs > expectedTickTimeMs) {
		console.error(`Tick processing time of ${expectedTickTimeMs}ms exceeded`);
	}
}, expectedTickTimeMs);















// samples
function spawnSampleShip(row=0, col=row) {
	gridCellControls[calculateWrap(row-2)][calculateWrap(col-2)].reproduce();
	gridCellControls[calculateWrap(row-1)][calculateWrap(col-1)].reproduce();
	gridCellControls[calculateWrap(row)][calculateWrap(col-3)].reproduce();
	gridCellControls[calculateWrap(row)][calculateWrap(col-2)].reproduce();
	gridCellControls[calculateWrap(row)][calculateWrap(col-1)].reproduce();
};
function spawnSampleFleet() {
	spawnSampleShip();
	spawnSampleShip(10);
	spawnSampleShip(20);
	spawnSampleShip(30);
	spawnSampleShip(40);
	spawnSampleShip(50);
	spawnSampleShip(60);
	spawnSampleShip(10, 60);
	spawnSampleShip(20, 50);
	spawnSampleShip(30, 40);
	spawnSampleShip(40, 30);
	spawnSampleShip(50, 20);
	spawnSampleShip(60, 10);
};

function spawnPulsarPeriod3(center) {
	const step = (distanceFromCenter) => {
		const lowerBound = center-4;
		const upperBound = center+4;
		for (let i = lowerBound; i <= upperBound; i++) {
			if (Math.abs(center-i) > 1) {
				const rowAndCol = center-distanceFromCenter;
				const wrappedRowAndCol = calculateWrap(rowAndCol);
				const wrappedI = calculateWrap(i);
				gridCellControls[wrappedRowAndCol][wrappedI].reproduce();
				gridCellControls[wrappedI][wrappedRowAndCol].reproduce();
			}
		}
	};
	step(-6);
	step(-1);
	step(1);
	step(6);
};

// best for grid dimension > 100
function spawnYourGod(row, col=row) {
	gridCellControls[row-2][col-2].reproduce();
	gridCellControls[row-2][col-1].reproduce();
	gridCellControls[row-2][col+1].reproduce();
	gridCellControls[row-2][col+2].reproduce();

	gridCellControls[row-1][col-2].reproduce();
	gridCellControls[row-1][col+2].reproduce();

	gridCellControls[row][col-1].reproduce();
	gridCellControls[row][col].reproduce();
	gridCellControls[row][col+1].reproduce();

	gridCellControls[row+1][col].reproduce();
}

// best for grid dimension > 100
function spawnFireMan() {
	spawnYourGod(40, 30);
	spawnYourGod(40, 70);
	spawnYourGod(60, 50);
}

function spawnNiceExplosion() {
	spawnSampleShip();
	spawnPulsarPeriod3(50);
}