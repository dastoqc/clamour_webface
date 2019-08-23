<template lang="pug">
    div
      p#test_text This is just a test text field
</template>

<script>
module.exports = {
  components: {
  },

  data() {
    return {
      title: "Vue Wizards"
    };
  },

  methods: {
    updateTitle: function(updatedTitle) {
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
