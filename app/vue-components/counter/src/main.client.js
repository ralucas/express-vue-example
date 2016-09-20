// client-entry
import Vue from 'vue';
import App from '../counter.vue';

new Vue({
  el: '.counter-view',
  render: (createElement) => {
    return createElement(App);
  },
});
