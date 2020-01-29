let context = undefined;
export const getConfigurationContext = () => {
	if (!context) {
		let _cellSize = undefined /* px */;
		let _tickRate = undefined /* ms */;
		let _renderingEnabled = undefined;

		const tickRateRange = document.getElementById('tickRateRange');
		_tickRate = tickRateRange.value;
		tickRateRange.addEventListener('change', (event) => {
			_tickRate = event.target.value;
		})

		const renderingEnabledCheckbox = document.getElementById('renderingEnabledCheckbox');
		_renderingEnabled = renderingEnabledCheckbox.checked;
		renderingEnabledCheckbox.addEventListener('change', (event) => {
			_renderingEnabled = event.target.checked;
		})

		context = {
			getGridDimensions: () => 100 /* cells */,
			getCellDimensions: () => _cellSize,
			getAliveCellColor: () => '#DCDCDC',
			getDeadCellColor: () => '#000000',
			getTickRate: () => _tickRate,
			isRenderingEnabled: () => _renderingEnabled,

			notifyGridSizeChange: (gridSize) => {
				const gridDimensions = context.getGridDimensions();
				_cellSize = Math.floor(gridSize / gridDimensions);
			},

			addRenderingEnabledChangedListener: (callback) => {
				const fn = (event) => callback(event.target.checked);
				renderingEnabledCheckbox.addEventListener('change', fn);
				return {
					remove: () => renderingEnabledCheckbox.removeEventListener('change', fn),
				};
			},

			log: () => {
				console.debug(' --- Config --- ');
				console.debug('grid dimensions:', context.getGridDimensions());
				console.debug('cell dimensions:', context.getCellDimensions());
				console.debug('tick rate:', context.getTickRate());
				console.debug('rendering enabled:', context.isRenderingEnabled());
				console.debug(' -------------- ');
			},
		};
	}
	return context;
};
