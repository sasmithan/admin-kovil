<template>
  <div>
    <DarkModeSwitcher />
    <div class="">
      <!-- BEGIN: Error Page -->
      <div
        class="error-page bg-blue-900 flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left"
      >
        <div class="-intro-x lg:mr-20">
          <img
            alt="Midone Tailwind HTML Admin Template"
            class="h-48 lg:h-auto"
            src="@/assets/images/error-illustration.svg"
          />
        </div>
        <div class="text-white mt-10 lg:mt-0">
          <div class="intro-x text-8xl font-medium">{{ errorCode }}</div>
          <div class="intro-x text-xl lg:text-3xl font-medium mt-5">
            Oops. This page has gone missing.
          </div>
          <div class="intro-x text-lg mt-3">
            {{ errorMessage }}
          </div>

          <router-link
            v-bind:to="{
              path: '/',
            }"
          >
            <button
              class="intro-x btn py-3 px-4 text-white border-white dark:border-darkmode-400 dark:text-slate-200 mt-10"
            >
              Back to Home
            </button>
          </router-link>
        </div>
      </div>
      <!-- END: Error Page -->
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
import dom from "@left4code/tw-starter/dist/js/dom";

// onMounted(() => {
//   dom("body").removeClass("main").removeClass("login").addClass("error-page");
// });

export default {
  data() {
    return {
      errorMessage: "",
      errorCode: "404",
    };
  },
  created() {
    this.errorMessage = localStorage.getItem("errorMessage");
  
    const errorCode = this.errorMessage.split(" ");
    this.errorCode = errorCode[errorCode.length-1]

 
  },
};
</script>
