// @flow
class MainScope {
    data : Object;
    vue  : Object;
    constructor() {
        this.data = {
            name: 'Daniel'
        };
        this.vue = {
            meta: {
                title: 'Page Title',
            }
        }
    }
}

export default (router: Object) => {
    router.get('/', (req, res, next) => {
        let scope = new MainScope();
        console.log(scope);
        res.render('main/main', scope);
    })
};
