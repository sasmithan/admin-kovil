<template>
  <LoadingScreen :isLoading="isLoading" />
  <Modal
    :show="modalStatus"
    @hidden="modalStatus = false"
    backdrop="static"
    size="modal-sl-30"
  >
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">
        {{ formTitle }}
      </h2>
      <div class="p-2">
        <XCircleIcon
          class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 cursor-pointer"
          @click="modalClose()"
        />
      </div>
    </ModalHeader>

    <ModalBody class="">
      <div class="grid">
        <div class="w-full mb-2">
          <label for="regular-form-1" class="form-label"> Pooja Time</label>
          <div class="flex flex-col space-y-1 relative">
            <input
              v-model="formData.time"
              placeholder="12.00"
              id="vertical-form-1"
              type="text"
              class="form-control"
              name="poojaTime"
            />
            <button
              @click="setPm()"
              v-if="!timeStatus"
              class="absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer text-primary  "
            >
              {{ timeStatusName }}
            </button>
            <button
              @click="setAm()"
              v-if="timeStatus"
              class="absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer  text-primary"
            >
              {{ timeStatusName }}
            </button>
          </div>

          <!-- <Datepicker timePicker :is24="false" v-model="poojaTime" placeholder="Pooja Time" /> -->
        </div>
        <div class="w-full mb-2">
          <label for="regular-form-1" class="form-label">Name</label>
          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formData.name"
              type="text"
              class="form-control"
              name="name"
              placeholder="Name"
            />
          </div>
        </div>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        @click="modalClose()"
        class="btn btn-outline-secondary w-24 mr-1"
      >
        {{ const_txt.CANCEL_BTN }}
      </button>
      <button
        v-if="!titleChange"
        @click="saveForm()"
        type="submit"
        class="btn btn-primary w-24"
      >
        {{ const_txt.SAVE_BTN }}

        <SaveIcon
          v-if="!saving"
          icon="oval"
          color="white"
          class="w-4 h-4 ml-2"
        />
        <LoadingIcon
          v-if="saving"
          icon="oval"
          color="white"
          class="w-4 h-4 ml-2"
        />
      </button>
      <button
        v-if="titleChange"
        @click="updateForm()"
        type="submit"
        class="btn btn-primary w-24"
      >
        {{ const_txt.UPDATE_BTN }}
        <UploadCloudIcon
          v-if="!updating"
          icon="oval"
          color="white"
          class="w-4 h-4 ml-2"
        />
        <LoadingIcon
          v-if="updating"
          icon="oval"
          color="white"
          class="w-4 h-4 ml-2"
        />
      </button>
    </ModalFooter>
  </Modal>
</template>

<script>
import { const_txt } from "@/global-functions/const";
import axios from "@/services/http-common";
import moment from "moment";

import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "@/global-functions/functions";

export default {
  props: {
    modalStatus: false,
    titleChange: false,
    formData: {},
    isLoading: false,
  },
  data: () => ({
    const_txt: const_txt,
    poojaTime: "",
    saving: false,
    updating: false,
    timeStatusName: " AM",
    timeStatus: false,
  }),
  watch: {
    modalStatus(val) {
      val || this.modalClose();
    },
  },
  computed: {
    formTitle() {
      return this.titleChange === false ? "Add Pooja Time" : "Edit Pooja Time";
    },
  },

  created() {},
  mounted() {},
  methods: {
    setAm() {
      this.formData.time = this.formData.time.replaceAll("PM","");
      this.formData.time = this.formData.time.replaceAll("AM","");
      this.formData.time = this.formData.time.replaceAll(" ","");
      
      this.timeStatusName = " AM";
      this.formData.time = this.formData.time + this.timeStatusName;

      this.timeStatus = false;
    },
    setPm() {
      this.formData.time = this.formData.time.replaceAll("PM","");
      this.formData.time = this.formData.time.replaceAll("AM","");
      this.formData.time = this.formData.time.replaceAll(" ","");
      this.timeStatusName = " PM";
      this.formData.time = this.formData.time + this.timeStatusName;
      this.timeStatus = true;
    },
    momentTime(date) {
      return moment(date).format("hh:mm a");
    },

    async saveForm() {
      // this.formData.time = this.poojaTime.hours + ":" + this.poojaTime.minutes;
      // this.formData.time = this.formData.time + this.timeStatusName;
      console.log(this.formData.time);
      this.saving = true;
      await axios
        .post("PoojaTime/Create", this.formData)
        .then((response) => {
          if (response.data.success) {
            this.modalClose();
            this.getDataFromApi();
            successToast(response.data.message);
          } else {
            failedToast(response.data.message);
          }
          this.saving = false;
        })
        .catch((error) => {
          this.saving = false;
          warningToast(statusMessage(error.response.status));
        });
    },
    async updateForm() {
      // this.formData.time = this.poojaTime.hours + ":" + this.poojaTime.minutes;
      //  this.formData.time = this.formData.time + this.timeStatusName;
      var id = this.formData.poojaTimeId;
      this.updating = true;
      await axios
        .put("PoojaTime/edit/" + id, this.formData)
        .then((response) => {
          if (response.data.success) {
            this.modalClose();
            this.getDataFromApi();
            successToast(response.data.message);
          } else {
            failedToast(response.data.message);
          }
          this.updating = false;
        })
        .catch((error) => {
          this.updating = false;
          warningToast(statusMessage(error.response.status));
        });
    },

    modalClose() {
      this.$emit("modalClose", false);
    },
    getDataFromApi() {
      this.$emit("getData");
    },
  },
};
</script>
