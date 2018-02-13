let express = require('express');
let bodyParser = require("body-parser");
let app = express();
let request = require("request");

const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const uploadDir = path.join(__dirname, '/uploads/');
const xlsx2json = require('xlsx2json');
const _ = require('lodash');
const jasonConfig = require('./jasonConfig.json');

/**
 * Express Config
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Express Upload Route
 */
app.post('/upload', function (req, res) {
    let form = new formidable.IncomingForm();

    form.multiples = true;
    form.keepExtensions = true;
    form.uploadDir = uploadDir;
    form.parse(req, function (err, fields, files) {
        if (err) return res.status(500).json({error: err});
        xlsx2json(files.file.path).then(jsonArray => {
            let schemaOrgArray = toSchemaOrg(jsonArray);
            res.status(200).json(schemaOrgArray);
        });
    });
    form.on('fileBegin', function (name, file) {
        const [fileName, fileExt] = file.name.split('.');
        file.path = path.join(uploadDir, `${fileName}_${new Date().getTime()}.${fileExt}`)
    });
});

app.post('/semantifyIt', function (req, res) {
    semantifyIt(req.body);
    res.send("Uploaded to Semantify");
});


/**
 * Generates a schemaOrg JSON out of a Jason Config File
 * @param mapping the mapping property from the Jason config file
 * @param excelElement the actual cell of the Excel table
 */
function generateJsonOutOfMapping(mapping, excelElement){
    let keys = Object.keys(excelElement);
    let mappingAsString = JSON.stringify(mapping);

    //iterate through keys and check if any occurences are there
    // --> if yes, replace with excel element
    for (let key of keys){
        let regEx = new RegExp("\\$" + key + "\\$", "g");
        mappingAsString = mappingAsString.replace(regEx, excelElement[key]);
    }

    let jsonOutput = JSON.parse(mappingAsString);

    //some of them are integers, so fix this
    let regEx = new RegExp("\\$NUM\\$", "g");
    for (let key in jsonOutput){
        if(jsonOutput.hasOwnProperty(key)){
            let entry = jsonOutput[key];
            if (entry.indexOf("$NUM$") !== -1){
                entry = entry.replace(regEx, "");
                jsonOutput[key] = parseInt(entry);
            }
        }
    }
    //remove empty/invalid array elements of json
    jsonOutput = pruneEmpty(jsonOutput);
    return jsonOutput;
}

/**
 * (c) jgonian (
 * Source: stackoverflow
 * answered Oct 5 '14 at 11:11
 * @param obj Json Object to remove all empty array elements
 */
function pruneEmpty(obj) {
    return function prune(current) {
        _.forOwn(current, function (value, key) {
            if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
                (_.isString(value) && _.isEmpty(value)) ||
                (_.isObject(value) && _.isEmpty(prune(value)))) {

                delete current[key];
            }
        });
        // remove any leftover undefined values from the delete
        // operation on an array
        if (_.isArray(current)) _.pull(current, undefined);

        return current;

    }(_.cloneDeep(obj));  // Do not modify the original object, create a clone instead
}

function toSchemaOrg(jsonArray) {
    let schemaOrgArray = [];
    _.each(jsonArray, (excelTables) => {
        _.each(excelTables, (element) => {

            //vorname, nachname, titel
            if (element["A"] && element["B"] && element["H"]) {
                if (element["A"] === element["A"].toUpperCase()) {
                    return;
                }
                try {
                    schemaOrgArray.push(generateJsonOutOfMapping(jasonConfig.mapping, element));
                } catch (e) {
                    console.error(e);
                }
            }
        });
    });
    if (jasonConfig.semantifyIt.enabled) semantifyIt(schemaOrgArray);
    return {
        "jasonConfig": jasonConfig,
        "output": schemaOrgArray
    };
}

function semantifyIt(schemaOrgArray) {
    let url = "https://semantify.it/api/annotation/" + jasonConfig.semantifyIt.key;
    var annotationObject = {};
    annotationObject["cid"] = "1234";
    annotationObject["content"] = schemaOrgArray;

    //push JSON object to JSON array
    var bulk = [];
    bulk.push(annotationObject);

    request({
        url: url,
        method: "POST",
        json: bulk
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        } else {
            console.log("error: " + error);
            console.log("response.statusCode: " + response.statusCode);
            console.log("response.statusText: " + response.statusText);
    }});
}

app.use(express.static('public'));

let server = app.listen(3000, function () {

    let port = server.address().port;
    console.log('Server listening on port', port);

});