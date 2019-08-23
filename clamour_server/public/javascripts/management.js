var Vue = require("vue/dist/vue.js");

Vue.component("tag_summary", require("../components/tag_summary.vue"));

const app = new Vue({
  el: "#app"
});