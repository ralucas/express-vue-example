(function () {
    'use strict'
    var createApp = function () {

        return new Vue({
            template: '<div id="app">You have been here for {{ counter }} seconds.<span v-for="n in age">🎂</span></div>',
            data: {
                counter: 0,
                age: 12
            },
            created: function () {
                var vm = this
                setInterval(function () {
                    vm.counter += 1
                }, 1000)
            }
        })

    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = createApp
    } else {
        this.app = createApp()
    }
}).call(this)
