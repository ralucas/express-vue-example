// @flow
import {
    vueComponentLoader,
    counterComponent,
    clickerComponent
} from '../../vue-components';

class MainScope {
    title          : string;
    components     : Object;
    constructor(components: Object) {
        this.title      = 'Vue Test';
        this.components = components;
    }
}

export default (router: Object) => {
    router.get('/', (req, res, next) => {
        vueComponentLoader([counterComponent, clickerComponent]).then((components) => {
            let scope = new MainScope(components);
            console.log(scope);
            res.render('main/main', scope);
        })
    })
};
