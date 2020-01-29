import { getConfigurationContext } from "./config";
import { spawnCell } from "./cell";
import { createSpawner } from "./spawners";

const _createGridControl = (canvas, cellControls) => {
	const _countAliveNeighbours = (row, col) => {
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

				const neighbourCell = _controlCell(r, c);
				if (neighbourCell.isAlive()) {
					neighboursAlive++;
				}
			}
		}
		return neighboursAlive;
	};

	const _controlCell = (row, col) => cellControls[_calculateWrap(row)][_calculateWrap(col)];

	const _calculateWrap = (pos) => {
		const gridDimensions = getConfigurationContext().getGridDimensions();

		const getFirstInGridIndicesIfTooSmall = () => {
			let current = pos;
			while (current < 0) {
				current += gridDimensions;
			}
			return current;
		}

		return pos >= gridDimensions ?
			pos % gridDimensions : (pos < 0) ?
				getFirstInGridIndicesIfTooSmall() : pos;
	};

	const control = {
		tick: () => {
			const operationBuffer = [];

			for (let row = 0; row < cellControls.length; row++) {
				for (let col = 0; col < cellControls[row].length; col++) {
					const cellControl = _controlCell(row, col);

					const aliveNeighboursCount = _countAliveNeighbours(row, col);
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
			const cellControlProvider = (row, cell) => _controlCell(row, cell);
			return createSpawner(cellControlProvider);
		},
		resize: () => {
			_resize(canvas);
		},
		redraw: () => {
			for (let r = 0; r < cellControls.length; r++) {
				for (let c = 0; c < cellControls[r].length; c++) {
					cellControls[r][c].draw();
				}
			}
		}
	};

	return control;
};

const _resize = (canvas) => {
	const minInner = Math.min(window.innerHeight, window.innerWidth);
	const adjustedMinInner = Math.floor(minInner * 0.95);
	canvas.width = adjustedMinInner;
	canvas.height = adjustedMinInner;

	getConfigurationContext().notifyGridSizeChange(adjustedMinInner);
};

export const initGrid = () => {
	const t0 = performance.now();

	const gridDimensions = getConfigurationContext().getGridDimensions();

	const canvas = document.getElementById('gridCanvas');
	_resize(canvas);

	const cellControls = [];
	for (let r = 0; r < gridDimensions; r++) {
		const row = [];

		for (let c = 0; c < gridDimensions; c++) {
			const cellControl = spawnCell(canvas, r, c);
			row.push(cellControl);
		}

		cellControls.push(row);
	}

	const gridControl = _createGridControl(canvas, cellControls);

	const t1 = performance.now();
	console.debug(`Initialized: ${t1 - t0}ms for ${gridDimensions}x${gridDimensions} grid`);

	getConfigurationContext().addRenderingEnabledChangedListener((renderingEnabled) => {
		if (renderingEnabled) {
			gridControl.redraw();
		}
	});
	window.addEventListener('resize', () => {
		gridControl.resize();
		// redraw is required, because canvas is cleared on window resize
		gridControl.redraw();
		getConfigurationContext().log();
	});

	return gridControl;
};
