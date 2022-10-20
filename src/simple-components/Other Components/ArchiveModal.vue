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
        Archives
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
          <label for="regular-form-1" class="form-label">God Name</label>
          <div class="flex flex-col space-y-1">
            <input
              id="vertical-form-1"
              v-model="formData.name"
              type="text"
              class="form-control"
              name="name"
              placeholder="God Name"
            />
          </div>
        </div>
        <div class="w-full mb-2">
          <label for="regular-form-1" class="form-label">Description</label>
          <div class="flex flex-col space-y-1">
            <textarea
              id="vertical-form-1"
              v-model="formData.description"
              type="text"
              class="form-control"
              name="description"
              placeholder="Description"
            ></textarea>
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
export default {
  props: { data: [] },
  name: "ArchiveModal",
  data: () => ({}),
  methods: {
    restoreItem() {
      this.$emit("restoreItem");
    },
    deleteItem() {
      this.$emit("deleteItem");
    },
  },
};
</script>
