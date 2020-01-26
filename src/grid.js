import { GRID_DIMENSION } from "./config";
import { addNewCell } from "./cell";

export const fillGrid = (gridElement) => {
	const cellControls = [];

	for (let y = 0; y < GRID_DIMENSION; y++) {
		const row = [];

		for (let x = 0; x < GRID_DIMENSION; x++) {
			const cellControl = addNewCell(gridElement, y, x);
			row.push(cellControl);
		}

		cellControls.push(row);
	}

	return cellControls;
};

const applyGridStyle = (gridElement, size) => {
	gridElement.style = `
		--grid-dimension: ${GRID_DIMENSION};
		--grid-size: ${size};
	`;
}

export const resizeGrid = (gridElement) => {
	const minInner = Math.min(window.innerHeight, window.innerWidth);
	const adjustedMinInner = Math.floor(minInner * 0.95);
	applyGridStyle(gridElement, `${adjustedMinInner}px`);
};
