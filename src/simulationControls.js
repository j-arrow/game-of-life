export const initSimulationControls = (simulationControl) => {
	document.getElementById('resumeBtn').onclick = () => simulationControl.resume();
	document.getElementById('pauseBtn').onclick = () => simulationControl.pause();
};
