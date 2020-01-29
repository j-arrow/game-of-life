// Game of life
import './styles.css';
import { initGrid } from './grid';
import { startSimulation } from './simulation';
import { prepareConfigControls } from './configControls';
import { getConfigurationContext } from './config';

const gridControl = initGrid();
getConfigurationContext().log();

const spawner = gridControl.createSpawner();
spawner.spawnSampleShip();
spawner.spawnPulsarPeriod3(50);

const simulationControl = startSimulation(gridControl);
prepareConfigControls(simulationControl);
