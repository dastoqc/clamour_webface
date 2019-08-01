<template>
  <div>
      <a class="vote" :class="{ active: hasVotes }" @click="vote"></a>
      <div class="points">{{ votes }}</div>
  </div>
</template>

<script>
    export default {
        data(){
            return{
                votes: this.voted
            }
        },

        props: {
            voted: {
                required: true,
                type: Number
            },
            article: {
                required: true,
                type: Object
            }
        },

        computed: {
            hasVotes() {
                return this.votes > 0;
            }
        },

        methods:{
            vote(){
                axios.post('/article/vote/' + this.article.id)
                    .then(function (response) {
                        console.log(response.data);
                        this.votes = response.count;
                    });
            }
        }
    }
</script>