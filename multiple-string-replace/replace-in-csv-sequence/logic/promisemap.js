
//* Sequential promise
module.exports = (promiseArray, _function) => {

  const reducer = (promise, _input) => promise.then((_result) =>
    _function(_input)
      .then(_status => ({ ..._result, [_input]: _status }))
      .catch(_status => ({ ..._result, [_input]: _status }))
  );

  return promiseArray.reduce(reducer, Promise.resolve({}));
};
