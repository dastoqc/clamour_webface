<template lang="pug">
    div
      h1#title Advanced device setup
      tag_board()
</template>

<script>
var Tag_board = require("../components/tag_board.vue");

module.exports = {
  components: {
    tag_board: Tag_board
  },

  data() {
    return {
    };
  },

  methods: {
    updateTitle: function(updatedTitle) {}
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: "Nunito SemiBold";
}
</style>
