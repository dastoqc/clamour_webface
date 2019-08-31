<template lang="pug">
  div
    h1 Device setting
    div
      button(v-on:click="add_device") Add device
      button(v-on:click="update_device") Update device
      button(v-on:click="delete_device") Delete device
    div
      p New ID:
      input(v-model="new_tag_id")
      p New IP address: 
      input(v-model="new_ip_address")
      p Password:
      input(v-model="new_password")
</template>

<script>
var axios = require("axios/dist/axios.min.js");

module.exports = {
  props: {
    selected_tag: {
      tag_id: Number,
      ip_address: String,
      script_status: String
    },
    is_advanced_mode: Boolean
  },

  data() {
    return {
      new_tag_id: "",
      new_ip_address: "",
      new_password: "",
      log_message: "Manage the settings of the devices from this board"
    };
  },

  methods: {
    add_device: async function() {
      try {
        console.log(this.new_tag_id);
        console.log(this.new_ip_address);
        console.log(this.new_password);
        var response = await axios.post("../tags", {
          data: {
            tag_id: this.new_tag_id,
            ip_address: this.new_ip_address,
            password: this.new_password
          }
        });
      } catch (err) {
        // Error handling
        alert(
          `An error occured while trying to add a device to the server\n`,
          err
        );
        //this.update_message(`Device addition failed`);
        console.warn(`Error during http call :\n`, err);
      }
    },
    update_device: function(selected_tag) {},
    delete_device: function(selected_tag) {}
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: "Nunito SemiBold";
}
</style>
