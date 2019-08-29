var Vue = require("vue/dist/vue.min.js");

Vue.component("management_page", require("../components/management_page.vue"));

const app = new Vue({
  el: "#app"
});