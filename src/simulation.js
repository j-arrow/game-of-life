import { config } from "./config";

let _running = false;
let _tickCount = 0;

const _createSimulationControl = (gridControl) => ({
	resume: () => {
		if (_running) {
			return;
		}
		console.debug('Simulation running...');
		_running = true;
	},
	pause: () => {
		if (!_running) {
			return;
		}
		console.debug('Simulation paused');
		_running = false;
	},
	tick: () => {
		if (!_running) {
			return;
		}

		const t0 = performance.now();
		gridControl.tick();
		const t1 = performance.now();

		const tickProcessingTimeMs = t1 - t0;
		const tickRate = config.getTickRate();
		console.debug(`Tick: ${++_tickCount}, time processing: ${tickProcessingTimeMs}ms`);
		if (tickProcessingTimeMs > tickRate) {
			console.error(`Tick processing time of ${tickRate}ms exceeded`);
		}
	}
});

export const startSimulation = (gridControl) => {
	const simulationControl = _createSimulationControl(gridControl);

	const fn = () => {
		simulationControl.tick();
		setTimeout(fn, config.getTickRate());
	}
	setTimeout(fn, config.getTickRate());

	return simulationControl;
}
