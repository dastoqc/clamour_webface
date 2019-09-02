<template lang="pug">
  div
    h1 Device setting

    select(v-model="option")
      option(disabled value="") Select the option
      option(value="add") Add a new device
      option(value="update") Update an existing device
      option(value="delete") Delete an existing device

    div(v-if="option === 'add'")
      button(v-on:click="add_device") Add device
      p ID to add:
      input(v-model="tag_id_to_add")
      p IP address to add: 
      input(v-model="ip_address_to_add")

    div(v-if="option === 'update'")
      button(v-on:click="update_device") Update device
      p ID of the tag to update:
      input(v-model="tag_id_to_update")
      
      div
        select(v-model="selected_parameter")
          option(disabled value="") Select the parameter to change
          option(value="tag_id") ID
          option(value="ip_address") IP address

        div(v-if="selected_parameter === 'tag_id'")
          p New ID:
          input(v-model="new_tag_id")
        div(v-if="selected_parameter === 'ip_address'")
          p New IP address: 
          input(v-model="new_ip_address")

    div(v-if="option === 'delete'")
      button(v-on:click="delete_device") Delete device
      p ID of the tag to delete:
      input(v-model="tag_id_to_delete")
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
      option: "",

      tag_id_to_add: undefined,
      ip_address_to_add: undefined,

      selected_parameter: "",
      tag_id_to_update: undefined,
      new_tag_id: undefined,
      new_ip_address: undefined,

      tag_id_to_delete: undefined
    };
  },

  methods: {
    update_message: function(message) {
      this.$emit("log_message", message);
    },

    update_board: function() {
      this.$emit("update_board");
    },

    reset_add_input: function() {
      this.new_tag_id = undefined;
      this.new_ip_address = undefined;
    },

    reset_update_input: function() {
      this.tag_id_to_update = undefined;
      this.new_tag_id = undefined;
      this.new_ip_address = undefined;
    },

    reset_delete_input: function() {
      this.tag_id_to_delete = undefined;
    },

    add_device: async function() {
      try {
        // Sending request and parsing response
        this.update_message(`Adding a device to the list of known devices ...`);
        var response = await axios.post("../tags", {
          data: {
            tag_id: this.tag_id_to_add,
            ip_address: this.ip_address_to_add,
          }
        });
        // Parsing the response to know if the query was successful or failed
        if (response.data.code)
          this.update_message(
            `Server couldn't add the device : ${response.data.sqlMessage}`
          );
        else {
          this.update_message(
            `Tag ${this.tag_id_to_add} (IP: ${this.ip_address_to_add}) added`
          );
          this.reset_add_input();
          await this.update_board();
        }
      } catch (err) {
        // Error handling
        alert(`An error occured while trying to add a device\n`, err);
        this.update_message(`Device addition failed`);
        console.warn(`Error during http call :\n`, err);
      }
    },

    update_device: async function() {
      try {
        // Adjusting the sent data according to the selected parameter
        var request_content;
        if (this.selected_parameter === "tag_id")
          request_content = { data: { tag_id: this.new_tag_id } };
        else if (this.selected_parameter === "ip_address")
          request_content = { data: { ip_address: this.new_ip_address } };

        // Sending request and parsing response
        this.update_message(`Adding a device to the list of known devices ...`);
        var response = await axios.put(
          `../tags/${this.tag_id_to_update}`,
          request_content
        );

        // Parsing the response to know if the query was successful or failed
        if (response.data.code) {
          this.update_message(
            `Server couldn't update the device : ${response.data.sqlMessage}`
          );
        } else if (response.data.affectedRows) {
          this.update_message(
            `Tag ${this.tag_id_to_update} : the parameter ${this.selected_parameter} was updated`
          );
          this.reset_update_input();
          await this.update_board();
        } else {
          this.update_message(
            `There was no tag with ID ${this.tag_id_to_update}`
          );
        }
      } catch (err) {
        // Error handling
        alert(`An error occured while trying to update a device\n`, err);
        this.update_message(`Device update failed`);
        console.warn(`Error during http call :\n`, err);
      }
    },

    delete_device: async function() {
      try {
        // Sending request and parsing response
        this.update_message(
          `Erasing the device identified by the ID ${this.tag_id_to_delete} ...`
        );
        var response = await axios.delete(`../tags/${this.tag_id_to_delete}`);

        // Parsing the response to know if the query was successful or failed
        if (response.data.code) {
          this.update_message(
            `Server couldn't delete the device : ${response.data.sqlMessage}`
          );
        } else if (response.data.affectedRows) {
          this.update_message(`Tag with ID ${this.tag_id_to_delete} deleted`);
          this.reset_delete_input();
          await this.update_board();
        } else {
          this.update_message(
            `There was no tag with ID ${this.tag_id_to_delete}`
          );
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
