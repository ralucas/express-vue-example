// @flow
class MainScope {
    title : string;
    name  : string;
    data  : Object;
    components: [string];
    constructor() {
        this.data = {
            name: 'Daniels',
            age: 34
        };
        this.title = 'Vue Test';
        this.components = ['myheader', 'myfooter']
    }
}

export default (router: Object) => {
    router.get('/', (req, res, next) => {
        let scope = new MainScope();
        res.render('main/main', scope);
    })
};
