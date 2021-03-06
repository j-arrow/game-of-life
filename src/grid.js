import { config } from "./config";
import { spawnCell } from "./cell";
import { parse } from "./seedParser";

const _createGridControl = (canvas, gridWidthInCells, gridHeightInCells, cellControls) => {
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

	const _controlCell = (row, col) => cellControls[_calculcateWidthWrap(row)][_calculateHeightWrap(col)];

	const _calculcateWidthWrap = (pos) => {
		return _calculateWrap(pos, gridWidthInCells);
	};

	const _calculateHeightWrap = (pos) => {
		return _calculateWrap(pos, gridHeightInCells);
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
		resize: () => {
			_resize(canvas, gridWidthInCells, gridHeightInCells);
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

const _resize = (canvas, gridWidthInCells, gridHeightInCells) => {
	// TODO move these calculation to config(-esque?)/calculator
	const adjustedMinWidth = Math.floor(window.innerWidth * 0.95);
	const requiredCellDimensionsInNewWidth = Math.floor(adjustedMinWidth / gridWidthInCells);

	const adjustedMinHeight = Math.floor(window.innerHeight * 0.95);
	const requiredCellDimensionsInNewHeight = Math.floor(adjustedMinHeight / gridHeightInCells);

	const lowerRequiredCellDimensions = Math.min(requiredCellDimensionsInNewWidth, requiredCellDimensionsInNewHeight);
	config.notifyCellDimensionsChange(lowerRequiredCellDimensions);

	canvas.width = lowerRequiredCellDimensions * gridWidthInCells;
	canvas.height = lowerRequiredCellDimensions * gridHeightInCells;
};

export const defaultInitGridProps = {
	seed: undefined,
	gridWidthInCells: 100,
	gridHeightInCells: 100,
};

const _spawnCells = (canvas, gridProps) => {
	const cellControls = [];
	if (gridProps.seed) {
		const gridBase = parse(gridProps.seed, {
			padHorizontallyTo: gridProps.gridWidthInCells,
			padVerticallyTo: gridProps.gridHeightInCells,
		});
		gridBase.forEach((row, rowIndex) => {
			const cellControlsRow = [];
			row.forEach((cellAlive, colIndex) => {
				const cellControl = spawnCell(canvas, rowIndex, colIndex, cellAlive);
				cellControlsRow.push(cellControl);
			});
			cellControls.push(cellControlsRow);
		})
	} else {
		for (let r = 0; r < gridProps.gridHeightInCells; r++) {
			const row = [];
			for (let c = 0; c < gridProps.gridWidthInCells; c++) {
				const cellControl = spawnCell(canvas, r, c);
				row.push(cellControl);
			}
			cellControls.push(row);
		}
	}
	return cellControls;
};

export const initGrid = (props = defaultInitGridProps) => {
	const t0 = performance.now();

	const canvas = document.getElementById('gridCanvas');

	const cellControls = _spawnCells(canvas, props);
	const gridWidthInCells = cellControls.length;
	const gridHeightInCells = cellControls[0] ? cellControls[0].length : 0;
	_resize(canvas, gridWidthInCells, gridHeightInCells);

	const gridControl = _createGridControl(canvas, gridWidthInCells, gridHeightInCells, cellControls);
	gridControl.redraw();

	const t1 = performance.now();
	console.debug(`Initialized: ${t1 - t0}ms for ${gridWidthInCells}x${gridHeightInCells} grid`);

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
