import path    from 'path';
import fs      from 'fs';
const vueServerRenderer = require('vue-server-renderer');

//Client-Side Bundle File
const clientScript = '/vue-components/clicker/bundle/bundle.client.js';

// Server-Side Bundle File
const serverBundleFilePath = path.resolve(__dirname, './bundle/bundle.server.js')
const serverBundleFileCode = fs.readFileSync(serverBundleFilePath, 'utf8');
const component = vueServerRenderer.createBundleRenderer(serverBundleFileCode);

export default new Promise(function(resolve, reject) {
    component.renderToString(function(err, html) {
        resolve({
            name: 'clickerComponent',
            html: html,
            script: clientScript
        });
    })
})
