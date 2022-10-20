<template>
  <Loading
    opacity="0.5"
    background-color="white"
    :can-cancel="true"
    v-model:active="isLoading"
    color="#164e63"
    loader="dots"
    :width="50"
    :height="50"
    :is-full-page="true"
    z-index="100000"
  />

  <div class="login">
    <!-- <DarkModeSwitcher /> -->
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <div class="my-auto">
            <img
              alt="Midone Tailwind HTML Admin Template"
              class="-intro-x w-1/2 -mt-16"
              src="@/assets/images/reset-pass.png"
            />
            <div
              class="-intro-x text-white font-medium text-4xl leading-tight mt-10"
            >
              Change Your Password
            </div>
            <div
              class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400"
            >
              myWarehouse - your inventory solution
            </div>
          </div>
        </div>

        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div
            class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto"
          >
            <!-- <div class="xl:mb-20 sm:mb-0">
              <img
                alt="Pharmatec Logo"
                class="logo__image xl:h-48"
                src="@/assets/images/pl_logo2.png"
              />
            </div> -->

            <ArrowLeftCircleIcon
              @click="redirectToPreveious()"
              class="lg:w-12 lg:h-12 w-6 h-6 mr-2 mb-5 -ml-6 cursor-pointer"
            />

            <h2
              class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left"
            >
              Change Password
            </h2>
            <div class="intro-x mt-2 text-slate-400 xl:hidden text-center">
              Manage all your warehouse operations in one place
            </div>
            <div class="intro-x mt-8">
              <div class="w-full relative text-slate-500 mb-4">
                <input
                  :type="visibility"
                  class="form-control w-full pr-10"
                  placeholder="New Password"
                  v-model="formData.currentPassword"
                />
                <EyeIcon
                  @click="showPassword()"
                  v-if="visibility == 'password'"
                  class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
                />
                <EyeOffIcon
                  @click="hidePassword()"
                  v-if="visibility == 'text'"
                  class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
                />
              </div>
              <div class="w-full relative text-slate-500 mb-4">
                <input
                  :type="newVisibility"
                  class="form-control w-full pr-10"
                  placeholder="Current Password"
                  v-model="formData.newPassword"
                />
                <EyeIcon
                  @click="showNewPassword()"
                  v-if="newVisibility == 'password'"
                  class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
                />
                <EyeOffIcon
                  @click="hideNewPassword()"
                  v-if="newVisibility == 'text'"
                  class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
                />
              </div>
              <div class="w-full relative text-slate-500 mb-4">
                <input
                  :type="confirmVisibility"
                  class="form-control w-full pr-10"
                  placeholder="Confirm Password"
                  v-model="formData.conformPassword"
                />
                <EyeIcon
                  @click="showConfirmPassword()"
                  v-if="confirmVisibility == 'password'"
                  class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
                />
                <EyeOffIcon
                  @click="hideConfirmPassword()"
                  v-if="confirmVisibility == 'text'"
                  class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 cursor-pointer"
                />
              </div>

              <!-- <div class="relative text-slate-500">
                <input
                  v-model="formData.currentPassword"
                  :type="visibility"
                  class="intro-x login__input form-control py-3 px-4 block mt-4"
                  placeholder="Current Password"
                />
                <div
                  class="flex absolute inset-y-0 right-0 items-center pl-3 pointer-events-none"
                >
                  <EyeIcon
                    @click="showPassword()"
                    v-if="visibility == 'password'"
                    class="block mx-auto"
                  />
                  <EyeOffIcon
                    @click="hidePassword()"
                    v-if="visibility == 'text'"
                    class="block mx-auto"
                  />
                </div>
              </div> -->

              <!-- <div class="relative text-slate-500">
                <input
                  v-model="formData.newPassword"
                  :type="newVisibility"
                  class="intro-x login__input form-control py-3 px-4 block mt-4"
                  placeholder="New Password"
                />
                <EyeIcon
                  @click="showNewPassword()"
                  v-if="newVisibility == 'password'"
                  class="block mx-auto"
                />
                <EyeOffIcon
                  @click="hideNewPassword()"
                  v-if="newVisibility == 'text'"
                  class="block mx-auto"
                />
              </div> -->
              <!-- <div class="relative text-slate-500">
                <input
                  v-model="formData.conformPassword"
                  :type="confirmVisibility"
                  class="intro-x login__input form-control py-3 px-4 block mt-4"
                  placeholder="Confirm Password"
                />
                <EyeIcon
                  @click="showConfirmPassword()"
                  v-if="confirmVisibility == 'password'"
                  class="block mx-auto"
                />
                <EyeOffIcon
                  @click="hideConfirmPassword()"
                  v-if="confirmVisibility == 'text'"
                  class="block mx-auto"
                />
              </div> -->

              <div
                class="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4"
              ></div>

              <div
                class="intro-x mt-1 xl:mt-8 text-center xl:text-left flex space-x-1"
              >
                <button
                  @click="redirectToPreveious()"
                  class="btn btn-primary bg-transparent text-cyan-800 py-3 px-4 w-full xl:w-32 xl:mr-3 align-top float-left"
                >
                  Cancel
                </button>
                <button
                  @click="changePassword()"
                  class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top float-right"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- END: Form -->
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import axios from "@/services/http-common";
import store from "../../store";
import Footer from "@/global-components/footer/Main.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

import {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
} from "../../global-functions/functions";
import router from "../../router";

export default {
  components: {
    Loading,
    Footer,
  },
  data: () => ({
    visibility: "password",
    newVisibility: "password",
    confirmVisibility: "password",
    isHidden: false,
    hideSection: false,
    isLoading: false,
    formData: { currentPassword: "", newPassword: "", conformPassword: "" },
    formDataDef: { currentPassword: "", newPassword: "", conformPassword: "" },
  }),

  computed: {},
  methods: {
    showPassword() {
      this.visibility = "text";
    },
    hidePassword() {
      this.visibility = "password";
    },
    showNewPassword() {
      this.newVisibility = "text";
    },
    hideNewPassword() {
      this.newVisibility = "password";
    },
    showConfirmPassword() {
      this.confirmVisibility = "text";
    },
    hideConfirmPassword() {
      this.confirmVisibility = "password";
    },
    redirectToPreveious() {
      this.$router.go(-1);
    },

    changePassword() {
      var currentPassword = this.formData.currentPassword;
      var newPassword = this.formData.newPassword;
      var conformPassword = this.formData.conformPassword;

      if (currentPassword == "" || newPassword == "" || conformPassword == "") {
        if (currentPassword == "") {
          warningToast("Current Password Required");
        }
        if (newPassword == "") {
          warningToast("New Password Required");
        }
        if (conformPassword == "") {
          warningToast("Confirm Password Required");
        }
      } else {
        this.isLoading = true;

        axios
          .post("User/ChangePassword", this.formData)
          .then((response) => {
            if (response.data.data.success === true) {
              this.isLoading = false;
              successToast(response.data.data.message);
            } else {
              this.isLoading = false;
              failedToast(response.data.data.message);
              this.formData = Object.assign({}, this.formDataDef);
            }
          })
          .catch((error) => {
            this.isLoading = false;
            failedToast(statusMessage(error.response.status));
          });
        // store
        //   .dispatch("authUser/changePassword", {
        //     currentPassword,
        //     newPassword,
        //     conformPassword,
        //   })
        //   .then((response) => {
        //     if (response.data.success === true) {
        //       this.isLoading = false;
        //       successToast(response.data.message);
        //     } else {
        //       this.isLoading = false;
        //       failedToast(response.data.message);
        //       this.formData = Object.assign({}, this.formDataDef);
        //     }
        //   })
        //   .catch((error) => {
        //     this.isLoading = false;
        //   failedToast(statusMessage(error.response.status));
        //   });
      }
    },
  },
};
</script>
