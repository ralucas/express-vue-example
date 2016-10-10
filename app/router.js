// @flow
import express        from 'express';
import glob           from 'glob';
import logger         from 'morgan';
import bodyParser     from 'body-parser';
import compress       from 'compression';
import methodOverride from 'method-override';
import validator      from 'express-validator';
import expressVue     from 'express-vue';

type err = {
    status: number
}

export default (app: Object, config: Object) => {
    const env                  = process.env.NODE_ENV || 'development';
    const router               = express.Router()
    let logType                = 'dev';
    app.locals.ENV             = env;
    app.locals.ENV_DEVELOPMENT = (env === 'development');
    app.locals.rootPath        = process.env.ROOT_PATH;

    app.set('views', config.root + '/routes');

    app.set('vue', {
        layoutsDir: 'app/routes/',
        defaultLayout: 'layout'
    });
    app.engine('vue', expressVue);
    app.set('view engine', 'vue');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(validator());

    app.use(logger(logType));

    app.use(methodOverride());

    app.use(compress());

    app.use(app.locals.rootPath, express.static(config.root))
    app.use('/', router);

    let controllers = glob.sync(config.root + '/routes/**/*.js');

    controllers.forEach(function (controller: string) {
        module.require(controller).default(router)
    });

    app.use((req, res, next) => {
        let err: err = new Error('Not Found');
        err.status = 404
        next(err);
    });

    if(app.get('env') === 'development'){
        app.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err,
                title: 'error'
            });
        });
    }

    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {},
            title: 'error'
        });
    });
};
