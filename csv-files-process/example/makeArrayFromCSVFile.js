// makeArrayFromData(data, '\r\n')
const makeArrayFromData = (data, newLine) => {
	return new Promise(async (resolve, reject) => {
		resolve(data.split(newLine));
	});
};
