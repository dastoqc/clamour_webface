<template lang="pug">
    div
      p#test_text This is just a test text field
</template>

<script>
// Imports
import Tag from "../components/tag_summary.vue";

export default {
  components: {
    "tag_summary": Tag
  },
  data() {
    return {
      ninjas: [
        { name: "Ryu", speciality: "Vue Components", show: false },
        { name: "Crystal", speciality: "HTML Wizardry", show: false },
      ],
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
