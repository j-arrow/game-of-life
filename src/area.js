import { spawnCell } from "./cell";



export const AREA_WIDTH = 15;
export const AREA_HEIGHT = 15;

const STALLING_COUNTER = 3;



const _convertCanvasToAreaCoordinates = (canvasRow, canvasCol, areaHeightInCells, areaWidthInCells) => {
	const areaRow = canvasRow % (areaHeightInCells - 1);
	const areaCol = canvasCol % (areaWidthInCells - 1);
	return [areaRow, areaCol];
};

const _createAreaCode = (canvasRow, canvasCol, areaHeightInCells, areaWidthInCells) => {
	// example area code -> 0|0 (first row, first column), 2|4 (third row, fifth column)
	const [areaRow, areaCol] = _convertCanvasToAreaCoordinates(canvasRow, canvasCol, areaHeightInCells, areaWidthInCells);
	return `${areaRow}|${areaCol}`;
};



const _createAreaControl = (cellControls, areaHeightInCells, areaWidthInCells) => {
	// if stalling counter gets to 0 it should mean no cells in area changed for a couple of
	// last recalculations - it should mean there is no need to process this area anymore until
	// it will get notified by one of its neighbours that 'observer' nodes (nodes on its border)
	// are about to change their state
	let _stallingCounter = STALLING_COUNTER;

	return {
		process: () => {
			if (_stallingCounter === 0) {
				return [];
			}



			// TODO fix logic
			const operationBuffer = [];
			for (let row = 0; row < areaControls.length; row++) {
				for (let col = 0; col < areaControls[row].length; col++) {
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

			if (operationBuffer.length === 0) {
				_stallingCounter--;
			} else {
				_stallingCounter = STALLING_COUNTER;
			}
			return operationBuffer;
		},
		controlCell: (canvasRow, canvasCol) => {
			const [areaRow, areaCol] = _convertCanvasToAreaCoordinates(canvasRow, canvasCol, areaHeightInCells, areaWidthInCells);
			return cellControls[areaRow][areaCol];
		},
	};
};

const _createCompositeAreaControl = (areaControlsByCode) => {
	return {
		process: () => {
			return [...areaControlsByCode.values()]
				.map(control => control.process())
				.reduce((a, b) => [...a, ...b]);
		},
		controlCell: (canvasRow, canvasCol) => {
			const areaCode = _createAreaCode(canvasRow, canvasCol, AREA_HEIGHT, AREA_WIDTH);
			const areaControl = areaControlsByCode.get(areaCode);
			return areaControl.controllCell(canvasCol, canvasRow);
		},
	};
};



export const createAreaBuilder = (canvas, areaHeightInCells, areaWidthInCells) => {
	const _cellControls = [];

	return {
		registerCell: (canvasRow, canvasCol) => {
			const [areaRow, areaCol] = _convertCanvasToAreaCoordinates(canvasRow, canvasCol, areaHeightInCells, areaWidthInCells);

			if (!_cellControls[areaRow]) {
				_cellControls[areaRow] = [];
			}
			_cellControls[areaRow][areaCol] = spawnCell(canvas, canvasRow, canvasCol);
		},
		build: () => {
			return _createAreaControl(_cellControls, areaHeightInCells, areaWidthInCells);
		},
	};
};

export const createCompositeAreaBuilder = (canvas) => {
	const _areaBuildersByCode = new Map();

	return {
		registerCell: (canvasRow, canvasCol) => {
			const areaCode = _createAreaCode(canvasRow, canvasCol, AREA_HEIGHT, AREA_WIDTH);

			const areaBuilder = _areaBuildersByCode.has(areaCode) ?
				_areaBuildersByCode.get(areaCode) : createAreaBuilder(canvas, AREA_HEIGHT, AREA_WIDTH);

			areaBuilder.registerCell(canvasRow, canvasCol);
		},
		build: () => {
			const areaControlsByCode = new Map();
			for (const [code, builder] of _areaBuildersByCode) {
				areaControlsByCode.set(code, builder.build());
			}
			return _createCompositeAreaControl(areaControlsByCode);
		},
	};
};
