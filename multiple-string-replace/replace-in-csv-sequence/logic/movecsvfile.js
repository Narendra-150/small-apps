const fs = require('fs');
const { promisify } = require('util');
const moveFile = promisify(fs.rename);
const delay = promisify(setTimeout);

//* Move csv input file to archive folder
module.exports = (_sourcePath, _destPath, fileName) => {
	return new Promise(async (resolve, reject) => 
		moveFile(_sourcePath, _destPath, async (err) => {
			//! sleep for 10s (added for test)
			await delay(10000); 
			
			if (err) throw reject(`Unable to move ${fileName} - ${err}`);
			resolve(`${fileName} Successfully moved to archive!!!`);
		})
	);
};
