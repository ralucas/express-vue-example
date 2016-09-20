const path = require('path');
const glob = require('glob');
const projectRoot = path.resolve(__dirname, '../');
const components = glob.sync(projectRoot + '/app/vue-components/**/src/*.client.js');
let bundles = []

components.forEach(function(component) {
    const componentRoot = component.split('/src/main.client.js')[0]
    const bundle = {
      entry: path.join(componentRoot, '/src/main.client.js'),
      output: {
        path: path.join(componentRoot, '/bundle'),
        // publicPath: path.join(projectRoot, 'public'),
        filename: 'bundle.client.js',
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
      // vue: {
      //   loaders: [
      //     'vue-style-loader',
      //     'css-loader',
      //   ],
      // },
    }
    bundles.push(bundle)
})
module.exports = bundles;
