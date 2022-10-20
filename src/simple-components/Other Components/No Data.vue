<template>
  <tr
    v-if="count == 0"
    class="mt-8 mb-5 rounded-lg shadow-xl p-10 font-semibold w-full text-center"
  >
    <td colspan="12">No Data</td>
  </tr>
</template>
<script>
export default {
  name: "NoData",
  props: {
    items: {},
  },
  computed: {
    count() {
      return this.items != null ? this.items.length : 0;
    },
  },
};
</script>
