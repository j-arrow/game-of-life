export const initSimulationControls = (simulationControl) => {
	document.getElementById('resumeBtn').onclick = () => simulationControl.play();
	document.getElementById('pauseBtn').onclick = () => simulationControl.pause();
};
