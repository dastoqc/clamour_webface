<template lang="pug">
    div
      p#test_text This is just a test text field
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
