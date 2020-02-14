import { config } from "./config";
import { theme } from "./theme";

export const spawnCell = (canvas, row, col, initialAlive = false) => {
	let _alive = initialAlive;

	const _paint = (color) => {
		if (!config.isRenderingEnabled()) {
			return;
		}

		const cellDimensions = config.getCellDimensions();

		const canvasContext = canvas.getContext('2d');
		canvasContext.fillStyle = color;
		canvasContext.fillRect(cellDimensions * col, cellDimensions * row, cellDimensions, cellDimensions);
	};

	return {
		kill: () => {
			_alive = false;
			_paint(theme.cell.dead);
		},
		reproduce: () => {
			_alive = true;
			_paint(theme.cell.alive);
		},
		draw: () => {
			if (_alive) {
				_paint(theme.cell.alive);
			} else {
				_paint(theme.cell.dead);
			}
		},
		// TODO this method can only return state: <2, 3 or >3 alive, it doesn't have to calculate
		// all 8 neighbours, it can stop on 4 alive
		calculateAliveNeighbours: () => {
			
		},
		isAlive: () => _alive
	};
};
