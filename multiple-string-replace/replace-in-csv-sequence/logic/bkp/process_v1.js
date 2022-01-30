const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readDir = promisify(fs.readdir);
const moveFile = promisify(fs.rename);
const delay = promisify(setTimeout);

const { join } = require('path');

const log = require('../../helper/log');
let inbound = join(__dirname, '../bucket/inbound/');
let outbound = join(__dirname, '../bucket/outbound/');
let archive = join(__dirname, '../bucket/archive/');

//* Read CSV File Data
const readCSVFile = (inputPath, encoding = 'utf8') => {
	return new Promise(async (resolve, reject) => {
		const data = await readFile(inputPath, encoding, (err, dataDemo1) => {
			if (err) reject(`File Read Proccessing Failed!!! ${err}`);
			else resolve(dataDemo1);
		});
	});
};

//* Do changes in csv file
const replaceData = (_data, replaceWith) => _data.replace(/(\w+|\W+)/g, (txt, key) => replaceWith[key] || txt);

const updateFileFunction = (_data, replaceWith, inputFileName) => {
	return new Promise(async (resolve, reject) => {
			resolve(replaceData(_data, replaceWith))
	});
};

//* Create new csv file
const writeCSVFile = (outputPath, inputData, encoding = 'utf8') => {
	return new Promise(async (resolve, reject) => {
		const data = await writeFile(outputPath, inputData, encoding, (err, data) => {
			if (err) reject(`File Write Proccessing Failed!!! ${err}`);
			else resolve(data);
		});
	});
};

//* Move csv input file to archive folder
const moveFileFunction = (_sourcePath, _destPath, inputFileName) => {
	return new Promise(async (resolve, reject) => {
		moveFile(_sourcePath, _destPath, async function(err) {
			if (err) throw reject(`File Move Proccessing Failed!!! ${err}`);
			let sleep= await delay(10000); // sleep for 10s
			resolve(`File Move Proccessing Successfully!!!`);
		});
	});
};


//* Sequential promise
const promiseMap = (promiseArray, inputFunction) => {
	const reducer = (accumulator, currentItem) => {
		return accumulator.then((_finalResult) => {
			return inputFunction(currentItem).then((_result) => {
				_finalResult[currentItem] = _result;
				return _finalResult;
			}).catch((_result) => {
				_finalResult[currentItem] = _result;
				return _finalResult;
			});
		});
	};
	return promiseArray.reduce(reducer, Promise.resolve({}));
};

//* csv file processing
const csvFileSequentialProcess = async (fileName) => {
	const replaceWith = { ',': '|', gmail: 'ymail' };

	let inputPath = `${inbound}/${fileName}`;
	let outputPath = `${outbound}/${fileName}`;
	let archivePath = `${archive}/${fileName}`;

	return readCSVFile(inputPath)
		.then((_data) => updateFileFunction(_data, replaceWith))
		.then((_updatedData) => writeCSVFile(outputPath, _updatedData))
		.then((_) => moveFileFunction(inputPath, archivePath, fileName))
		.then(log) //comment this to disable the log
		.catch(err=>`Proccessing Failed!!! - ${err}`)
};


module.exports = async () => {
	const allFiles = await readDir(inbound);
	const processingStatus = await promiseMap(allFiles, csvFileSequentialProcess);//.then(log);
  console.log("🚀 ~ file: process.js ~ line 93 ~ module.exports= ~ processingStatus", processingStatus)

	// return allFiles.reduce(async (promise, _filename) => {
	// 	let inputPath = `${inbound}/${_filename}`;
	// 	let outputPath = `${outbound}/${_filename}`;
	// 	let archivePath = `${archive}/${_filename}`;


	// 	const processedList = await readCSVFile(inputPath)
	// 	.then((inputData) => replaceData(inputData, replaceWith))
	// 	.then((updatedInputData) => writeCSVFile(outputPath, updatedInputData))
	// 	.then((_) => moveFileFunction(inputPath, archivePath, _filename))
	// 	.then(log);
	// 	return Promise.resolve("Done");
	// }, Promise.resolve(true));

};
