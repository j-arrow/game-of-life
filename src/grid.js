import { config } from "./config";
import { parse } from "./seedParser";
import { AREA_HEIGHT, AREA_WIDTH, createAreaBuilder, createCompositeAreaBuilder } from "./area";

const MIN_AREA_COUNT_EXPECTED = 3;
const SPLIT_GRID_THRESHOLD_NODE_COUNT =
	(AREA_WIDTH * MIN_AREA_COUNT_EXPECTED) * (AREA_HEIGHT * MIN_AREA_COUNT_EXPECTED);

const _createGridControl = (canvas, gridWidthInCells, gridHeightInCells, areaControls) => {
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

	const _controlCell = (row, col) => {
		return areaControls.controlCell(_calculcateWidthWrap(row), _calculateHeightWrap(col));
	}

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
			areaControls.process()
				.forEach(executeOperation => executeOperation());
		},
		resize: () => {
			_resize(canvas, gridWidthInCells, gridHeightInCells);
		},
		redraw: () => {
			for (let r = 0; r < areaControls.length; r++) {
				for (let c = 0; c < areaControls[r].length; c++) {
					areaControls[r][c].draw();
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

const _prepareAreas = (canvas, gridProps) => {
	// const cellControls = [];
	// if (gridProps.seed) {
	// 	const gridBase = parse(gridProps.seed, {
	// 		padHorizontallyTo: gridProps.gridWidthInCells,
	// 		padVerticallyTo: gridProps.gridHeightInCells,
	// 	});
	// 	gridBase.forEach((row, rowIndex) => {
	// 		const cellControlsRow = [];
	// 		row.forEach((cellAlive, colIndex) => {
	// 			const cellControl = spawnCell(canvas, rowIndex, colIndex, cellAlive);
	// 			cellControlsRow.push(cellControl);
	// 		});
	// 		cellControls.push(cellControlsRow);
	// 	})
	// } else {
	const splitIntoMultipleAreas = SPLIT_GRID_THRESHOLD_NODE_COUNT
		> (gridProps.gridWidthInCells * gridProps.gridHeightInCells);

	const areaBuilder = splitIntoMultipleAreas ?
		createCompositeAreaBuilder(canvas) :
		createAreaBuilder(
			canvas,
			gridProps.gridHeightInCells,
			gridProps.gridWidthInCells
		);
	for (let r = 0; r < gridProps.gridHeightInCells; r++) {
		for (let c = 0; c < gridProps.gridWidthInCells; c++) {
			areaBuilder.registerCell(r, c);
		}
	}
	return areaBuilder.build();
	// }
	// return cellControls;
};

export const initGrid = (gridProps = defaultInitGridProps) => {
	const props = {
		...defaultInitGridProps,
		...gridProps,
	};

	const t0 = performance.now();

	const canvas = document.getElementById('gridCanvas');

	const areaControls = _prepareAreas(canvas, props);
	const gridWidthInCells = props.gridWidthInCells;
	const gridHeightInCells = props.gridHeightInCells;
	_resize(canvas, gridWidthInCells, gridHeightInCells);

	const gridControl = _createGridControl(canvas, gridWidthInCells, gridHeightInCells, areaControls);
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
