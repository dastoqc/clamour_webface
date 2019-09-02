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
      new_tag_id: undefined,
      new_ip_address: undefined,
      new_password: undefined
    };
  },

  methods: {
    update_message: function(message) {
      this.$emit("log_message", message);
    },

    update_board: function() {
      this.$emit("update_board");
    },

    reset_input: function() {
      this.new_tag_id = undefined;
      this.new_ip_address = undefined;
      this.new_password = undefined;
    },

    add_device: async function() {
      try {
        // Sending request and parsing response
        this.update_message(`Adding a device to the list of known devices ...`);
        var response = await axios.post("../tags", {
          data: {
            tag_id: this.new_tag_id,
            ip_address: this.new_ip_address,
            password: this.new_password
          }
        });
        // Parsing the response to know if the query was successful or failed
        if (response.data.code)
          this.update_message(
            `Server couldn't add the device : ${response.data.sqlMessage}`
          );
        else {
          this.update_message(
            `Tag ${this.new_tag_id} (IP: ${this.new_ip_address}) added`
          );
          this.reset_input();
          await this.update_board();
        }
      } catch (err) {
        // Error handling
        alert(`An error occured while trying to add a device\n`, err);
        this.update_message(`Device addition failed`);
        console.warn(`Error during http call :\n`, err);
      }
    },

    update_device: async function(selected_tag) {
      this.update_message("Test réussi");
    },

    delete_device: async function(selected_tag) {
      try {
        // Sending request and parsing response
        this.update_message(
          `Erasing the device identified by the ID ${this.new_tag_id} ...`
        );
        var response = await axios.delete(`../tags/${this.new_tag_id}`);

        // Parsing the response to know if the query was successful or failed
        console.log(response.data);
        if (response.data.code) {
          this.update_message(
            `Server couldn't delete the device : ${response.data.sqlMessage}`
          );
        } else if (response.data.affectedRows) {
          this.update_message(`Tag with ID ${this.new_tag_id} deleted`);
          this.reset_input();
          await this.update_board();
        } else {
          this.update_message(`There was no tag with ID ${this.new_tag_id}`);
        }
      } catch (err) {
        // Error handling
        alert(`An error occured while trying to delete a device\n`, err);
        this.update_message(`Device deletion failed`);
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
