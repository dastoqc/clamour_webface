<template lang="pug">
    div
      p#test_text This is the tag board
      p {{known_device_list}}
      ul
        tag_summary(v-for="tag in known_device_list" v-bind:known_device="tag")
</template>

<script>
var Tag = require("../components/tag_summary.vue");

module.exports = {
  components: {
    tag_summary: Tag
  },

  props: {
    known_device_list: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      title: "tag board"
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
