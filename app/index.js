// @flow
import express from 'express';
import config  from './config';
import router  from './router';

let app = express();

router(app, config);

app.listen(config.port, () => {
    console.log('Express server listening on port ' + config.port);
});
