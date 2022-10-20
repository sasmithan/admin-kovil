<template>
  <div
    class="mt-1 mr-2 flex justify-center items-center whitespace-nowrap space-x-2 bg-transparent rounded-md"
  >
    <Tippy
      tag="a"
      href="javascript:;"
      class="tooltip"
      content="Upload order as a CSV file"
      :options="{
        zIndex: 99999,
      }"
    >
      <a
        href="javascript:;"
        @click="chooseFiles()"
        class="btn btn-primary shadow-md text-xs"
        >Upload File
        <UploadIcon class="lg:w-6 lg:h-6 w-4 h-4 ml-2 mr-2" />

        <input
          id="fileInput"
          accept=".csv"
          type="file"
          ref="fileInput"
          @change="onFilePicked"
          hidden
        />
      </a>
    </Tippy>

    <Tippy
      tag="a"
      href="javascript:;"
      class="tooltip"
      content="Download CSV template"
      :options="{
        zIndex: 99999,
      }"
    >
      <a
        href="javascript:;"
        @click="downloadTemplate()"
        class="btn btn-primary shadow-md text-xs lg:text-sm"
      >
        <svg
          @click="downloadTemplate()"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="lg:w-6 lg:h-6 w-4 h-4 text-white"
          viewBox="0 0 24 24"
        >
          <path
            d="M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87 2.34-3.8H7.46l-1.3 2.4-.05.08-.04.09-.64-1.28-.66-1.29H2.59l2.27 3.82-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3Z"
          />
        </svg>
      </a>
    </Tippy>

    <!-- <Tippy
        tag="a"
        href="javascript:;"
        class="tooltip"
        content="Download Template"
        :options="{
          zIndex: 99999,
        }"
      >
        <SheetIcon
          class="lg:w-6 lg:h-6 w-4 h-4 mr-2 "
          @click="downloadTemplate()"
        />
  
        <svg
          @click="downloadTemplate()"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="w-7 text-success mr-2"
          viewBox="0 0 24 24"
        >
          <path
            d="M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87 2.34-3.8H7.46l-1.3 2.4-.05.08-.04.09-.64-1.28-.66-1.29H2.59l2.27 3.82-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3Z"
          />
        </svg>
      </Tippy> -->
  </div>
</template>
<script>
export default {
  props: { buttonName: "" },
  name: "UploadFile",
  methods: {
    chooseFiles() {
      const fileInput = document.getElementById("fileInput");
      fileInput.value = "";
      this.$refs.fileInput.click();
    },
    onFilePicked() {
      const fileInput = document.getElementById("fileInput").files[0];
      if (fileInput) {
        console.log(document.getElementById("fileInput").files[0]);
        this.$emit("onFilePicked", fileInput);
      }
    },
    downloadTemplate() {
      this.$emit("downloadTemplate");
    },
  },
};
</script>
