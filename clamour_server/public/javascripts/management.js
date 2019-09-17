let hidden;
let visibilityChange;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
}

window.document.addEventListener(visibilityChange, () => {
    if (!document[hidden]) {
      window.location.href = '/'
    }
});

var Vue = require("vue/dist/vue.min.js");

Vue.component("management_page", require("../components/management_page.vue"));

const app = new Vue({
  el: "#app"
});