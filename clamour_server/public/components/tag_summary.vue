<template lang="pug">
    div
      p {{ title }}
      | random text 
</template>

<script>
// Imports
export default {
  data() {
    return {
      title: "Vue Wizards"
    };
  },
  methods: {
    updateTitle: function(updatedTitle) {
      this.title = updatedTitle;
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
