import { GRID_DIMENSION } from "./config";

export const calculateWrap = (pos) => {
	return pos >= GRID_DIMENSION ?
		pos - GRID_DIMENSION : (pos < 0) ?
			pos + GRID_DIMENSION : pos;
}
