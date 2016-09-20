// @flow
import {
    vueComponentLoader,
    counterComponent,
    clickerComponent
} from '../../vue-components';

class Scope {
    title          : string;
    components     : Object;
    componentLoader: Object;
    constructor(data = {}) {
        this.title           = 'Vue Test';
        this.componentLoader = vueComponentLoader([counterComponent, clickerComponent])
    }
}

export default (router: Object) => {
    router.get('/', (req, res, next) => {
        let scope = new Scope();
        scope.componentLoader.then((components) => {
            scope.components = components
            console.log(scope);
            res.render('main/main', scope);
        })
    })
};
