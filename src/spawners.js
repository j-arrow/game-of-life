// best for grid dimension > 100
const _spawnYourGod = (cellControlProvider, row, col = row) => {
	cellControlProvider(row - 2, col - 2).reproduce();
	cellControlProvider(row - 2, col - 1).reproduce();
	cellControlProvider(row - 2, col + 1).reproduce();
	cellControlProvider(row - 2, col + 2).reproduce();

	cellControlProvider(row - 1, col - 2).reproduce();
	cellControlProvider(row - 1, col + 2).reproduce();

	cellControlProvider(row, col - 1).reproduce();
	cellControlProvider(row, col).reproduce();
	cellControlProvider(row, col + 1).reproduce();

	cellControlProvider(row + 1, col).reproduce();
}

export const createSpawner = (cellControlProvider) => ({
	spawnSampleShip: (row = 0, col = row) => {
		cellControlProvider(row - 2, col - 2).reproduce();
		cellControlProvider(row - 1, col - 1).reproduce();
		cellControlProvider(row, col - 3).reproduce();
		cellControlProvider(row, col - 2).reproduce();
		cellControlProvider(row, col - 1).reproduce();
	},

	spawnPulsarPeriod3: (center) => {
		const step = (distanceFromCenter) => {
			const lowerBound = center - 4;
			const upperBound = center + 4;
			for (let i = lowerBound; i <= upperBound; i++) {
				if (Math.abs(center - i) > 1) {
					const rowAndCol = center - distanceFromCenter;
					cellControlProvider(rowAndCol, i).reproduce();
					cellControlProvider(i, rowAndCol).reproduce();
				}
			}
		};
		step(-6);
		step(-1);
		step(1);
		step(6);
	},

	// best for grid dimension > 100
	spawnYourGod: (row, col = row) => _spawnYourGod(cellControlProvider, row, col),

	// best for grid dimension > 100
	spawnFireMan: () => {
		_spawnYourGod(cellControlProvider, 40, 30);
		_spawnYourGod(cellControlProvider, 40, 70);
		_spawnYourGod(cellControlProvider, 60, 50);
	},

	spawnNiceExplosion: () => {
		this.spawnSampleShip();
		this.spawnPulsarPeriod3(50);
	}
});
