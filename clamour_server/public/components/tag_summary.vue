<template lang="pug">
    li
      button#title(   v-bind:disabled="!known_device.detected" 
                      v-on:click="$emit('select_tag', known_device)")       Tag : {{known_device.tag.tag_id}}
      button#status(  v-bind:disabled="!known_device.detected" 
                      v-on:click="$emit('check_status', known_device)")     Status : {{known_device.tag.script_status}}
      button#network( v-on:click="$emit('ping_ip_address', known_device)")  Detection : {{known_device.detected}}
      p#ip_address(v-if="is_advanced_mode") {{known_device.tag.ip_address}}
</template>

<script>
module.exports = {
  components: {},

  props: {
    known_device: {
      type: Object,
      required: true
    },
    selected: false,
    is_advanced_mode: Boolean
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
