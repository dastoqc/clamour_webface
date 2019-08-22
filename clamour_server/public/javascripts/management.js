
var network = new Vue({
    el: '#vue-network',
    data: {
        detected_device_list: [],
        known_device_list: [],
        selected: "192.168.4.200",
        variable: { id: 1234, ip_address: "123.456.789.101", running_status: "OFF", network_status: "OUT" }
    },

    methods: {
        scan_network: async function () {
            try {
                var response = await axios.get("scan_network");
                this.detected_device_list = response.data;
            } catch (err) {
                alert(`An error occured while trying to scan the network\n`, err);
                console.warn(`Error during http call :\n`, err);
            }
        },

        start_devices: async function () {
            try {
                var response = await axios.get(`start_script/ip_address/${this.selected}/mode/visit`)
                console.log(response);
                //this.detected_device_list = response.data;
                
            } catch (err) {
                alert(`An error occured while trying to start the localization on tag\n`, err);
                console.log(`Error during http call :\n`, err);
            }
        },

        stop_download_devices: async function () {
            try {
                var response = await axios.get(`stop_download/ip_address/${this.selected}`)
                console.log(response);    
            } catch (err) {
                alert(`An error occured while trying to stop the localization on tag ${this.selected}\n`, err);
                console.log(`Error during http call :\n`, err);
            }
        }
    }
})