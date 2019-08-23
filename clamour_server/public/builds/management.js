(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

var management = new Vue({ 
    el: '#vue-management',
    data: {
        known_device_list: ["a", "b"],
        detected_device_list: [],
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

// // Define a new component called button-counter
// var device = Vue.component('button-counter', {
//     data: function () {
//       return {
//         count: 0
//       }
//     },
//     template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
//   })

// new Vue({ el: '#components-demo' })
},{}]},{},[1]);
