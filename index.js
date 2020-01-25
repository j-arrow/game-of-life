const express = require('express');

const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/index.html`);
});

const server = app.listen(8000, () => {
	const address = server.address();
	console.log(`Server listening on port ${address.port}`);
});
