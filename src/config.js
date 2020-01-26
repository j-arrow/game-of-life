export const getConfigurationContext = () => ({
	getGridDimension: () => 100,
	getTickRate: () => document.getElementById('tickRateRange').value
});
