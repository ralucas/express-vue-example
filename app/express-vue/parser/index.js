import fs      from 'fs';
import minify  from 'html-minifier'
import {Types} from '../defaults';

const htmlMinifier = minify.minify;
const htmlRegex    = /(<template>)([\s\S]*?)(<\/template>)/gm;
const scriptRegex  = /(export default {)([\s\S]*?)(^};?$)/gm;
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

function scriptParser(script, defaults) {
    let scriptString = script.match(scriptRegex)[0];
    if (scriptString) {
        scriptString = scriptString.replace(scriptRegex, '({$2})')
        .replace(dataRegex, function(match, p1, p2) {
            return JSON.stringify(defaults.options[p2]);
        });
    }
    return scriptString;
}

function layoutParser(layoutPath, defaults) {

    return new Promise(function(resolve, reject) {
        fs.readFile(layoutPath, function (err, content) {
            if (err) {
                reject(new Error(err));
            }
            const layoutString = content.toString();

            const body   = htmlParser(layoutString);
            const script = scriptParser(layoutString, defaults);

            resolve({
                type: types.LAYOUT,
                template: body,
                script: eval(script)
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

            const componentString = content.toString();

            const body   = htmlParser(componentString, true);
            const script = scriptParser(componentString, defaults);

            let componentScript = eval(script);
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
