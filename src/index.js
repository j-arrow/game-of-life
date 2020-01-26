// Game of life
import './styles.css';
import { GRID_DIMENSION } from './config';
import { initGrid } from './grid';
import { startSimulation } from './simulation';
import { initSimulationControls } from './simulationControls';

const t0 = performance.now();
const gridControl = initGrid();
const t1 = performance.now();
console.debug(`Initialized: ${t1 - t0}ms for ${GRID_DIMENSION}x${GRID_DIMENSION} grid`);


window.addEventListener('resize', () => gridControl.resize());

const simulationControl = startSimulation(gridControl);
initSimulationControls(simulationControl);
