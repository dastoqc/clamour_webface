
var network = new Vue({
    el:'#vue-network',
    data: {
        is_scanning: false,
        ip_addresses: [],
        selected: "Select network"
    },
    
    methods: {
        scan_network: function() {
            this.is_scanning = true;
            axios.get("management/network")
                .then((res) => {
                    this.ip_addresses=res.data;
                    console.log(res);
                })
                .catch((err) => {
                    alert('Error during http call :', err)
                    console.warn('Error during http call :', err);
                })
                .finally(() => {
                   this.is_scanning = false;
                });
        }
    }
})