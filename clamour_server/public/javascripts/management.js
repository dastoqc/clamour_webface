var Vue = require("vue/dist/vue.js");

Vue.component("tag_summary", require("../components/management.vue"));

const app = new Vue({
  el: "#app"
});