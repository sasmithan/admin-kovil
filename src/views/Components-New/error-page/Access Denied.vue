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
            alt=" "
            class="w-48 lg:w-auto"
            src="@/assets/images/access-denied.png"
          />
        </div>
        <div class="text-white mt-10 lg:mt-0">
          <div class="intro-x text-8xl font-medium">Access Denied</div>
          <div class="intro-x text-xl lg:text-3xl font-medium mt-5">
            Contact the Administrator
          </div>

          <button
            @click="redirectToPreveious()"
            class="intro-x btn py-3 px-4 text-3xl text-white border-white dark:border-darkmode-400 dark:text-slate-200 mt-10 mr-4"
          >
            <ArrowLeftCircleIcon
              class="lg:w-12 lg:h-12 w-6 h-6 mr-2 cursor-pointer"
            />

            Back
          </button>
          <button
            @click="redirectToHome()"
            class="intro-x btn py-3 px-4 text-3xl text-white border-white dark:border-darkmode-400 dark:text-slate-200 mt-10 mr-4"
          >
            <HomeIcon class="lg:w-12 lg:h-12 w-6 h-6 mr-2 cursor-pointer" />

            Home
          </button>
          <button
            @click="logout()"
            class="intro-x btn py-3 px-4 text-3xl text-white border-white dark:border-darkmode-400 dark:text-slate-200 mt-10 mr-4"
          >
            <LogOutIcon class="lg:w-12 lg:h-12 w-6 h-6 mr-2 cursor-pointer" />

            Log Out
          </button>
        </div>
      </div>
      <!-- END: Error Page -->
    </div>
  </div>
</template>

<script>
import router from "../../../router";
import store from "../../../store";
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    redirectToPreveious() {
      this.$router.go(-1);
    },
    redirectToHome() {
      router.push("/");
    },

    logout() {
      store.dispatch("authUser/logout").then(() => { 
        router.push("/login");
      });
    },
  },
};
</script>
