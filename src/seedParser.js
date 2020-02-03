/*
--- exampleSeed ---
`
. . . . . . . .
. . . o o . . .
. o o . o o . .
. . o . . o o .
. . o . . o o .
. o o . o o . .
. . . o o . . .
. . . . . . . .
`
*/

const defaultConf = {
	padVerticallyTo: undefined,
	padHorizontallyTo: undefined,
	__test_includePerformance: false,
}

const createFalseFilledArray = (size) => new Array(size).fill(false);

export const parseBase64 = (seed64, conf) => {
	return parse(atob(seed64), conf);
}

export const parse = (seed, conf = defaultConf) => {
	const t0 = performance.now();

	const gridRows = [];

	const rows = seed.trim().split(/\n/);
	let maxSeedRowCellCount = 0;
	for (let r = 0; r < rows.length; r++) {
		const cols = rows[r].trim().split(/ /);

		const rowCells = [];

		let rowLength = 0;
		for (let c = 0; c < cols.length; c++) {
			const [, countStr, char] = cols[c].match(/(\d+)?(.*)/);

			const count = Number.parseInt(countStr) || 1;
			rowLength += count;

			for (let i = 1; i <= count; i++) {
				rowCells.push(char === 'o');
			}
		}

		maxSeedRowCellCount = Math.max(rowLength, maxSeedRowCellCount);
		gridRows.push(rowCells);
	}

	// fix width and add left and right padding
	const leftPaddingToAdd = conf.padHorizontallyTo && conf.padHorizontallyTo > maxSeedRowCellCount ?
		Math.floor((conf.padHorizontallyTo - maxSeedRowCellCount) / 2) : undefined;
	for (let r = 0; r < rows.length; r++) {
		const row = gridRows[r];
		if (leftPaddingToAdd) {
			row.unshift(...createFalseFilledArray(leftPaddingToAdd));
		}
		const rightPaddingToAdd = (conf.padHorizontallyTo ? conf.padHorizontallyTo : maxSeedRowCellCount) - row.length;
		if (rightPaddingToAdd > 0) {
			row.push(...createFalseFilledArray(rightPaddingToAdd));
		}
	}

	// add top and bottom padding
	if (conf.padVerticallyTo) {
		const rowLength = conf.padHorizontallyTo || maxSeedRowCellCount;
		const rowCountToAppendToTop = Math.floor((conf.padVerticallyTo - gridRows.length) / 2);
		for (let i = 0; i < rowCountToAppendToTop; i++) {
			gridRows.unshift(createFalseFilledArray(rowLength));
		}
		for (let i = gridRows.length; i < conf.padVerticallyTo; i++) {
			gridRows.push(createFalseFilledArray(rowLength));
		}
	}

	const t1 = performance.now();
	const processingTimeMs = t1 - t0;
	console.debug('Seed processing time:', `${processingTimeMs}ms`);
	return conf.__test_includePerformance ? { gridRows, processingTimeMs } : gridRows;
};
