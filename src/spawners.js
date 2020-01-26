export const spawnSampleShip = (gridCellControls, row = 0, col = row) => {
	gridCellControls[calculateWrap(row - 2)][calculateWrap(col - 2)].reproduce();
	gridCellControls[calculateWrap(row - 1)][calculateWrap(col - 1)].reproduce();
	gridCellControls[calculateWrap(row)][calculateWrap(col - 3)].reproduce();
	gridCellControls[calculateWrap(row)][calculateWrap(col - 2)].reproduce();
	gridCellControls[calculateWrap(row)][calculateWrap(col - 1)].reproduce();
};

export const spawnSampleFleet = (gridCellControls) => {
	spawnSampleShip(gridCellControls);
	spawnSampleShip(gridCellControls, 10);
	spawnSampleShip(gridCellControls, 20);
	spawnSampleShip(gridCellControls, 30);
	spawnSampleShip(gridCellControls, 40);
	spawnSampleShip(gridCellControls, 50);
	spawnSampleShip(gridCellControls, 60);
	spawnSampleShip(gridCellControls, 10, 60);
	spawnSampleShip(gridCellControls, 20, 50);
	spawnSampleShip(gridCellControls, 30, 40);
	spawnSampleShip(gridCellControls, 40, 30);
	spawnSampleShip(gridCellControls, 50, 20);
	spawnSampleShip(gridCellControls, 60, 10);
};

export const spawnPulsarPeriod3 = (gridCellControls, center) => {
	const step = (distanceFromCenter) => {
		const lowerBound = center - 4;
		const upperBound = center + 4;
		for (let i = lowerBound; i <= upperBound; i++) {
			if (Math.abs(center - i) > 1) {
				const rowAndCol = center - distanceFromCenter;
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
export const spawnYourGod = (gridCellControls, row, col = row) => {
	gridCellControls[row - 2][col - 2].reproduce();
	gridCellControls[row - 2][col - 1].reproduce();
	gridCellControls[row - 2][col + 1].reproduce();
	gridCellControls[row - 2][col + 2].reproduce();

	gridCellControls[row - 1][col - 2].reproduce();
	gridCellControls[row - 1][col + 2].reproduce();

	gridCellControls[row][col - 1].reproduce();
	gridCellControls[row][col].reproduce();
	gridCellControls[row][col + 1].reproduce();

	gridCellControls[row + 1][col].reproduce();
};

// best for grid dimension > 100
export const spawnFireMan = (gridCellControls, ) => {
	spawnYourGod(gridCellControls, 40, 30);
	spawnYourGod(gridCellControls, 40, 70);
	spawnYourGod(gridCellControls, 60, 50);
};

export const spawnNiceExplosion = (gridCellControls) => {
	spawnSampleShip(gridCellControls);
	spawnPulsarPeriod3(gridCellControls, 50);
};
