// Game of life
import './styles.css';
import { GRID_DIMENSION, EXPECTED_TICK_TIME_MS } from './config';
import { spawnFireMan } from './spawners';
import { resizeGrid, fillGrid } from './grid';

const gridElement = document.getElementById('grid');
const gridCellControls = [];

window.addEventListener('resize', () => resizeGrid(gridElement));

const init = () => {
	const t0 = performance.now();

	resizeGrid(gridElement);

	const cellControls = fillGrid(gridElement);
	gridCellControls.push(...cellControls);

	spawnFireMan(gridCellControls);

	const t1 = performance.now();
	console.debug(`Initialized: ${t1 - t0}ms for ${GRID_DIMENSION}x${GRID_DIMENSION} grid`);
};

const tick = () => {
	const buffer = [];
	for (let row = 0; row < GRID_DIMENSION; row++) {
		for (let col = 0; col < GRID_DIMENSION; col++) {
			const cell = gridCellControls[row][col];

			const aliveNeighbours = cell.countAliveNeighbours(gridCellControls);
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

	const tickProcessingTimeMs = t1 - t0;
	console.debug(`Tick: ${++tickCount}, time processing: ${tickProcessingTimeMs}ms`);
	if (tickProcessingTimeMs > EXPECTED_TICK_TIME_MS) {
		console.error(`Tick processing time of ${EXPECTED_TICK_TIME_MS}ms exceeded`);
	}
}, EXPECTED_TICK_TIME_MS);
