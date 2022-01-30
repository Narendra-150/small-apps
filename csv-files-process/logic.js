const log = (data) => (console.log(data), data);

// will replace all the available keys with values
let multipleReplace = (string, replaceWith) => {
	return string.replace(/(\w+)/g, (txt, key) => replaceWith[key] || txt); // : => /\:(\w+)/g
};

// pass keys-values in objects to replce
let replaceObj = {
	Hi: 'Hiiii,',
	Hello: 'Nameste',
	Test: 'Demo',
	Test2: ''
};

let stringToReplace = `Hi Hello Test Message`;

let updatedString = multipleReplace(stringToReplace, replaceObj);

log(`Original String : ${stringToReplace}`);
log(`Replaced String : ${updatedString}`);
