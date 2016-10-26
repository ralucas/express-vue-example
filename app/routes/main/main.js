// @flow
class MainScope {
    title : string;
    name  : string;
    data  : Object;
    components: [string];
    constructor() {
        this.data = {
            name: 'Daniel',
            logs: ['foo', 'bar']
        };
        this.title = 'Vue Test';
        this.components = ['myheader', 'myfooter']
    }
}

export default (router: Object) => {
    router.get('/', (req, res, next) => {
        let scope = new MainScope();
        scope.data.age = 40
        res.render('main/main', scope);
    })
};
