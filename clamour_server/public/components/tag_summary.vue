<template lang="pug">
    li
      h1#title Tag : {{known_device.tag.tag_id}}
      h2#status Status : {{known_device.tag.script_status}}
      h2#network Detection : {{known_device.detected}}
</template>

<script>
module.exports = {
  components: {},

  props: {
    known_device: {
      type: Object,
      required: true
    },
    selected_device: {
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
    test: function() {
      this.known_device.tag.tag_id = 12345;
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
