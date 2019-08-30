<template lang="pug">
    div
      ul
        li {{log_message_1}}
        li {{log_message_2}}
        li {{log_message_3}}
      button(v-on:click="scan_network") Scan network
      p#test_text This is the tag board
      ul
        tag_summary(v-for="tag in known_device_list" v-bind:known_device="tag")
</template>

<script>
var axios = require("axios/dist/axios.min.js");
var Tag = require("../components/tag_summary.vue");

module.exports = {
  components: {
    tag_summary: Tag
  },

  props: {
    known_device_list: {
      type: Array,
      required: true
    },
    detected_device_list: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      log_message_1: "Ready to offer",
      log_message_2: "an unforgettable",
      log_message_3: "auditory experience"
    };
  },

  methods: {
    updateMessage: function(newMessage) {
      this.log_message_3 = this.log_message_2;
      this.log_message_2 = this.log_message_1;
      this.log_message_1 = newMessage;
    },

    get_list_id: function(tag_list) {
      if (tag_list.length === 0) return "None";
      var id_list = [];
      for (index in tag_list) {
        id_list.push(tag_list[index].tag_id);
      }
      return id_list;
    },

    scan_network: async function() {
      try {
        // Sending request and parsing response
        this.updateMessage(`Network scan in progress, waiting for answer...`);
        var response = await axios.get("scan_network");
        this.detected_device_list = response.data.detected_tag_list;
        var detected_id = this.get_list_id(this.detected_device_list);

        // Displaying result
        this.updateMessage(
          `Network scan finished, detected device(s) : ${detected_id}`
        );

        // Updating board
        for (i in this.known_device_list) {
          this.known_device_list[i].detected = false;
          for (j in this.detected_device_list) {
            if (this.known_device_list[i].tag.ip_address === this.detected_device_list[j].ip_address) {
              this.known_device_list[i].tag = this.detected_device_list[j];
              this.known_device_list[i].detected = true;
            }
          }
        }
      } catch (err) {
        alert(`An error occured while trying to scan the network\n`, err);
        this.updateMessage(`Network scan failed, no answer from the server`);
        console.warn(`Error during http call :\n`, err);
      }
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
