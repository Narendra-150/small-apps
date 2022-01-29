const process = require('./logic/process');


// const axios = require('axios');

// function countryFromIp(ip) {
//   return axios.get(`http://ip-api.com/json/${ip}`)
//     .then(res => res.data.country);
// }

// const promiseMap = (promiseArray, inputFunction)=> {
// 	const reducer = (accumulator, currentItem) => {
//   return accumulator.then((_finalResult) => {
//     return inputFunction(currentItem).then((_result) => {
//       _finalResult[currentItem] = _result;
// 				return _finalResult;
// 			})}
// 		);
//     }
// 	return promiseArray.reduce(reducer, Promise.resolve({}));
// }

// promiseMap([ '8.8.8.8', '41.182.194.0', '5.34.159.1' ], countryFromIp)//.then(console.log);



// function promiseMap(xs, f) {
//   const reducer = (ysAcc$, x) =>
//   ysAcc$.then(ysAcc => f(x).then(y => { ysAcc[x] = y; return ysAcc; }));
//   return xs.reduce(reducer, Promise.resolve({}));
//   }
  
//   promiseMap(["8.8.8.8", "41.182.194.0", "5.34.159.1"], countryFromIp).then(console.log);

process();
