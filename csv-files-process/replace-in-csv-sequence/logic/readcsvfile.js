const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

//* Read CSV File Data
module.exports = (inputPath, fileName, encoding = 'utf8') => {
	return new Promise((resolve, reject) =>
		readFile(inputPath, encoding, (err, data) => {
			if (err) reject(`Unable to read ${fileName} - ${err}`);
			else resolve(data);
		})
	);
};
