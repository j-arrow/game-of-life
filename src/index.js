// Game of life
import './styles.css';
import { initGrid } from './grid';
import { startSimulation } from './simulation';
import { initSimulationControls } from './simulationControls';

const gridControl = initGrid();
const simulationControl = startSimulation(gridControl);
initSimulationControls(simulationControl);
