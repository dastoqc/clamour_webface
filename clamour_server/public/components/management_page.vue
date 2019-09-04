<template lang="pug">
    div(class="container-fluid")
      h1#title Device Management
      button#management_mode(v-on:click="toggle_mode") {{mode_toggle_button}}
      tag_board(v-bind:is_advanced_mode="is_advanced_mode")
</template>

<script>
var Bootstrap = require("bootstrap/dist/js/bootstrap");

var Tag_board = require("../components/tag_board.vue");

module.exports = {
  components: {
    tag_board: Tag_board,
  },

  data() {
    return {
      is_advanced_mode: false
    };
  },

  methods: {
    toggle_mode: function() {
      this.is_advanced_mode = !this.is_advanced_mode;
    }
  },

  computed:{ 
    mode_toggle_button: function(){
      if(this.is_advanced_mode)
        return "Regular management";
      else
        return "Advanced settings";
    }
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: "Nunito SemiBold";
}
</style>
