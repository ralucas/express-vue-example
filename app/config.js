// @flow
import path from 'path';

const config = {
    root: path.normalize(__dirname + '/'),
    rootPath: process.env.ROOT_PATH,
    app: {
        name: 'Vue Test'
    },
    port: process.env.PORT || 9000,
};

export default config;
