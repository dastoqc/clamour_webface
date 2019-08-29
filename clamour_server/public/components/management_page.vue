<template lang="pug">
    div
      p#test_text This is the management page
      tag_board(v-bind:known_device_list="test_devices")
</template>

<script>
var Tag_board = require("../components/tag_board.vue");
var axios = require("axios/dist/axios.min.js");

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
          tag: {
            id: 3,
            ip_address: "192.168.4.202",
            running_status: "UNKNOWN"
          },
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
    updateTitle: function(updatedTitle) {},
    scan_network: async function() {
      try {
        var response = await axios.get("scan_network");
        this.detected_device_list = response.data;
      } catch (err) {
        alert(`An error occured while trying to scan the network\n`, err);
        console.warn(`Error during http call :\n`, err);
      }
    }
  },

  created: async function() {
    try {
      var response = await axios.get("../tags");
      for (var known_tag in response.data) {
        known_device_list.push({
          tag: known_tag,
          detected: false
        });
      }
    } catch (err) {
      alert(`An error occured while trying to communicate with the server to load the page\n`, err);
      console.warn(`Error during http call :\n`, err);
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
