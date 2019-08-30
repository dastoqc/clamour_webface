<template lang="pug">
    div
      p#test_text This is the management page
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
      title: "Vue Wizards"
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
