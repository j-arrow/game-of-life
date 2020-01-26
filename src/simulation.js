import { EXPECTED_TICK_TIME_MS } from "./config";

let _running = false;
let _tickCount = 0;

const _createSimulationControl = (gridControl) => ({
	play: () => {
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
		console.debug(`Tick: ${++_tickCount}, time processing: ${tickProcessingTimeMs}ms`);
		if (tickProcessingTimeMs > EXPECTED_TICK_TIME_MS) {
			console.error(`Tick processing time of ${EXPECTED_TICK_TIME_MS}ms exceeded`);
		}
	}
});

export const startSimulation = (gridControl) => {
	const simulationControl = _createSimulationControl(gridControl);
	simulationControl.play();

	setInterval(() => {
		simulationControl.tick();
	}, 1000);

	return simulationControl;
}
