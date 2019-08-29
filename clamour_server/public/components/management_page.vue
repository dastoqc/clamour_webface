<template lang="pug">
    div
      p#test_text This is the management page
      tag_board(v-bind:known_device_list="test_devices")
</template>

<script>
var Tag_board = require("../components/tag_board.vue");

module.exports = {
  components: {
    tag_board: Tag_board
  },

  data() {
    return {
      known_device_list: [
        {
          tag: {
            id: Number,
            ip_address: String,
            running_status: String
          },
          detected: false
        }
      ],
      detected_device_list: [],
      test_devices: [
        {
          tag: { id: 1, ip_address: "192.168.4.200", running_status: "ON" },
          detected: true
        },
        {
          tag: { id: 2, ip_address: "192.168.4.201", running_status: "OFF" },
          detected: true
        },
        {
          tag: { id: 3, ip_address: "192.168.4.202", running_status: "UNKNOWN" },
          detected: false
        },
        {
          tag: { id: 4, ip_address: "192.168.4.203", running_status: "ON" },
          detected: false
        },
        {
          tag: { id: 5, ip_address: "192.168.4.200", running_status: "ON" },
          detected: true
        },
        {
          tag: { id: 6, ip_address: "192.168.4.200", running_status: "ON" },
          detected: false
        }
      ],
      title: "Vue Wizards"
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
