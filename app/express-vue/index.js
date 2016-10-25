'use strict';

import {
    Defaults,
    Types
} from './defaults';

import {renderHtmlUtil} from './utils';

import minify  from 'html-minifier'
import fs      from 'fs';

const htmlMinifier = minify.minify;
const htmlRegex    = /(<template>)([\s\S]*?)(<\/template>)/gm;
const scriptRegex  = /(export default {)([\s\S]*?)(^};?$)/gm;
const dataRegex    = /(\'\$parent\').(\w*)/gm;

let defaults;
let types = new Types();

let finalLayoutHtml = undefined;
let finalLayoutScript = undefined;

function expressVue(componentPath, options, callback) {

    defaults = new Defaults(options.settings.vue);
    defaults.layoutPath = defaults.layoutsDir + defaults.defaultLayout + '.vue';
    defaults.options = options;

    let componentArray = [layoutParser(defaults.layoutPath), componentParser(componentPath, false)]

    if (defaults.options.components) {
        for (var component in defaults.options.components) {
            if (defaults.options.components.hasOwnProperty(component)) {
                componentArray.push(componentParser(defaults.componentsDir + defaults.options.components[component] + '.vue', true));
            }
        }
    }

    Promise.all(componentArray).then(function(components) {
        const html = renderHtmlUtil(components, defaults);
        callback(null, html);
    }, function(error) {
        callback(new Error(error));
    });
}

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

function scriptParser(script) {
    let scriptString = script.match(scriptRegex)[0];
    if (scriptString) {
        scriptString = scriptString.replace(scriptRegex, '({$2})')
        .replace(dataRegex, function(match, p1, p2) {
            return JSON.stringify(defaults.options[p2]);
        });
    }
    return scriptString;
}

function layoutParser(layoutPath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(layoutPath, function (err, content) {
            if (err) {
                reject(new Error(err));
            }
            const layoutString = content.toString();

            const body   = htmlParser(layoutString);
            const script = scriptParser(layoutString);

            resolve({
                type: types.LAYOUT,
                template: body,
                script: eval(script)
            });
        });
    });
}

function componentParser(templatePath, isSubComponent) {
    return new Promise(function(resolve, reject) {
        fs.readFile(templatePath, function (err, content) {
            if (err) {
                reject(new Error(err));
            }

            const componentString = content.toString();

            const body   = htmlParser(componentString, true);
            const script = scriptParser(componentString);

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

function createApp(script) {
    return new Vue(
        script
    )
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = createApp
    } else {
        this.app = createApp()
    }
}



function wrapInVueModule(component) {
    return `(function () { 'use strict'
        var createApp = function () {
            return new Vue(${scriptToString(component)})
        }
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = createApp
        } else {
            this.app = createApp()
        }
    }).call(this)`;
}



expressVue.componentParser = componentParser

export default expressVue;
