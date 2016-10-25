import {renderUtil, layoutUtil} from './render';
import scriptToString from './string';

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

function renderHtmlUtil(components, defaults) {
    let layout = layoutUtil(components);
    let renderedScriptString = renderedScript(layout.script);
    return renderUtil(layout, renderedScriptString, defaults);
}

export {
    renderUtil,
    layoutUtil,
    renderHtmlUtil
}
