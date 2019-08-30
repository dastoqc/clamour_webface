<template lang="pug">
    div
      p#test_text This is the management page
      tag_board(v-bind:known_device_list="known_device_list" v-bind:detected_device_list="detected_device_list")
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
      detected_device_list: [
        {
          tag: {
            id: Number,
            ip_address: String,
            running_status: String
          },
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
      // Erasing the templates
      this.known_device_list.pop();
      this.detected_device_list.pop();

      // Populating the page
      var response = await axios.get("../tags");
      for (var index in response.data) {
        this.known_device_list.push({
          tag: response.data[index],
          detected: false
        });
      }
    } catch (err) {
      alert(
        `An error occured while trying to communicate with the server to load the page\n`,
        err
      );
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
