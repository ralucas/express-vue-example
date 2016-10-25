'use strict';

import minify  from 'html-minifier'
import fs      from 'fs';
import phantom from 'phantom';

const renderer = require('vue-server-renderer').createRenderer()

const htmlMinifier = minify.minify;
const htmlRegex    = /(<template>)([\s\S]*?)(<\/template>)/gm;
const scriptRegex  = /(export default {)([\s\S]*?)(^};?$)/gm;
const dataRegex    = /(\'\$parent\').(\w*)/gm;
const appRegex     = /{{{app}}}/igm;
const titleRegex   = /{{{title}}}/igm;
const elRegex      = /[#.]/g
const types        = {
    COMPONENT: 'COMPONENT',
    SUBCOMPONENT: 'SUBCOMPONENT',
    LAYOUT: 'LAYOUT'
};
let defaults = {
    rootPath: __dirname + '/../',
    layoutsDir: '/app/routes/',
    componentsDir: '/app/components/',
    defaultLayout: 'layout',
    options: undefined
};
let finalLayoutHtml = undefined;
let finalLayoutScript = undefined;

function expressVue(componentPath, options, callback) {

    defaults = options.settings.vue;
    defaults.layoutPath = defaults.layoutsDir + defaults.defaultLayout + '.vue';
    defaults.options = options;

    let componentArray = [layoutParser(defaults.layoutPath), componentParser(componentPath, false)]

    if (defaults.options.components) {
        for (var component in defaults.options.components) {
            if (defaults.options.components.hasOwnProperty(component)) {
                componentArray.push(componentParser(__dirname + '/../' + defaults.componentsDir + defaults.options.components[component] + '.vue', true));
            }
        }
    }

    Promise.all(componentArray).then(function(components) {
        let layout  = {}
        let compArr = []
        for (var component of components) {
            switch (component.type) {
                case types.LAYOUT:
                    layout = component;
                    break;
                case types.COMPONENT:
                    layout.template = layout.template.replace(appRegex, `<div id="app">${component.script.template}</div>`);;
                    layout.script   = component.script;
                    break;
                case types.SUBCOMPONENT:
                    if (layout.script.components) {
                        layout.script.components[component.name] = component.script;
                    } else {
                        layout.script.components = {};
                        layout.script.components[component.name] = component.script;
                    }
                    break;
            }
        }
        let renderedScriptString = renderedScript(layout.script);
        global.Vue = require('vue')
        renderer.renderToString(createApp(layout.script), function (error, renderedHtml) {
            let html = layout.template.replace(appRegex, `<div id="app">${renderedHtml}</div>`);
            html = html.replace('{{{script}}}', renderedScriptString);
            console.log(renderedHtml);
            html = html.replace(titleRegex, layout.script.data.title || defaults.options.title);
            callback(null, html);
        })

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
            const contentString = content.toString();

            const body   = htmlParser(contentString);
            const script = scriptParser(contentString);

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

            const contentString = content.toString();

            const body   = htmlParser(contentString, true);
            const script = scriptParser(contentString);

            let componentScript = eval(script);
            componentScript.template = body;

            resolve({
                type: isSubComponent ? types.SUBCOMPONENT : types.COMPONENT,
                component: isSubComponent,
                name: templatePath.match(/\w*\.vue/g)[0].replace('\.vue', ''),
                script: componentScript
            });
        });
    });
}

function scriptToString(script) {
    let string = ''
    for (let member in script) {
        switch (typeof script[member]) {
            case 'function':
                string += member + ': ' + String(script[member]) + ','
                break;
            case 'string':
                string += member + ': ' + JSON.stringify(script[member]) + ','
                break;
            case 'object':
                if (member === 'data') {
                    string += member + ': ' + JSON.stringify(script[member]) + ','
                } else {
                    string += member + ': ' + scriptToString(script[member]) + ','
                }


                break;

        }
    }
    return `{${string}}`;
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

function renderedScript(script) {
    const scriptString = scriptToString(script)
    return `<script>
        (function () {
            'use strict'
            var createApp = function () {
                return new Vue(
                    ${scriptString}
                )
            }
            if (typeof module !== 'undefined' && module.exports) {
                module.exports = createApp
            } else {
                this.app = createApp()
            }
        }).call(this)
    </script>`
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
