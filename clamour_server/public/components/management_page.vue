<template>
  <div class="dashboard">
    <div class="top">
      <div class="nav">
        <div class="nav__selected">
          <span class="nav__selected__title">Selected device</span>
          <span class="nav__selected__id">{{selected_device.tag.tag_id}}</span>
        </div>

        <div class="nav__functions">
          <button class="nav__link" @click="scan_network">Scan network</button>
          <button class="nav__link" @click="start_localization">Activate device</button>
          <button
            class="nav__link"
            @click="stop_download_localization"
          >Stop and download</button>
          <button class="nav__link" @click="advanced">{{mode_toggle_button}}</button>
        </div>
      </div>

      <div class="titles">
        <table class="titles__table">
          <tbody>
            <tr>
              <td>ID</td>
              <td>IP</td>
              <td>
                <div class="titles__status">
                  <span>Status</span>
                  <img src="/images/status.svg" alt="Status" />
                </div>
              </td>
              <td>
                <div class="titles__detection">
                  <span>Detection</span>
                  <img src="/images/detection.svg" alt="Detection" />
                </div>
              </td>
              <td v-if="is_advanced_mode" class="titles__table__last">
                <div class="titles__table__advanced">
                  <button @click="addDevice" class="titles__advanced">
                    <span>Add new device</span>
                    <img src="/images/add.svg" alt="Add" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="devices">
      <table class="devices__table">
        <tbody>
          <tr v-for="(known_device, index) in known_device_list" :key="index">
            <td>
              <button
                :disabled="!known_device.detected"
                @click="select_device(known_device)"
              >{{known_device.tag.tag_id}}</button>
            </td>

            <td>{{known_device.tag.ip_address}}</td>

            <td>
              <button
                :disabled="!known_device.detected"
                @click="check_status(known_device)"
              >{{known_device.tag.script_status}}</button>
            </td>

            <td>
              <button
                @click="ping_ip_address(known_device)"
              >{{known_device.detected}}</button>
            </td>

            <td v-if="is_advanced_mode" class="devices__table__last">
              <div class="devices__table__advanced">
                <button
                  class="devices__advanced"
                  @click="updateDevice(known_device)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20.003"
                    height="20"
                    viewBox="0 0 20.003 20"
                    class="devices__advanced__active"
                  >
                    <g id="edit" transform="translate(-39.588 -35.946)">
                      <path
                        id="Path_344"
                        data-name="Path 344"
                        d="M58.275,45.03v6.678a4.646,4.646,0,0,1-.033.606l.023-.175a3.777,3.777,0,0,1-.122.558c-.027.09-.059.179-.092.266-.061.157.052-.117.006-.014-.021.047-.043.094-.066.14a3.6,3.6,0,0,1-.284.476c-.023.034-.048.066-.073.1.14-.186.022-.03-.012.011-.066.078-.135.153-.207.226s-.133.127-.2.187c-.031.027-.063.053-.094.078q-.078.062.061-.046l-.074.055a3.6,3.6,0,0,1-.473.288l-.111.054-.057.026c-.113.051.157-.065.043-.018-.087.035-.176.066-.265.095a3.576,3.576,0,0,1-.588.131l.175-.023a7.007,7.007,0,0,1-.914.033h-10.8a5.786,5.786,0,0,1-.757-.033l.175.023a3.777,3.777,0,0,1-.558-.122c-.09-.027-.179-.059-.266-.092-.157-.061.117.052.014.006-.047-.021-.094-.043-.14-.066a3.59,3.59,0,0,1-.476-.284c-.034-.023-.066-.048-.1-.073.186.14.03.022-.011-.012-.078-.066-.153-.135-.226-.207s-.127-.133-.187-.2c-.027-.031-.053-.063-.078-.094q-.062-.078.046.061l-.055-.074a3.6,3.6,0,0,1-.288-.473c-.019-.037-.037-.074-.054-.111l-.026-.057c-.051-.113.065.157.018.043-.035-.087-.066-.176-.095-.265a3.576,3.576,0,0,1-.131-.588l.023.175a7.006,7.006,0,0,1-.033-.914V40.6a5.786,5.786,0,0,1,.033-.757l-.023.175a3.777,3.777,0,0,1,.122-.558c.027-.09.059-.179.092-.266.061-.157-.052.117-.006.014.021-.047.043-.094.066-.14a3.594,3.594,0,0,1,.284-.476c.023-.034.048-.066.073-.1-.14.186-.022.03.012-.011.066-.078.135-.153.207-.226s.133-.127.2-.187c.031-.027.063-.053.094-.078q.078-.062-.061.046l.074-.055a3.6,3.6,0,0,1,.473-.288l.111-.054.057-.026c.113-.051-.157.065-.043.018.087-.035.176-.066.265-.095a3.576,3.576,0,0,1,.588-.131l-.175.023a9.012,9.012,0,0,1,1.167-.033h6.116a.658.658,0,1,0,0-1.316H43.963a4.412,4.412,0,0,0-2.369.644,4.259,4.259,0,0,0-1.924,2.817,6.611,6.611,0,0,0-.076,1.169v9.81A7.339,7.339,0,0,0,39.9,53.4a4.229,4.229,0,0,0,2.545,2.44,4.656,4.656,0,0,0,1.617.237H55.014a5.909,5.909,0,0,0,1.3-.113,4.27,4.27,0,0,0,2.724-2.045,4.5,4.5,0,0,0,.55-2.254V45.03a.658.658,0,0,0-1.316,0Z"
                        transform="translate(0 -0.131)"
                      />
                      <path
                        id="Path_345"
                        data-name="Path 345"
                        d="M365.317,38.946l-1.448,1.448-3.1,3.1-2.9,2.9-.922.922.465-.193-2.7.165.658.658.121-2.743-.193.465,1.448-1.448,3.1-3.1,2.9-2.9.709-.709.175-.175.035-.035c.018-.018.036-.034.055-.05-.156.137-.021.023.036-.005-.2.1-.011.013.06,0l-.175.023a.892.892,0,0,1,.191,0l-.175-.023a.909.909,0,0,1,.156.035q.095.036-.068-.029a.721.721,0,0,1,.084.05c-.164-.107-.061-.048-.019-.006l.15.15.6.6.6.6.158.158c.021.021.041.042.06.064q-.1-.136-.045-.053c.027.041.074.154-.008-.041a.736.736,0,0,1,.046.186l-.024-.175a.892.892,0,0,1,0,.191l.023-.175c-.01.064-.089.266,0,.06a.77.77,0,0,1-.048.087q-.057.083.043-.051-.022.026-.047.051a.658.658,0,0,0,.93.93,1.429,1.429,0,0,0,0-2.005l-.563-.563-.76-.76-.186-.186a1.462,1.462,0,0,0-.937-.412,1.653,1.653,0,0,0-1.3.66l-.919.919-3.008,3.008-3.017,3.017-.931.931-.219.219-.035.035a.77.77,0,0,0-.2.546l-.117,2.663a.659.659,0,0,0,.658.658l1.662-.1.905-.055a.99.99,0,0,0,.462-.1.711.711,0,0,0,.158-.128l1.745-1.745,3.177-3.177,2.749-2.749.677-.677a.658.658,0,0,0-.931-.931Z"
                        transform="translate(-307.075)"
                      />
                    </g>
                  </svg>
                </button>

                <button
                  class="devices__advanced"
                  @click="deleteDevice(known_device)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19.563"
                    height="20"
                    viewBox="0 0 19.563 20"
                    class="devices__advanced__active"
                  >
                    <g id="delete" transform="translate(-36.677 -25.998)">
                      <path
                        id="Path_346"
                        data-name="Path 346"
                        d="M132.846,188.01H122.654c-.44,0-.883,0-1.323,0A2.244,2.244,0,0,1,121.1,188l.165.023a1.809,1.809,0,0,1-.426-.113l.148.062a1.907,1.907,0,0,1-.286-.152c-.023-.014-.043-.031-.066-.045-.088-.062.121.1.041.031-.041-.035-.08-.07-.119-.109s-.072-.078-.109-.119c-.066-.076.091.128.031.041-.014-.023-.031-.043-.045-.066a1.905,1.905,0,0,1-.152-.286l.062.148a1.808,1.808,0,0,1-.113-.426c.008.056.014.109.023.165a4.521,4.521,0,0,1-.014-.553V173.454c0-.185,0-.37,0-.555v-.025l-.617.617h14.33c.193,0,.389,0,.584,0h.025l-.617-.617v14.036a1.858,1.858,0,0,1-.014.239c.008-.056.014-.109.023-.165a1.809,1.809,0,0,1-.113.426l.062-.148a1.907,1.907,0,0,1-.152.286c-.014.023-.031.043-.045.066-.062.088.1-.121.031-.041-.035.041-.07.08-.109.119s-.078.072-.119.109c-.076.066.128-.091.041-.031-.023.014-.043.031-.066.045a1.906,1.906,0,0,1-.286.152l.148-.062a1.809,1.809,0,0,1-.426.113l.165-.023a1.755,1.755,0,0,1-.23.014.617.617,0,1,0,0,1.234,2.325,2.325,0,0,0,2.327-2.327c0-.167,0-.335,0-.5V173.559c0-.218,0-.438,0-.656v-.029a.626.626,0,0,0-.617-.617h-14.33c-.2,0-.389,0-.584,0h-.025a.626.626,0,0,0-.617.617v13.894a2.6,2.6,0,0,0,.3,1.288,2.36,2.36,0,0,0,2.062,1.191h11.491a.624.624,0,0,0,.617-.617A.632.632,0,0,0,132.846,188.01Z"
                        transform="translate(-80.63 -143.249)"
                      />
                      <path
                        id="Path_347"
                        data-name="Path 347"
                        d="M310.206,26h-4.738a1.889,1.889,0,0,0-1.955,1.893c0,.56,0,1.119,0,1.679v.056a.626.626,0,0,0,.617.617h6.44c.3,0,.595.006.891,0h.012a.626.626,0,0,0,.617-.617V27.9a1.941,1.941,0,0,0-.455-1.236,1.875,1.875,0,0,0-1.43-.662.617.617,0,0,0,0,1.234,1.515,1.515,0,0,1,.169.01l-.165-.023a1.316,1.316,0,0,1,.317.086l-.148-.062a1.452,1.452,0,0,1,.2.107.654.654,0,0,1,.056.037s-.126-.1-.062-.047c.031.027.06.051.088.08s.049.051.072.078.045.095-.039-.051c.008.014.021.029.031.043a1.179,1.179,0,0,1,.113.214l-.062-.148a1.418,1.418,0,0,1,.086.317c-.008-.056-.014-.109-.023-.165a5.93,5.93,0,0,1,.01.689v1.222l.617-.617h-6.44c-.3,0-.595-.008-.891,0h-.012l.617.617V28.037a2.9,2.9,0,0,1,.01-.327c-.008.056-.014.109-.023.165a1.315,1.315,0,0,1,.086-.317l-.062.148a1.453,1.453,0,0,1,.107-.2.644.644,0,0,1,.037-.056s-.1.126-.047.062c.027-.031.051-.06.08-.088s.051-.049.078-.072.095-.045-.051.039c.014-.008.029-.021.043-.031a1.182,1.182,0,0,1,.214-.113l-.148.062a1.418,1.418,0,0,1,.317-.086l-.165.023a4.707,4.707,0,0,1,.59-.01H310.2a.624.624,0,0,0,.617-.617A.616.616,0,0,0,310.206,26Z"
                        transform="translate(-261.345)"
                      />
                      <path
                        id="Path_348"
                        data-name="Path 348"
                        d="M55.621,172.156H38.037c-.237,0-.473,0-.712,0h-.031a.617.617,0,0,0,0,1.234H54.879c.237,0,.473,0,.712,0h.031a.617.617,0,1,0,0-1.234Z"
                        transform="translate(0 -143.151)"
                      />
                      <path
                        id="Path_349"
                        data-name="Path 349"
                        d="M355.46,341.868V333.83c0-.372.008-.747,0-1.119v-.016a.617.617,0,0,0-1.234,0v8.038c0,.372-.008.747,0,1.119v.016a.617.617,0,0,0,1.234,0Z"
                        transform="translate(-311.013 -299.781)"
                      />
                      <path
                        id="Path_350"
                        data-name="Path 350"
                        d="M610.66,341.868V333.83c0-.372.008-.747,0-1.119v-.016a.617.617,0,0,0-1.234,0v8.038c0,.372-.008.747,0,1.119v.016a.617.617,0,0,0,1.234,0Z"
                        transform="translate(-560.962 -299.781)"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="console">
      <p>{{log_message_1}}</p>
      <p>{{log_message_2}}</p>
      <p>{{log_message_3}}</p>
      <p>{{log_message_4}}</p>
      <p>{{log_message_5}}</p>
    </div>

    <div v-if="modal === 'advanced'" class="modal">
      <div class="modal__content">
        <h3 class="modal__title">Advanced Access</h3>
        <div class="modal__row">
          <div class="modal__column__full">
            <label for="password">Password</label>
            <input name="password" type="text" v-model="password" />
          </div>
        </div>
        <button class="modal__button" @click="access">Access</button>
        <button class="modal__button" @click="closeModal">Cancel</button>
      </div>
    </div>

    <div v-if="modal === 'add'" class="modal">
      <div class="modal__content">
        <h3 class="modal__title">Add new device</h3>
        <div class="modal__row">
          <div class="modal__column">
            <label for="id">ID</label>
            <input name="id" type="text" v-model="tag_id_to_add" />
          </div>
          <div class="modal__column">
            <label for="id">IP</label>
            <input name="ip" type="text" v-model="ip_address_to_add" />
          </div>
        </div>
        <button class="modal__button" @click="add_device">Add</button>
        <button class="modal__button" @click="closeModal">Cancel</button>
      </div>
    </div>

    <div v-if="modal === 'update'" class="modal">
      <div class="modal__content">
        <h3 class="modal__title">Update device <span>{{ tag_id_to_update }}</span></h3>
        <div class="modal__row">
          <div class="modal__column">
            <label for="id">New ID</label>
            <input name="id" type="text" v-model="new_tag_id" />
          </div>
          <div class="modal__column">
            <label for="id">New IP</label>
            <input name="ip" type="text" v-model="new_ip_address" />
          </div>
        </div>
        <button class="modal__button" @click="update_device">Update</button>
        <button class="modal__button" @click="closeModal">Cancel</button>
      </div>
    </div>

    <div v-if="modal === 'delete'" class="modal">
      <div class="modal__content">
        <h3 class="modal__title">Delete device <span>{{ tag_id_to_delete }}</span></h3>
        <button class="modal__button" @click="delete_device">Delete</button>
        <button class="modal__button" @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
var axios = require("axios/dist/axios.min.js");

module.exports = {
  components: {
  },

  data() {
    return {
      advancedPass: '...',
      password: null,
      modal: null,
      modalDevice: null,
      is_advanced_mode: false,
      log_message_1:
        "Ready to offer an unforgettable auditory experience in the Chambord Castle",
      log_message_2: ".",
      log_message_3: ".",
      log_message_4: ".",
      log_message_5: ".",

      known_device_list: [
        {
          tag: {
            tag_id: Number,
            ip_address: String,
            script_status: String
          },
          detected: false
        }
      ],
      detected_device_list: [
        {
          tag_id: Number,
          ip_address: String,
          script_status: String
        }
      ],
      selected_device: {
        tag: {
          tag_id: undefined,
          ip_address: undefined,
          script_status: undefined
        },
        detected: false
      },
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
    toggle_mode: function() {
      this.is_advanced_mode = !this.is_advanced_mode;
    },
    get_list_id: function(tag_list) {
      if (tag_list.length === 0) return "None";
      var id_list = [];
      for (index in tag_list) {
        id_list.push(tag_list[index].tag_id);
      }
      return id_list;
    },

    log_message: function(newMessage) {
      this.log_message_5 = this.log_message_4;
      this.log_message_4 = this.log_message_3;
      this.log_message_3 = this.log_message_2;
      this.log_message_2 = this.log_message_1;
      this.log_message_1 = newMessage;
    },

    select_device: function(selected_device) {
      this.selected_device.tag.tag_id == selected_device.tag.tag_id
        ? (this.selected_device = {
            tag: {
              tag_id: undefined,
              ip_address: undefined,
              script_status: undefined
            },
            detected: false
          })
        : (this.selected_device = selected_device);
    },

    unselect_device: function(selected_device) {
      this.selected_device = {
        tag: {
          tag_id: undefined,
          ip_address: undefined,
          script_status: undefined
        },
        detected: false
      };
    },

    ping_ip_address: async function(selected_device) {
      try {
        // Sending request and parsing response
        this.log_message(
          `Attempting to detect tag ${selected_device.tag.tag_id}, waiting for answer...`
        );
        var response = await axios.get(
          `ping/ip_address/${selected_device.tag.ip_address}`
        );

        // Error handling
        if (response.data.error) {
          this.log_message(
            `The detection failed for tag ${selected_device.tag.tag_id} : ${response.data.error}`
          );
          return;
        }
        var is_detected = response.data.detected;
        var tag = response.data.tag;

        // Displaying result
        var detetection_result = is_detected ? "detected" : "not detected";
        this.log_message(
          `Detection result for tag ${selected_device.tag.tag_id}: ${detetection_result}`
        );

        // Updating the board
        for (i in this.known_device_list) {
          if (
            this.known_device_list[i].tag.tag_id === selected_device.tag.tag_id
          ) {
            this.known_device_list[i].tag = tag;
            this.known_device_list[i].detected = is_detected;
          }
        }
      } catch (err) {
        // Error handling
        alert(
          `An error occured while trying to detect device ${selected_device.tag_id}\n`,
          err
        );
        this.log_message(
          `Device detection failed on tag ${selected_device.tag_id}`
        );
        console.warn(`Error during http call :\n`, err);
      }
    },

    check_status: async function(specified_device) {
      try {
        // Sending request and parsing response
        this.log_message(
          `Checking the status of tag ${specified_device.tag.tag_id}, waiting for answer...`
        );
        var response = await axios.get(
          `check_script_status/ip_address/${specified_device.tag.ip_address}`
        );
        var isActivated = response.data.status.isActivated;

        // Displaying result
        var status = isActivated == "ON" ? "ON" : "OFF";
        this.log_message(
          `Status found on the tag ${specified_device.tag.tag_id} : ${status}`
        );

        // Updating the board
        for (i in this.known_device_list) {
          if (
            this.known_device_list[i].tag.tag_id === specified_device.tag.tag_id
          )
            this.known_device_list[i].tag.script_status = status;
        }
      } catch (err) {
        // Error handling
        alert(
          `An error occured while trying to check the status of tag ${specified_device.tag_id}\n`,
          err
        );
        this.log_message(
          `Status check up failed on tag ${specified_device.tag_id}`
        );
        console.warn(`Error during http call :\n`, err);
      }
    },

    scan_network: async function() {
      try {
        // Sending request and parsing response
        this.log_message(`Network scan in progress, waiting for answer...`);
        var response = await axios.get("scan_network");
        this.detected_device_list = response.data.detected_tag_list;
        var detected_id = this.get_list_id(this.detected_device_list);

        // Displaying result
        this.log_message(
          `Network scan finished, detected device(s) : ${detected_id}`
        );

        // Updating board
        this.unselect_device();
        for (i in this.known_device_list) {
          this.known_device_list[i].detected = false;
          for (j in this.detected_device_list) {
            if (
              this.known_device_list[i].tag.ip_address ===
              this.detected_device_list[j].ip_address
            ) {
              this.known_device_list[i].tag = this.detected_device_list[j];
              this.known_device_list[i].detected = true;
            }
          }
        }
      } catch (err) {
        // Error handling
        alert(`An error occured while trying to scan the network\n`, err);
        this.log_message(`Network scan failed, no answer from the server`);
        console.warn(`Error during http call :\n`, err);
      }
    },

    start_localization: async function() {
      try {
        // Assuring that a tag is selected
        if (!this.selected_device.tag.tag_id) {
          alert(`No tag was selected`);
          return;
        }

        // Sending request and parsing response
        this.log_message(
          `Starting the localization on device ${this.selected_device.tag.tag_id}...`
        );
        var response = await axios.get(
          `start_script/ip_address/${this.selected_device.tag.ip_address}/mode/visit`
        );
        var change = response.data.change;
        var tag = response.data.tag;

        // Displaying result
        if (change === "TURNED ON")
          this.log_message(`Localization started on tag ${tag.tag_id}`);
        else if (change === "ALREADY TURNED ON")
          this.log_message(`Localization already running on tag ${tag.tag_id}`);

        // Updating the board
        for (i in this.known_device_list) {
          if (
            this.known_device_list[i].tag.tag_id ===
            this.selected_device.tag.tag_id
          )
            this.known_device_list[i].tag = tag;
        }
      } catch (err) {
        // Error handling
        alert(
          `An error occured while trying to activate the localization\n`,
          err
        );
        this.log_message(
          `Localization activation failed on tag ${this.selected_device.tag.tag_id}`
        );
        console.warn(`Error during http call :\n`, err);
      }
    },

    stop_download_localization: async function() {
      try {
        // Assuring that a tag is selected
        if (!this.selected_device.tag.tag_id) {
          alert(`No tag was selected`);
          return;
        }

        // Sending request and parsing response
        this.log_message(
          `Stoping the localization on device ${this.selected_device.tag.tag_id}...`
        );
        var response = await axios.get(
          `stop_download/ip_address/${this.selected_device.tag.ip_address}`
        );
        var tag = response.data.tag;
        var downloaded_files = response.data.downloaded_files;

        // Displaying result
        this.log_message(
          `Device stoped and files retreived : ${downloaded_files}`
        );

        // Updating the board
        for (i in this.known_device_list) {
          if (
            this.known_device_list[i].tag.tag_id ===
            this.selected_device.tag.tag_id
          )
            this.known_device_list[i].tag = tag;
        }
      } catch (err) {
        // Error handling
        alert(
          `An error occured while trying to stop the localization and load files\n`,
          err
        );
        this.log_message(
          `Localization deactivation failed on tag ${this.selected_device.tag.tag_id}`
        );
        console.warn(`Error during http call :\n`, err);
      }
    },

    populate_board: async function() {
      // Populating the page
      try {
        while (this.known_device_list.length)
          await this.known_device_list.pop();
        var response = await axios.get("../tags");
        for (var index in response.data) {
          this.known_device_list.push({
            tag: response.data[index],
            detected: false
          });
        }
      } catch (err) {
        // Error handling
        alert(`An error occured while trying to get the list of tags\n`, err);
        this.log_message(`There is a problem with the server`);
        console.warn(`Error during http call :\n`, err);
      }
    },

    reset_add_input: function() {
      this.tag_id_to_add = undefined;
      this.ip_address_to_add = undefined;
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
        this.log_message(`Adding a device to the list of known devices ...`);
        var response = await axios.post("../tags", {
          data: {
            tag_id: this.tag_id_to_add,
            ip_address: this.ip_address_to_add
          }
        });
        // Parsing the response to know if the query was successful or failed
        if (response.data.code)
          this.log_message(
            `Server couldn't add the device : ${response.data.sqlMessage}`
          );
        else {
          this.log_message(
            `Tag ${this.tag_id_to_add} (IP: ${this.ip_address_to_add}) added`
          );
          this.modal = null;
          this.reset_add_input();
          await this.populate_board();
        }
      } catch (err) {
        // Error handling
        alert(`An error occured while trying to add a device\n`, err);
        this.log_message(`Device addition failed`);
        console.warn(`Error during http call :\n`, err);
      }
    },

    update_device: async function() {
      try {
        // Adjusting the sent data according to the selected parameter
        var request_content;
        if (this.new_tag_id && this.new_ip_address) {
          request_content = {
            data: { tag_id: this.new_tag_id, ip_address: this.new_ip_address }
          };
        } else if (this.new_tag_id) {
          request_content = { data: { tag_id: this.new_tag_id } };
        } else if (this.new_ip_address) {
          request_content = { data: { ip_address: this.new_ip_address } };
        }

        // Sending request and parsing response
        this.log_message(`Adding a device to the list of known devices ...`);
        var response = await axios.put(
          `../tags/${this.tag_id_to_update}`,
          request_content
        );

        // Parsing the response to know if the query was successful or failed
        if (response.data.code) {
          this.log_message(
            `Server couldn't update the device : ${response.data.sqlMessage}`
          );
        } else if (response.data.affectedRows) {
          this.log_message(
            `Tag ${this.tag_id_to_update} : the parameter ${this.selected_parameter} was updated`
          );
          this.modal = null;
          this.reset_update_input();
          await this.populate_board();
        } else {
          this.log_message(`There was no tag with ID ${this.tag_id_to_update}`);
        }
      } catch (err) {
        // Error handling
        alert(`An error occured while trying to update a device\n`, err);
        this.log_message(`Device update failed`);
        console.warn(`Error during http call :\n`, err);
      }
    },

    delete_device: async function() {
      try {
        // Sending request and parsing response
        this.log_message(
          `Erasing the device identified by the ID ${this.tag_id_to_delete} ...`
        );
        var response = await axios.delete(`../tags/${this.tag_id_to_delete}`);

        // Parsing the response to know if the query was successful or failed
        if (response.data.code) {
          this.log_message(
            `Server couldn't delete the device : ${response.data.sqlMessage}`
          );
        } else if (response.data.affectedRows) {
          this.log_message(`Tag with ID ${this.tag_id_to_delete} deleted`);
          this.modal = null;
          this.reset_delete_input();
          await this.populate_board();
        } else {
          this.log_message(`There was no tag with ID ${this.tag_id_to_delete}`);
        }
      } catch (err) {
        // Error handling
        alert(`An error occured while trying to delete a device\n`, err);
        this.log_message(`Device deletion failed`);
        console.warn(`Error during http call :\n`, err);
      }
    },
    closeModal: function() {
      this.modal = null;
    },
    addDevice: function() {
      this.modal = "add";
    },
    updateDevice: function(device) {
      this.tag_id_to_update = device.tag.tag_id;
      this.modal = "update";
    },
    deleteDevice: function(device) {
      this.tag_id_to_delete = device.tag.tag_id;
      this.modal = "delete";
    },
    advanced: function() {
      if(this.is_advanced_mode) {
        this.toggle_mode();
      } else {
        this.modal = "advanced";
      }
    },
    access: function() {
      if(this.password == this.advancedPass) {
        this.toggle_mode();
        this.password = null;
        this.modal = null;
      } else {
        this.password = null;
        this.modal = null;
        this.log_message(
          `Wrong Password`
        );
      }
    }
  },

  created: async function() {
    try {
      // Erasing the templates
      this.known_device_list.pop();
      this.detected_device_list.pop();

      // Populating the page
      await this.populate_board();
    } catch (err) {
      alert(`An error occured while trying to fetch the lis of devices\n`, err);
      console.warn(`Error during http call :\n`, err);
    }
  },

  computed: {
    mode_toggle_button: function() {
      if (this.is_advanced_mode) return "Advanced settings ON";
      else return "Advanced settings OFF";
    }
  }
};
</script>

<style>
</style>
