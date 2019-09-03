<template lang="pug">
    div
      h1 Device management board
      ul
        li {{log_message_1}}
        li {{log_message_2}}
        li {{log_message_3}}
        li {{log_message_4}}
        li {{log_message_5}}
        h2 Selected device : {{selected_device.tag.tag_id}}

      tag_setter( v-if="is_advanced_mode" 
                  v-on:log_message="update_message"
                  v-on:update_board="populate_board")

      button(v-on:click="scan_network") Scan network
      button(v-on:click="start_localization") Activate device
      button(v-on:click="stop_download_localization") Stop and download

      p#test_text This is the tag board
      ul
        tag_summary(v-for="tag in known_device_list" 
                    v-bind:known_device="tag"
                    v-bind:is_advanced_mode="is_advanced_mode"
                    v-on:select_tag="select_device($event)"
                    v-on:check_status="check_status($event)"
                    v-on:ping_ip_address="ping_ip_address($event)")
</template>

<script>
var axios = require("axios/dist/axios.min.js");
var Tag = require("../components/tag_summary.vue");
var Tag_setter = require("../components/tag_setter.vue");

module.exports = {
  components: {
    tag_summary: Tag,
    tag_setter: Tag_setter
  },

  props: {
    is_advanced_mode: Boolean
  },

  data() {
    return {
      log_message_1:
        "Ready to offer an unforgettable auditory experience in the Chambord Castle",
      log_message_2: "",
      log_message_3: "",
      log_message_4: "",
      log_message_5: "",

      known_device_list: [
        {
          tag: {
            tag_id: Number,
            ip_address: String,
            script_status: String
          },
          detected: false
        }
      ],
      detected_device_list: [
        {
          tag_id: Number,
          ip_address: String,
          script_status: String
        }
      ],
      selected_device: {
        tag: {
          tag_id: undefined,
          ip_address: undefined,
          script_status: undefined
        },
        detected: false
      }
    };
  },

  methods: {
    get_list_id: function(tag_list) {
      if (tag_list.length === 0) return "None";
      var id_list = [];
      for (index in tag_list) {
        id_list.push(tag_list[index].tag_id);
      }
      return id_list;
    },

    update_message: function(newMessage) {
      this.log_message_5 = this.log_message_4;
      this.log_message_4 = this.log_message_3;
      this.log_message_3 = this.log_message_2;
      this.log_message_2 = this.log_message_1;
      this.log_message_1 = newMessage;
    },

    select_device: function(selected_device) {
      this.selected_device.tag.tag_id == selected_device.tag.tag_id
        ? (this.selected_device = {
            tag: {
              tag_id: undefined,
              ip_address: undefined,
              script_status: undefined
            },
            detected: false
          })
        : (this.selected_device = selected_device);
    },

    unselect_device: function(selected_device) {
      this.selected_device = {
        tag: {
          tag_id: undefined,
          ip_address: undefined,
          script_status: undefined
        },
        detected: false
      };
    },

    ping_ip_address: async function(selected_device) {
      try {
        // Sending request and parsing response
        this.update_message(
          `Attempting to detect tag ${selected_device.tag.tag_id}, waiting for answer...`
        );
        var response = await axios.get(
          `ping/ip_address/${selected_device.tag.ip_address}`
        );

        // Error handling
        if (response.data.error) {
          this.update_message(
            `The detection failed for tag ${selected_device.tag.tag_id} : ${response.data.error}`
          );
          return;
        }
        var is_detected = response.data.detected;
        var tag = response.data.tag;

        // Displaying result
        var detetection_result = is_detected ? "detected" : "not detected";
        this.update_message(
          `Detection result for tag ${selected_device.tag.tag_id}: ${detetection_result}`
        );

        // Updating the board
        for (i in this.known_device_list) {
          if (
            this.known_device_list[i].tag.tag_id === selected_device.tag.tag_id
          ) {
            this.known_device_list[i].tag = tag;
            this.known_device_list[i].detected = is_detected;
          }
        }
      } catch (err) {
        // Error handling
        alert(
          `An error occured while trying to detect device ${selected_device.tag_id}\n`,
          err
        );
        this.update_message(
          `Device detection failed on tag ${selected_device.tag_id}`
        );
        console.warn(`Error during http call :\n`, err);
      }
    },

    check_status: async function(specified_device) {
      try {
        // Sending request and parsing response
        this.update_message(
          `Checking the status of tag ${specified_device.tag.tag_id}, waiting for answer...`
        );
        var response = await axios.get(
          `check_script_status/ip_address/${specified_device.tag.ip_address}`
        );
        var isActivated = response.data.status.isActivated;

        // Displaying result
        var status = isActivated == "ON" ? "ON" : "OFF";
        this.update_message(
          `Status found on the tag ${specified_device.tag.tag_id} : ${status}`
        );

        // Updating the board
        for (i in this.known_device_list) {
          if (
            this.known_device_list[i].tag.tag_id === specified_device.tag.tag_id
          )
            this.known_device_list[i].tag.script_status = status;
        }
      } catch (err) {
        // Error handling
        alert(
          `An error occured while trying to check the status of tag ${specified_device.tag_id}\n`,
          err
        );
        this.update_message(
          `Status check up failed on tag ${specified_device.tag_id}`
        );
        console.warn(`Error during http call :\n`, err);
      }
    },

    scan_network: async function() {
      try {
        // Sending request and parsing response
        this.update_message(`Network scan in progress, waiting for answer...`);
        var response = await axios.get("scan_network");
        this.detected_device_list = response.data.detected_tag_list;
        var detected_id = this.get_list_id(this.detected_device_list);

        // Displaying result
        this.update_message(
          `Network scan finished, detected device(s) : ${detected_id}`
        );

        // Updating board
        this.unselect_device();
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
        this.update_message(`Network scan failed, no answer from the server`);
        console.warn(`Error during http call :\n`, err);
      }
    },

    start_localization: async function() {
      try {
        // Assuring that a tag is selected
        if (!this.selected_device.tag.tag_id) {
          alert(`No tag was selected`);
          return;
        }

        // Sending request and parsing response
        this.update_message(
          `Starting the localization on device ${this.selected_device.tag.tag_id}...`
        );
        var response = await axios.get(
          `start_script/ip_address/${this.selected_device.tag.ip_address}/mode/visit`
        );
        var change = response.data.change;
        var tag = response.data.tag;

        // Displaying result
        if (change === "TURNED ON")
          this.update_message(`Localization started on tag ${tag.tag_id}`);
        else if (change === "ALREADY TURNED ON")
          this.update_message(
            `Localization already running on tag ${tag.tag_id}`
          );

        // Updating the board
        for (i in this.known_device_list) {
          if (
            this.known_device_list[i].tag.tag_id ===
            this.selected_device.tag.tag_id
          )
            this.known_device_list[i].tag = tag;
        }
      } catch (err) {
        // Error handling
        alert(
          `An error occured while trying to activate the localization\n`,
          err
        );
        this.update_message(
          `Localization activation failed on tag ${this.selected_device.tag.tag_id}`
        );
        console.warn(`Error during http call :\n`, err);
      }
    },

    stop_download_localization: async function() {
      try {
        // Assuring that a tag is selected
        if (!this.selected_device.tag.tag_id) {
          alert(`No tag was selected`);
          return;
        }

        // Sending request and parsing response
        this.update_message(
          `Stoping the localization on device ${this.selected_device.tag.tag_id}...`
        );
        var response = await axios.get(
          `stop_download/ip_address/${this.selected_device.tag.ip_address}`
        );
        var tag = response.data.tag;
        var downloaded_files = response.data.downloaded_files;

        // Displaying result
        this.update_message(
          `Device stoped and files retreived : ${downloaded_files}`
        );

        // Updating the board
        for (i in this.known_device_list) {
          if (
            this.known_device_list[i].tag.tag_id ===
            this.selected_device.tag.tag_id
          )
            this.known_device_list[i].tag = tag;
        }
      } catch (err) {
        // Error handling
        alert(
          `An error occured while trying to stop the localization and load files\n`,
          err
        );
        this.update_message(
          `Localization deactivation failed on tag ${this.selected_device.tag.tag_id}`
        );
        console.warn(`Error during http call :\n`, err);
      }
    },

    populate_board: async function() {
      // Populating the page
      try {
        while (this.known_device_list.length)
          await this.known_device_list.pop();
        var response = await axios.get("../tags");
        for (var index in response.data) {
          this.known_device_list.push({
            tag: response.data[index],
            detected: false
          });
        }
      } catch (err) {
        // Error handling
        alert(`An error occured while trying to get the list of tags\n`, err);
        this.update_message(`There is a problem with the server`);
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
      await this.populate_board();
    } catch (err) {
      alert(`An error occured while trying to fetch the lis of devices\n`, err);
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
