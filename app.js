require('babel-register')({
    "plugins": [
        "babel-plugin-transform-flow-strip-types"
    ]
});
require('./app/');
