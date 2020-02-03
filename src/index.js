// Game of life
import './styles.css';
import { initGrid } from './grid';
import { startSimulation } from './simulation';
import { prepareConfigControls } from './configControls';
import { config } from './config';

const seed = `
. . . . . . . . . . . . . . .
. . . . . o o . . . . . . . .
. . . . o o o o . . . . . . .
. . . o . o o . o o . o . . .
. . . . . . . . o o . . o . .
. . . o o . . o o . . o o o .
. . . o o o o . o . . o o o .
. . o . . o . . . o . . o . .
. o o o . . o . o o o o . . .
. o o o . . o o . . o o . . .
. . o . . o o . . . . . . . .
. . . o . o o . o o . o . . .
. . . . . . . o o o o . . . .
. . . . . . . . o o . . . . .
. . . . . . . . . . . . . . .
`;

const gridControl = initGrid({
	seed,
	gridHeightInCells: 100,
	gridWidthInCells: 100,
});
config.log();

const simulationControl = startSimulation(gridControl);
prepareConfigControls(simulationControl);
