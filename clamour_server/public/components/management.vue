<template lang="pug">
    div
      p#test_text This is just a test text field
</template>

<script>
var Tag = require("../components/tag_summary.vue");

module.exports = {
  components: {
    tag_summary: Tag
  },

  data() {
    return {
      known_device_list: [],
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
