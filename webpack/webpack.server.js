const path = require('path');
const glob = require('glob');
const projectRoot = path.resolve(__dirname, '../');
const components = glob.sync(projectRoot + '/app/vue-components/**/src/*.server.js');
let bundles = []

components.forEach(function(component) {
    const componentRoot = component.split('/src/main.server.js')[0]
    const bundle = {
        target: 'node', // !different
        entry: path.join(componentRoot, '/src/main.server.js'),
        output: {
            libraryTarget: 'commonjs2', // !different
            path: path.join(componentRoot, '/bundle'),
            filename: 'bundle.server.js',
        },
        module: {
            loaders: [
                {
                    test: /\.vue$/,
                    loader: 'vue',
                },
                {
                    test: /\.js$/,
                    loader: 'babel',
                    include: projectRoot,
                    exclude: /node_modules/,
                },
            ]
        },
    }
    bundles.push(bundle)
})

module.exports = bundles;
