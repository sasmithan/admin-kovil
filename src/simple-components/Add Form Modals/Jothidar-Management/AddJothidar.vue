<template>
  <LoadingScreen :isLoading="isLoading" />
  <Modal
    :show="modalStatus"
    @hidden="modalStatus = false"
    backdrop="static"
    size="modal-sl-50"
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
      <div class="grid grid-cols-3 lg:gap-4 md:gap-4 gap-2">
        <div class="w-full">
          <label for="regular-form-1" class="form-label">First Name</label>
          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formData.firstName"
              type="text"
              class="form-control"
              name="firstname"
              placeholder="First Name"
            />
          </div>
        </div>
        <div class="w-full">
          <label for="regular-form-1" class="form-label">Last Name</label>
          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formData.lastName"
              type="text"
              class="form-control"
              name="lastname"
              placeholder="Last Name"
            />
          </div>
        </div>
        <!-- <div class="w-full">
          <label for="regular-form-1" class="form-label">Fees</label>
          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formData.fees"
              @keypress="onlyNumber"
              type="text"
              class="form-control"
              name="fees"
              placeholder="Fees"
            />
          </div>
        </div> -->

        <div class="w-full">
          <label for="regular-form-1" class="form-label">Mobile</label>
          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formData.mobile"
              @keypress="onlyNumber"
              autocomplete="off"
              type="text"
              class="form-control"
              name="mobile"
              placeholder="Mobile"
            />
          </div>
        </div>
        <div class="w-full">
          <label for="regular-form-1" class="form-label">Telephone</label>
          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formData.telephone"
              @keypress="onlyNumber"
              autocomplete="off"
              type="text"
              class="form-control"
              name="telephone"
              placeholder="Telephone"
            />
          </div>
        </div>

        <!-- <div class="w-full">
          <label for="regular-form-1" class="form-label">Category</label>
          <v-select
            v-model="formData.jothidarCategoryId"
            placeholder="SELECT"
            class="style-chooser cursor-pointer"
            :options="jothidarCategories"
            :reduce="(name) => name.jothidarCategoryId"
            label="name"
          />
        </div> -->
        <div class="w-full">
          <label for="regular-form-1" class="form-label">Active Status</label>

          <div class="flex flex-col space-y-1">
            <div class="form-switch ml-3">
              <input
                type="checkbox"
                v-model="formData.status"
                class="form-check-input"
              />
            </div>
          </div>
        </div>
        <div class="relative col-span-3 pt-2">
          <h3 class="absolute -top-2.5 left-4 bg-white pt-2">
            Jothidar Address
          </h3>
          <div
            class="border rounded-md border-slate-200 border-solid p-4 h-full grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 lg:gap-4 md:gap-4 gap-2"
          >
            <div class="w-full col-span-3">
              <label for="regular-form-1" class="form-label">Address</label>
              <div class="flex flex-col space-y-1">
                <input
                  id="vertical-form-1"
                  v-model="formData.addressLine"
                  type="text"
                  class="form-control"
                  name="address"
                  placeholder="Address"
                />
              </div>
            </div>
            <div class="w-full">
              <label for="regular-form-1" class="form-label">City</label>
              <div class="flex flex-col space-y-1">
                <input
                  id="vertical-form-1"
                  v-model="formData.city"
                  type="text"
                  class="form-control"
                  name="city"
                  placeholder="City"
                />
              </div>
            </div>
            <div class="w-full">
              <label for="regular-form-1" class="form-label">State</label>
              <div class="flex flex-col space-y-1">
                <input
                  id="vertical-form-1"
                  v-model="formData.state"
                  type="text"
                  class="form-control"
                  name="state"
                  placeholder="State"
                />
              </div>
            </div>
            <div class="w-full">
              <label for="regular-form-1" class="form-label">Post Code</label>
              <div class="flex flex-col space-y-1">
                <input
                  id="vertical-form-1"
                  v-model="formData.postCode"
                  type="text"
                  class="form-control"
                  placeholder="Post Code"
                />
              </div>
            </div>
            <div class="w-full col-span-2">
              <label for="regular-form-1" class="form-label">Country</label>
              <v-select
                v-model="formData.country"
                placeholder="SELECT"
                class="style-chooser cursor-pointer"
                :options="countries"
                :reduce="(countryName) => countryName.countryName"
                label="countryName"
              />
            </div>
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
import countryJson from "@/assets/json/countryAllData.json";
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
    saving: false,
    updating: false,
    countries: countryJson,
  }),
  watch: {
    modalStatus(val) {
      val || this.modalClose();
    },
  },
  computed: {
    formTitle() {
      return this.titleChange === false ? "Add Jothidar" : "Edit Jothidar";
    },
  },

  created() {
    //this.getJothidarCategory();
  },
  mounted() {},
  methods: {
    getJothidarCategory() {
      axios
        .get("JothidarCategory/findAll")
        .then((response) => {
          if (response.data.success) {
            this.jothidarCategories = response.data.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async saveForm() {
      console.log(this.formData);
      this.saving = true;
      await axios
        .post("Jothidar/Create", this.formData)
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
      var id = this.formData.jothidarId;
      this.updating = true;
      await axios
        .put("Jothidar/Edit/" + id, this.formData)
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
    onlyNumber($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        // 46 is dot
        $event.preventDefault();
      }
    },
  },
};
</script>
