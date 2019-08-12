<template lang="pug">
  div#block_management
    management-tag(v-for="tag in ")

    input#button_scan_network(type="button" v-on:click="scan_network"         value="Scan network")
    input#button_start_device(type="button" v-on:click="start_device"         value="Start devices")
    input#button_st_do_device(type="button" v-on:click="stop_download_device" value="Stop download")
    
    management-tag(v-for="address in ip_addresses" v-bind:value="selected") {{address}}
</template>

<script>
// Imports
import Tag from "./components/tag.vue";

export default {
  components: {
    "management-tag": Tag
  },

  data() {
    return {
      ip_addresses: []
    };
  },

  methods: {
    scan_network: function() {
      return 0;
    }
  }
};
</script>

<style scoped>
h1 {
  color: green;
}
li {
  list-style-type: none;
  padding: 6px;
}
</style>