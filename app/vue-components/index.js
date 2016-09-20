import counterComponent from './counter'
import clickerComponent from './clicker'

function vueComponentLoader(components) {
    return new Promise((resolve, reject) => {
        let finalComponents = {}
        components.forEach((component) => {
            component.then(function(object) {
                finalComponents[`${object.name}`] = object;
            });
        })
        resolve(finalComponents);
    })
}

export {
    vueComponentLoader,
    counterComponent,
    clickerComponent
}
