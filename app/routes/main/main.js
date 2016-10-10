// @flow
class MainScope {
    title : string;
    name  : string;
    constructor() {
        this.title = 'Vue Test';
        this.name  = 'Daniel'
    }
}

export default (router: Object) => {
    router.get('/', (req, res, next) => {
        let scope = new MainScope();
        console.log(scope);
        res.render('main/main', scope);
    })
};
