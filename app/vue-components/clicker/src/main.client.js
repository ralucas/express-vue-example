// client-entry
import Vue from 'vue';
import App from '../clicker.vue';

new Vue({
  el: '.clicker-view',
  render: (createElement) => {
    return createElement(App);
  },
});
