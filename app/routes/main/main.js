// @flow
class MainScope {
    title : string;
    name  : string;
    components: [string];
    constructor() {
        this.title = 'Vue Test';
        this.name  = 'Daniel';
        this.components = ['myheader', 'myfooter']
    }
}

export default (router: Object) => {
    router.get('/', (req, res, next) => {
        let scope = new MainScope();
        res.render('main/main', scope);
    })
};
