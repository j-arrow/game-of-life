import { getConfigurationContext } from "./config";

export const spawnCell = (canvas, row, col) => {
	let _alive = false;

	const _paint = (color) => {
		if (!getConfigurationContext().isRenderingEnabled()) {
			return;
		}

		const cellDimensions = getConfigurationContext().getCellDimensions();

		const canvasContext = canvas.getContext('2d');
		canvasContext.fillStyle = color;
		canvasContext.fillRect(cellDimensions * col, cellDimensions * row, cellDimensions, cellDimensions);
	};

	return {
		kill: () => {
			_alive = false;
			_paint(getConfigurationContext().getDeadCellColor());
		},
		reproduce: () => {
			_alive = true;
			_paint(getConfigurationContext().getAliveCellColor());
		},
		draw: () => {
			if (_alive) {
				_paint(getConfigurationContext().getAliveCellColor());
			} else {
				_paint(getConfigurationContext().getDeadCellColor());
			}
		},
		isAlive: () => _alive
	};
};
