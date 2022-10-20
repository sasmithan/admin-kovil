<template>
  <Dropdown>
    <DropdownToggle class="mr-2  btn px-2 box hidden">
      <span class="w-5 h-5 flex items-center justify-center">
        <DownloadIcon class="lg:w-6 lg:h-6 w-4 h-4" />
      </span>
    </DropdownToggle>
    <DropdownMenu class="w-40">
      <DropdownContent>
        <DropdownItem @click="printExport">
          <PrinterIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" /> Print
        </DropdownItem>
        <DropdownItem @click="csvExport">
          <FileTextIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" /> Export to Excel
        </DropdownItem>
        <DropdownItem @click="pdfExport">
          <FileTextIcon class="lg:w-6 lg:h-6 w-4 h-4 mr-2" /> Export to PDF
        </DropdownItem>
      </DropdownContent>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
export default {
  props: {},
  name: "Export",
  methods: {
    printExport() {
      this.$emit("printExport");
    },
    csvExport() {
      this.$emit("csvExport");
    },
    pdfExport() {
      this.$emit("pdfExport");
    },
  },
};
</script>
