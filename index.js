const express = require('express');

const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/index.html`);
});

const server = app.listen(8000, () => {
	const address = server.address();
	const host = address.host;
	const port = address.port;
	console.log(`Server running at http://${host}:${port}`);
});
