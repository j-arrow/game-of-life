// Game of life
import './styles.css';
import { initGrid } from './grid';
import { startSimulation } from './simulation';
import { prepareConfigControls } from './configControls';
import { config } from './config';

const gridControl = initGrid();
config.log();

const spawner = gridControl.createSpawner();
spawner.spawnSampleShip();
spawner.spawnPulsarPeriod3(50);

const simulationControl = startSimulation(gridControl);
prepareConfigControls(simulationControl);
