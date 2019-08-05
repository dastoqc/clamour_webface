
var network = new Vue({
    el:'#vue-network',
    data: {
        scan_done: false,
        ip_addresses: ["123", "456", "678", "910"],
        selected: ""
    },
    
    methods: {
        scan_network: function() {
            this.ip_addresses = ["abc", "def", "ghi", "jkl"];
            this.scan_done = true;
            axios.get("management/network")
                .then((res) => {
                    this.ip_addresses=res.data;
                    console.log(res);
                })
                .catch((err) => {
                    console.warn('error during http call', err);
                });
        }
    }
})