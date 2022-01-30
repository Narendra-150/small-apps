created=() =>{
  let promiseList = []
  if (options.getCustomers) { promiseList.push({ func: listCustomers }) }
  if (options.getCustomer) { promiseList.push({ func: getCustomer, arg: customerId}) }
  if (options.getUsers) { promiseList.push({ func: getUsers }) }
  await Promise.all(promiseList.map( (prom) => prom.func(prom.arg) ))
}


created2=()=> {
  let promiseTasks = []; // meaning name is better
  if (options.getCustomers) {
      promiseTasks.push(() => listCustomers());
  }
  if (options.getCustomer) {
      promiseTasks.push(() => getCustomer(customerId));
  }
  if (options.getUsers) {
      promiseTasks.push(() => getUsers());
  }

  await Promise.all(promiseTasks.map((func) => func()));
}