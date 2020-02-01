export const config = (() => {
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

	const instance = {
		getGridWidthInCells: () => 100,
		getGridHeightInCells: () => 50,
		getCellDimensions: () => _cellSize,
		getTickRate: () => _tickRate,
		isRenderingEnabled: () => _renderingEnabled,

		notifyCellDimensionsChange: (newCellDimensions) => {
			_cellSize = newCellDimensions;
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
			console.debug('grid dimensions:', `${instance.getGridWidthInCells()}x${instance.getGridHeightInCells()}`);
			console.debug('cell dimensions:', instance.getCellDimensions());
			console.debug('tick rate:', instance.getTickRate());
			console.debug('rendering enabled:', instance.isRenderingEnabled());
			console.debug(' -------------- ');
		},
	};
	return instance;
})();
