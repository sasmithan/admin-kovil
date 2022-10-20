<template>
  <!-- BEGIN: Footer-->
  <div
    style="background-color: #e2e8f0"
    class="shadow-md fixed bottom-0  border w-full h-8 flex items-center justify-center z-50"
  >
    <!-- <div class="mr-4 text-slate-600 dark:text-slate-200">Footer</div> -->
    <div class="text-gray-700 text-center p-4 text-xs lg:text-sm">
      © {{ currentYear }} Copyright:
      <a class="text-blue-900" href="https://www.facebook.com/Ajithshanth.Murugaverl"
        >Ajithshanth Murugaverl </a
      >
      
    </div>
    <!-- <div class="text-gray-700 text-center p-4 text-xs lg:text-sm">
      <div>
        Version B.E. <span class="font-bold"> {{ bVersion }} </span> - F.E.
        <span class="font-bold"> {{ fVersion }}</span>
      </div>
    </div> -->
  </div>

  <!-- END: Footer-->
</template>

<script>
import { computed } from "vue";
import { useDarkModeStore } from "@/stores/dark-mode";
import dom from "@left4code/tw-starter/dist/js/dom";
import { version } from "../../../package.json";
import axios from "../../services/http-common";
// const currentYear = new Date

export default {
  data: () => ({
    bVersion: "00.00.00.00",
    fVersion: version,
    currentYear: new Date().getFullYear(),
  }),

  created() {
 
  },
  methods: {
     
  },
};

// const darkModeStore = useDarkModeStore();
// const darkMode = computed(() => darkModeStore.darkMode);

// const setDarkModeClass = () => {
//   darkMode.value
//     ? dom("html").addClass("dark")
//     : dom("html").removeClass("dark");
// };

// const switchMode = () => {
//   darkModeStore.setDarkMode(!darkMode.value);
//   setDarkModeClass();
// };

// const currentYear = new Date.getFullYear()

// data: () => ({
//     bVersion: "",
//     fVersion: version,
//     currentYear: new Date().getFullYear(),
//   }),

// setDarkModeClass();
</script>
