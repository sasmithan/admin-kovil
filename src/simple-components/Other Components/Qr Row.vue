<template>
  <qrcode-vue
    @click="showQrModal(item)"
    render-as="svg"
    :value="JSON.stringify(item)"
    size="30"
    level="H"
  />
</template>
<script>
export default {
  name: "QrRow",
  props: { item: {}, showQrModal: Function },
  created() {
    console.log("ds", this.item);
  },
};
</script>
