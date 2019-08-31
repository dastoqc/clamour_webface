<template lang="pug">
    li
      button#title( v-bind:disabled="!known_device.detected" 
                    v-on:click="$emit('select_tag', known_device)") Tag : {{known_device.tag.tag_id}}
      button#status(v-bind:disabled="!known_device.detected" 
                    v-on:click="$emit('check_status', known_device)") Status : {{known_device.tag.running_status}}
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
    selected: false
  },

  data() {
    return {
    };
  },

  methods: {
    test: function() {
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
