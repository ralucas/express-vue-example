import fs      from 'fs';
import minify  from 'html-minifier'
import {Types} from '../defaults';
import {scriptToString} from '../utils';

const htmlMinifier = minify.minify;
const htmlRegex    = /(<template>)([\s\S]*?)(<\/template>)/gm;
const scriptRegex  = /(<script?.*>)([\s\S]*?)(<\/script>)/gm;
const dataRegex    = /(\'\$parent\').(\w*)/gm;
const types        = new Types();

function htmlParser(body, minify) {
    let bodyString = body.match(htmlRegex)[0];
    if (bodyString) {
        bodyString = bodyString.replace(htmlRegex, '$2');
    }

    if (minify) {
        bodyString = htmlMinifier(bodyString, {
            collapseWhitespace: true
        });
    }

    return bodyString;
}

function dataMatcher(vueData, contollerData) {
    for (var key in vueData) {
        if (vueData.hasOwnProperty(key)) {
            if (contollerData.hasOwnProperty(key) && contollerData[key] != undefined) {
                let tempObject = {}
                for (var objectKey in vueData) {
                    tempObject[objectKey] = vueData[objectKey]
                }
                for (var objectKey in contollerData) {
                    tempObject[objectKey] = contollerData[objectKey]
                }
                const output = `data: () => {return ${JSON.stringify(tempObject)};};`
                return output;
            } else {
                const output = `data: () => {return ${JSON.stringify(vueData)};};`
                return output
            }
        }
    }
}

function dataParser(script, defaults) {
    let finalScript = {}
    for (var element in script) {
        if (script.hasOwnProperty(element)) {
            if (element === 'data') {
                const data = script.data()
                const output = dataMatcher(data, defaults.options.data);
                finalScript[element] = eval(output);
            } else {
                finalScript[element] = script[element]
            }
        }
    }
    return finalScript;
}

function scriptParser(script, defaults) {
    let scriptString = script.match(scriptRegex)[0].replace(scriptRegex, '$2');
    let babelScript  = require("babel-core").transform(scriptString, {"presets": ["es2015"]}).code
    let evalScript   = eval(babelScript);
    // console.log(evalScript.data());
    let finalScript  = dataParser(evalScript, defaults)
    return finalScript;
}

function layoutParser(layoutPath, defaults) {

    return new Promise(function(resolve, reject) {
        fs.readFile(layoutPath, function (err, content) {
            if (err) {
                reject(new Error(err));
            }
            let layoutString = content.toString();
            const body   = htmlParser(layoutString);
            layoutString = layoutString.replace(htmlRegex, '')
            const script = scriptParser(layoutString, defaults);
            resolve({
                type: types.LAYOUT,
                template: body,
                script: script
            });
        });
    });
}

function componentParser(templatePath, defaults, isSubComponent) {
    return new Promise(function(resolve, reject) {
        fs.readFile(templatePath, function (err, content) {
            if (err) {
                reject(new Error(err));
            }

            let componentString = content.toString();

            const body   = htmlParser(componentString, true);
            componentString = componentString.replace(htmlRegex, '')
            const script = scriptParser(componentString, defaults);

            let componentScript = script;
            componentScript.template = body;

            resolve({
                type: isSubComponent ? types.SUBCOMPONENT : types.COMPONENT,
                name: templatePath.match(/\w*\.vue/g)[0].replace('\.vue', ''),
                script: componentScript
            });
        });
    });
}

export {
    componentParser,
    layoutParser
}
