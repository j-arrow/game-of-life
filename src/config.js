let context = undefined;
export const getConfigurationContext = () => {
	let _cellSize = 0 /* px */;

	if (!context) {
		context = {
			getGridDimensions: () => 300 /* cells */,
			getCellDimensions: () => _cellSize,
			getAliveCellColor: () => '#DCDCDC',
			getDeadCellColor: () => '#000000',
			getTickRate: () => document.getElementById('tickRateRange').value /* ms */,
			isRenderingEnabled: () => document.getElementById('renderingEnabledCheckbox').checked,

			notifyGridSizeChange: (gridSize) => {
				const gridDimensions = context.getGridDimensions();
				_cellSize = Math.floor(gridSize / gridDimensions);
			},

			addRenderingEnabledChangedListener: (callback) => {
				const fn = (event) => callback(event.target.checked);
				const checkbox = document.getElementById('renderingEnabledCheckbox');
				checkbox.addEventListener('change', fn);
				return {
					remove: () => checkbox.removeEventListener('change', fn),
				};
			},
		};
	}
	return context;
};
