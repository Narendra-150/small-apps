const { promisify } = require('util');
const { join } = require('path');
const fs = require('fs');
const log = require('../helper/log');

const readDir = promisify(fs.readdir);

const inbound = join(__dirname, '../bucket/inbound/');
const outbound = join(__dirname, '../bucket/outbound/');
const archive = join(__dirname, '../bucket/archive/');

const { readCSVFile, updateFileFunction, writeCSVFile, moveFiles, promiseMap } = require('../helper/modules');

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
	let allFilesProcess = allFiles.map(_fileName => () => csvFileSequentialProcess(_fileName));
	return Promise.all(allFilesProcess.map(_fileProcess => _fileProcess()));
};
