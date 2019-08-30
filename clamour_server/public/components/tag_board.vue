<template lang="pug">
    div
      ul
        li {{log_message_1}}
        li {{log_message_2}}
        li {{log_message_3}}
        li {{log_message_4}}
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

  props: {},

  data() {
    return {
      log_message_1: "Ready to offer",
      log_message_2: "an unforgettable",
      log_message_3: "auditory experience",
      log_message_4: "in the Chambord Castle",

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
          id: Number,
          ip_address: String,
          running_status: String
        }
      ],
      selected: {
        tag: {
          id: Number,
          ip_address: String,
          running_status: String
        },
        detected: false
      }
    };
  },

  methods: {
    updateMessage: function(newMessage) {
      this.log_message_4 = this.log_message_3;
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
            if (
              this.known_device_list[i].tag.ip_address ===
              this.detected_device_list[j].ip_address
            ) {
              this.known_device_list[i].tag = this.detected_device_list[j];
              this.known_device_list[i].detected = true;
            }
          }
        }
      } catch (err) {
        // Error handling
        alert(`An error occured while trying to scan the network\n`, err);
        this.updateMessage(`Network scan failed, no answer from the server`);
        console.warn(`Error during http call :\n`, err);
      }
    },

    start_script: async function() {
      try {
        // Sending request and parsing response
        this.updateMessage(
          `Starting the localization on device ${selected.tag.tag_id} ...`
        );
        var response = await axios.get(
          `start_script/ip_address/${known_device.tag.ip_address}/mode/visit`
        );

        // Displaying result
        this.updateMessage(
          `Localization started on tag, ${ip_address} : ${detected_id}`
        );

        // Updating board
      } catch (err) {
        // Error handling
        alert(
          `An error occured while trying to activate the localization\n`,
          err
        );
        this.updateMessage(
          `Localization activation failed, no answer from the server`
        );
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
