<template lang="pug">
  div
    h1#title Tag : {{tag.id}}
    p {{tag.status_detected}}
    p {{tag.status_running}}
</template>

<script>
export default {
  data() {
    return {
    };
  },

  props: {
    tag: {
      id : Number,
      ip_address : String,
      status_detected : false,
      status_running  : String,
    }
  },

  methods: {
    do_something: function() {

    }
  },

  computed: {
    tag_status: function(){
      if(this.status === 'active') return 'active';
      else if(this.status === 'inactive') return 'inactive';
      else return 'unknown'
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