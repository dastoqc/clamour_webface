
var network = new Vue({
    el:'#vue-network',
    data: {
        ip_addresses: [],
        device_list: [{
            id: Number,
            ip_address: String,
            running_status: String,
            network_status: String
        }],
        selected: "Select network",
        variable: {id: 1234, ip_address: "123.456.789.101", running_status: "OFF", network_status: "OUT"}
    },
    
    methods: {
        scan_network: function() {
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
                });
        },

        start_devices: function() {

        },

        stop_download_devices: function() {
            
        }
    }
})