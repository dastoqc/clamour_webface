<template lang="pug">
    div
      p#test_text This is just a test text field
</template>

<script>
var Tag_board = require("../components/tag_board.vue");

module.exports = {
  components: {
    tag_board: Tag_board
  },

  data() {
    return {
      known_device_list: [
        {
          tag: {
            id: Number,
            ip_address: String,
            running_status: String
          },
          detected: true
        }
      ],
      detected_device_list: [],
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
