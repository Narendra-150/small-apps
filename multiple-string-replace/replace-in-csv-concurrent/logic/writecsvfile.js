const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

module.exports = (outputPath, inputData, fileName, encoding = 'utf8') => {
	return new Promise(async (resolve, reject) =>
		writeFile(outputPath, inputData, encoding, (err, data) => {
			if (err) reject(`Unable to write data in ${fileName} - ${err}`);
			else resolve(`${fileName} Successfully created and saved to outbound!!!`);
		})
	);
};