<template>
  <Modal :show="modalStatus" @hidden="modalStatus = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <RotateCcwIcon class="w-16 h-16 text-green-600 mx-auto mt-3" />
        <div class="text-3xl mt-5">Are you sure?</div>
        <div class="text-xl font-bold mt-5">{{ name }}</div>
        
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
          class="btn text-white bg-green-600 w-24"
          @click="modalConfirm()"
        >
          Restore
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
