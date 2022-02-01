let fs = require("fs");
let util = require("util");
let Handlerbars = require("handlebars");
const htmlPdf = require("html-pdf-chrome");
let readFile = util.promisify(fs.readFile);
let writeFile = util.promisify(fs.writeFile);
let dataPath = "./data/db.json";
let templatePath = "./template.html";

let getValues = data => Object.values(data);
let log = data => (console.log(data), data);

let groupBy = property => data =>
  getValues(
    data.reduce((agr, item) => {
      let group = (agr[item[property]] = agr[item[property]] || {
        items: [],
        key: item[property]
      });
      group.items.push(item);
      return agr;
    }, {})
  );

let parseBufferToJSON = data => JSON.parse(data.toString());
//let groupByGender = data => groupBy("Company")(data);
let compileBufferToTemplate = data => Handlerbars.compile(data.toString());

let getDataFromFile = () =>
  readFile(dataPath)
    .then(parseBufferToJSON)
    //.then(groupByGender)
    .then(data => ({
      items: data
    }));

let getHandlerBarTemplate = () =>
  readFile(templatePath).then(compileBufferToTemplate);
let generateHtml = ([data, template]) => template(data);
let saveFile = data => {
  writeFile("./html/Report2020.html", data);
  return data;
};
let pdfGenerater = data =>
  htmlPdf.create(data).then(pdf => pdf.toFile("./pdf/Report2020.pdf"));
let exitProcess = () => process.exit(0);

Promise.all([getDataFromFile(), getHandlerBarTemplate()])
  .then(generateHtml)
  .then(saveFile)
  .then(pdfGenerater)
  .then(exitProcess);