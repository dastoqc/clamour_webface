var network = new Vue({
    el:'#vue-network',
    data: {
        id: ["123", "456", "678", "910"]
    },
    
    methods: {
        scan_network: function() {
            this.data.id = ["abc", "def", "ghi", "jkl"];
        }
    }
})