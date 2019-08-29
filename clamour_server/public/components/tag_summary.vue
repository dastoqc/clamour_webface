<template lang="pug">
    li
      h1#title Tag : {{known_device.tag.id}}
      p#test_text This is the tag summary, yeah!
</template>

<script>
module.exports = {
  components: {},

  props: {
    known_device: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      title: "Tag"
    };
  },

  methods: {
    updateTitle: function() {}
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: "Nunito SemiBold";
}
</style>
