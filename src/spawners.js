export const createSpawner = (cellControlProvider) => {
	const control = {
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
		spawnYourGod: (row, col = row) => {
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
		},

		// best for grid dimension > 100
		spawnFireMan: () => {
			control.spawnYourGod(cellControlProvider, 40, 30);
			control.spawnYourGod(cellControlProvider, 40, 70);
			control.spawnYourGod(cellControlProvider, 60, 50);
		},

		spawnNiceExplosion: () => {
			control.spawnSampleShip();
			control.spawnPulsarPeriod3(50);
		}
	};
	return control;
};
