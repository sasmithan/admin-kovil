<template>
  <Modal size="modal-sm" :show="qrModal" @hidden="qrModal = false">
    <ModalBody
      class="flex flex-col justify-center items-center space-y-2 w-full"
    >
      <div class="w-full">
        <qrcode-vue
          v-if="formData.productId"
          render-as="svg"
          :value="JSON.stringify(formData)"
          size="250"
          level="H"
        />
      </div>

      <div>
        <span
          class="lg:text-lg md:text-base text-base text-black-900 font-medium leading-none"
          >{{ formData }}</span
        >
      </div>
    </ModalBody>
  </Modal>
</template>
<script>
export default {
  name: "QrLarge",
  props: { qrModal: false, formData:{} },
};
</script>
