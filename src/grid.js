import { config } from "./config";
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

	const _controlCell = (row, col) => cellControls[_calculcateWidthHeight(row)][_calculcateWidthWidth(col)];

	const _calculcateWidthHeight = (pos) => {
		return _calculateWrap(pos, config.getGridHeightInCells());
	};

	const _calculcateWidthWidth = (pos) => {
		return _calculateWrap(pos, config.getGridWidthInCells());
	};

	const _calculateWrap = (pos, gridDimension) => {
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
					} else if (!alive && aliveNeighboursCount === 3) {
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
	// TODO move these calculation to config(-esque?)/calculator
	const adjustedMinWidth = Math.floor(window.innerWidth * 0.95);
	const requiredCellDimensionsInNewWidth = Math.floor(adjustedMinWidth / config.getGridWidthInCells());

	const adjustedMinHeight = Math.floor(window.innerHeight * 0.95);
	const requiredCellDimensionsInNewHeight = Math.floor(adjustedMinHeight / config.getGridHeightInCells());

	const lowerRequiredCellDimensions = Math.min(requiredCellDimensionsInNewWidth, requiredCellDimensionsInNewHeight);
	config.notifyCellDimensionsChange(lowerRequiredCellDimensions);

	canvas.width = lowerRequiredCellDimensions * config.getGridWidthInCells();
	canvas.height = lowerRequiredCellDimensions * config.getGridHeightInCells();
};

export const initGrid = () => {
	const t0 = performance.now();

	const gridWidth = config.getGridWidthInCells();
	const gridHeight = config.getGridHeightInCells();

	const canvas = document.getElementById('gridCanvas');
	_resize(canvas);

	const cellControls = [];
	for (let r = 0; r < gridHeight; r++) {
		const row = [];

		for (let c = 0; c < gridWidth; c++) {
			const cellControl = spawnCell(canvas, r, c);
			row.push(cellControl);
		}

		cellControls.push(row);
	}

	const gridControl = _createGridControl(canvas, cellControls);

	const t1 = performance.now();
	console.debug(`Initialized: ${t1 - t0}ms for ${gridWidth}x${gridHeight} grid`);

	config.addRenderingEnabledChangedListener((renderingEnabled) => {
		if (renderingEnabled) {
			gridControl.redraw();
		}
	});
	window.addEventListener('resize', () => {
		gridControl.resize();
		// redraw is required, because canvas is cleared on window resize
		gridControl.redraw();
		config.log();
	});

	return gridControl;
};
