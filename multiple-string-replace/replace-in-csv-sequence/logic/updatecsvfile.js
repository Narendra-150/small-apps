//* Do changes in csv file
const replaceData = (_data, replaceWith) => _data.replace(/(\w+|\W+)/g, (txt, key) => replaceWith[key] || txt);

//* Do changes in csv file
module.exports = (_data, replaceWith, fileName) => {
	return new Promise(async (resolve, reject) => {
		resolve(replaceData(_data, replaceWith));
	});
};
