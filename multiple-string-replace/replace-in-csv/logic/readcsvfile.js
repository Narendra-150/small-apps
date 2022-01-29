const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

module.exports = (inputPath, encoding = 'utf8') => {
	return new Promise(async (resolve, reject) => {
		const data = await readFile(inputPath, encoding);
		resolve(data);
	});
};
