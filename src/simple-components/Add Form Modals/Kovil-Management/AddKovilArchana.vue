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
          <label for="regular-form-1" class="form-label">Archana</label>
          <v-select
            v-model="formData.archanaTypeId"
            placeholder="SELECT"
            class="style-chooser cursor-pointer"
            :options="archanaTypes"
            :reduce="(name) => name.archanaTypeId"
            label="name"
          />
        </div>
        <div class="w-full mb-2">
          <label for="regular-form-1" class="form-label">Cost</label>
          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formData.cost"
              type="number"
              class="form-control"
              name="cost"
              placeholder="Cost"
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
      <SaveBtn
        @parentMethod="saveForm($event)"
        :active="!titleChange"
        :buttonName="const_txt.SAVE_BTN"
        :status="saving"
      />
      <UpdateBtn
        @parentMethod="updateForm($event)"
        :active="titleChange"
        :buttonName="const_txt.UPDATE_BTN"
        :status="updating"
      />
    </ModalFooter>
  </Modal>
</template>

<script>
import { const_txt } from "@/global-functions/const";
import axios from "@/services/http-common";
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
    kovilId: "",
  },
  data: () => ({
    const_txt: const_txt,
    saving: false,
    updating: false,
  }),
  watch: {
    modalStatus(val) {
      val || this.modalClose();
    },
  },
  computed: {
    formTitle() {
      return this.titleChange === false
        ? "Add Kovil Archana"
        : "Edit Kovil Archana";
    },
  },

  created() {
    this.getArchanaTypes();
  },
  mounted() {},
  methods: {
    getArchanaTypes() {
      axios
        .post("ArchanaType/findAll")
        .then((response) => {
          if (response.data.success) {
            this.archanaTypes = response.data.data;
          } else {
            warningToast(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async saveForm() {
      this.formData.kovilId = this.kovilId;
      this.saving = true;
      await axios
        .post("KovilArchnaType/Create", this.formData)
        .then((response) => {
          console.log("KovilArchnaType/Create", response);
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
      var id = this.formData.kovilArchanaTypeId;

      this.updating = true;
      await axios

        .put("KovilArchnaType/edit/" + id, this.formData)
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
      this.$emit("refreshData");
    },
  },
};
</script>
