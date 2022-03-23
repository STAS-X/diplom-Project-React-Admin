// const server = http.createServer(async (req, res) => {
// 	const body = [];

// 	if (req.method === 'GET') {
// 		const content = await fs.readFile(path.join(bathPath, 'index.html'));
// 		res.writeHead(200, { 'Content-Type': 'text/html' });
// 		res.end(content);
// 	} else if (req.method === 'POST') {
// 		res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

// 		req.on('data', (data) => {
// 			body.push(Buffer.from(data));
// 		});
// 	}
// 	req.on('end', () => {
// 		if (body && body.length > 0) {
// 			const title = body.toString().split('=')[1].replace(/\+/g, ' ');
// 			addNote(title);
// 			res.end(`Title = ${title}`);
// 		}
// 	});
// });

// server.listen(port, () => {
// 	console.log(chalk.green(`Server has been started on port ${port}`));
// });
