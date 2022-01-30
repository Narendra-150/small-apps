const { promisify } = require('util');
const { join } = require('path');
const fs = require('fs');
const log = require('../../helper/log');


const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readDir = promisify(fs.readdir);
const moveFile = promisify(fs.rename);
const delay = promisify(setTimeout);

const inbound = join(__dirname, '../bucket/inbound/');
const outbound = join(__dirname, '../bucket/outbound/');
const archive = join(__dirname, '../bucket/archive/');


//* Read CSV File Data
const readCSVFile = (inputPath, fileName, encoding = 'utf8') => {
	return new Promise((resolve, reject) =>
		readFile(inputPath, encoding, (err, data) => {
			if (err) reject(`Unable to read ${fileName} - ${err}`);
			else resolve(data);
		})
	);
};

//* Do changes in csv file
const replaceData = (_data, replaceWith) => _data.replace(/(\w+|\W+)/g, (txt, key) => replaceWith[key] || txt);

const updateFileFunction = (_data, replaceWith, fileName) => {
	return new Promise(async (resolve, reject) => {
		resolve(replaceData(_data, replaceWith));
	});
};

//* Create new csv file
const writeCSVFile = (outputPath, inputData, fileName, encoding = 'utf8') => {
	return new Promise(async (resolve, reject) =>
		writeFile(outputPath, inputData, encoding, (err, data) => {
			if (err) reject(`Unable to write data in ${fileName} - ${err}`);
			else resolve(`${fileName} Successfully created and saved to outbound!!!`);
		})
	);
};

//* Move csv input file to archive folder
const moveFiles = (_sourcePath, _destPath, fileName) => {
	return new Promise(async (resolve, reject) =>
		moveFile(_sourcePath, _destPath, async (err) => {
			//! sleep for 10s (added for test)
			await delay(10000);

			if (err) throw reject(`Unable to move ${fileName} - ${err}`);
			resolve(`${fileName} Successfully moved to archive!!!`);
		})
	);
};

//* Sequential promise
const promiseMap = (promiseArray, _function) => {

	const reducer = (promise, _input) => promise.then((_result) =>
		_function(_input)
			.then(_status => ({ ..._result, [_input]: _status }))
			.catch(_status => ({ ..._result, [_input]: _status }))
	);

	return promiseArray.reduce(reducer, Promise.resolve({}));
};

//* csv file processing
const csvFileSequentialProcess = async (fileName) => {
	const replaceWith = { ',': '|', gmail: 'ymail' };

	let inputPath = `${inbound}/${fileName}`;
	let outputPath = `${outbound}/${fileName}`;
	let archivePath = `${archive}/${fileName}`;

	return readCSVFile(inputPath, fileName)
		.then((_data) => updateFileFunction(_data, replaceWith, fileName))
		.then((_updatedData) => writeCSVFile(outputPath, _updatedData, fileName))
		.then((_) => moveFiles(inputPath, archivePath, fileName))
		.then(log) //comment this to disable the log
		.catch((err) => `Proccessing Failed!!! - ${err}`);
};

module.exports = async () => {
	const allFiles = await readDir(inbound);
	const processingStatus = await promiseMap(allFiles, csvFileSequentialProcess); //.then(log);
	log(`🚀 ~ processingStatus :\n `);
	log(processingStatus);

	// let x=allFiles.map(_x=>()=>csvFileSequentialProcess(_x));
	// Promise.all(x.map(_xz=>_xz()))

};
