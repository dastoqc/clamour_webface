var Vue = require("vue/dist/vue.min.js");

Vue.component("tag_board", require("../components/tag_board.vue"));

const app = new Vue({
  el: "#app"
});