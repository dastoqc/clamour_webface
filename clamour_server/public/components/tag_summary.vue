<template lang="pug">
    div
      p#test_text This is just a test text field
</template>

<script>
module.exports = {
  components: {},

  props: {
    tag: {
      type: {
        tag_info: {
          id: Number,
          ip_address: String,
          running_status: String
        },
        network_status: String
      },
      required: true
    }
  },

  data() {
    return {
      title: "Vue Wizards"
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
