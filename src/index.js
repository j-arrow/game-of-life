// Game of life
import './styles.css';
import { initGrid } from './grid';
import { startSimulation } from './simulation';
import { prepareConfigWindow } from './configWindow';

const gridControl = initGrid();

const spawner = gridControl.createSpawner();
spawner.spawnSampleShip();
spawner.spawnPulsarPeriod3(50);

const simulationControl = startSimulation(gridControl);
prepareConfigWindow(simulationControl);
