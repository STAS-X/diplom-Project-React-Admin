// import path from 'path';
// import {fileURLToPath} from 'url';

// const __filepath=fileURLToPath(import.meta.url);
// const __dirpath = path.dirname(__filepath);

// console.log(__dirpath);
// console.log(__filepath);

const os = require('os');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

console.log(os.platform());
console.log(os.arch());
console.log(os.cpus());

console.log(path.dirname(__filename));
console.log(path.parse(__filename));
console.log(path.resolve(__dirname, '..', './modules', './app.js'));
console.log(path.join(__dirname, '..', './modules', './app.js'));

const base = path.join(__dirname, 'temp');

const getContent = () => {
	return `\n\r${process.argv[2] ? process.argv[2] : 'my first log'}`;
};

async function start() {
	try {
		if (!fsSync.existsSync(base)) {
			await fs.mkdir(base).then(() => {
				console.log('Dir temp created success');
			});
		}
		if (!fsSync.existsSync(path.join(base, 'log.txt'))) {
			await fs.writeFile(path.join(base, 'log.txt'), getContent()).then(() => {
				console.log('Log file created success');
			});
		} else {
			await fs.appendFile(path.join(base, 'log.txt'), getContent()).then(() => {
				console.log('Log file created success');
			});
			const data = await fs.readFile(path.join(base, 'log.txt'), {
				encoding: 'utf-8',
			});
			console.log(data);
		}
	} catch (err) {
		console.log('err', err);
	}
}

start();
