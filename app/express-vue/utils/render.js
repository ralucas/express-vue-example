import {Types} from '../defaults';

const renderer     = require('vue-server-renderer').createRenderer()
const appRegex     = /{{{app}}}/igm;
const scriptRegex  = /{{{script}}}/igm;
const titleRegex   = /{{{title}}}/igm;
const types        = new Types();

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

function mergeObjects(obj1,obj2){
    var obj3 = {};

    function joinObjects(objc, attrname) {
        if (typeof objc == 'function') {
            obj3[attrname] = function() {
                return objc()
            }
        } else {
            obj3[attrname] = objc;
        }
    }

    for (var attrname in obj1) {
        joinObjects(obj1[attrname], attrname)
    }
    for (var attrname in obj2) {
        joinObjects(obj2[attrname], attrname)
    }
    return obj3;
}

function layoutUtil(components) {
    let layout = {}
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
    return layout;
}

function renderUtil(layout, renderedScriptString, defaults) {
    let html = '';
    global.Vue = require('vue')
    renderer.renderToString(createApp(layout.script), function (error, renderedHtml) {
        html = layout.template.replace(appRegex, `<div id="app">${renderedHtml}</div>`);
        html = html.replace(scriptRegex, renderedScriptString);
        html = html.replace(titleRegex, layout.script.data.title || defaults.options.title);
    })
    return html
}

export {
    renderUtil,
    layoutUtil
}
