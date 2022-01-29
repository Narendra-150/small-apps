const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readDir = promisify(fs.readdir);
const moveFile = promisify(fs.rename);
const { join } = require('path');

const log = require('../helper/log');
let inbound = join(__dirname, '../bucket/inbound/');
let outbound = join(__dirname, '../bucket/outbound/');
let archive = join(__dirname, '../bucket/archive/');

const readCSVFile = (inputPath, encoding = 'utf8') => {
	return new Promise(async (resolve, reject) => {
		const data = await readFile(inputPath, encoding, function(err, dataDemo1) {
			if (err) reject(err);
			else resolve(dataDemo1);
		});
		return data;
	});
};

const writeCSVFile = (outputPath, inputData, encoding = 'utf8') => {
	return new Promise(async (resolve, reject) => {
		const data = await writeFile(outputPath, inputData, encoding);
		resolve(data);
	});
};

// makeArrayFromData(data, '\r\n')
const makeArrayFromData = (data, newLine) => {
	return new Promise(async (resolve, reject) => {
		resolve(data.split(newLine));
	});
};

const replaceData = (data, replaceWith) => data.replace(/(\w+|\W+)/g, (txt, key) => replaceWith[key] || txt);

// moveFile(oldPath, newPath, function (err) {
//   if (err) throw err
//   console.log('Successfully renamed - AKA moved!')
// })

const moveFileFunction = (oldPath, newPath, inputFileName) => {
	return new Promise(async (resolve, reject) => {
		moveFile(oldPath, newPath, function(err) {
			if (err) throw reject(err);
			resolve(`Successfully completed!!!`);
		});
	});
};

const promiseMap = (promiseArray, inputFunction) => {
	const reducer = (accumulator, currentItem) => {
		return accumulator.then((_finalResult) => {
			return inputFunction(currentItem).then((_result) => {
				_finalResult[currentItem] = _result;
				return _finalResult;
			});
		});
	};
	return promiseArray.reduce(reducer, Promise.resolve({}));
};

module.exports = async () => {
	const replaceWith = { ',': '|', gmail: 'ymail' };
	const allFiles = await readDir(inbound);

	const csvFileProcess = async (inputFileName) => {
		let inputPath = `${inbound}/${inputFileName}`;
		let outputPath = `${outbound}/${inputFileName}`;
		let archivePath = `${archive}/${inputFileName}`;

		return readCSVFile(inputPath)
			.then((inputData) => replaceData(inputData, replaceWith))
			.then((updatedInputData) => writeCSVFile(outputPath, updatedInputData))
			.then((_) => moveFileFunction(inputPath, archivePath, inputFileName));
		// .then(log);
	};

	promiseMap(allFiles, csvFileProcess).then(log);
};
