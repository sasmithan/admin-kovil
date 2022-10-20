<template>
  <Modal :show="modalStatus" @hidden="modalStatus = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <Trash2Icon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">Are you sure?</div>
        <div class="text-xl font-bold mt-5">{{ name }}</div>
        <div class="text-slate-500 mt-2">
          Do you really want to delete this records? <br />This process cannot
          be undone.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="modalClose()"
          class="btn btn-outline-secondary w-24 mr-1"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-danger w-24"
          @click="modalConfirm()"
        >
          Delete
        </button>
      </div>
    </ModalBody>
  </Modal>
</template>
<script>
export default {
  props: {
    name: "",
    modalStatus: false,
    modalConfirm: Function,
    modalClose: Function,
  },
  watch: {
    modalStatus(val) {
      val || this.modalClose();
    },
  },
  created() {},
  methods: {
    modalClose() {
      return this.modalClose();
    },
  },
};
</script>
