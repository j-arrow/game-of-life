// Game of life
import './styles.css';
import { initGrid } from './grid';
import { startSimulation } from './simulation';
import { initSimulationControls } from './simulationControls';

const gridControl = initGrid();

const spawner = gridControl.createSpawner();
spawner.spawnFireMan();

const simulationControl = startSimulation(gridControl);
initSimulationControls(simulationControl);
