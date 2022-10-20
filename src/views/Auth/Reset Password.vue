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
        <!-- BEGIN: Login Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <!-- <a
            href="/"
            class="-intro-x flex items-center w-auto bg-white rounded-lg"
          >
            <img
              alt="Pharmatec Logo"
              class="logo__image"
              style="width: auto; height: 50px"
              src="@/assets/images/pl_logo2.png"
            />
             
          </a> -->
          <div class="my-auto">
            <img
              alt="Midone Tailwind HTML Admin Template"
              class="-intro-x w-1/2 -mt-16"
              src="@/assets/images/reset-pass.png"
            />
            <div
              class="-intro-x text-white font-medium text-4xl leading-tight mt-10"
            >
              Reset Your Password
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
              Reset Password
            </h2>
            <div class="intro-x mt-2 text-slate-400 xl:hidden text-center">
              Manage all your warehouse operations in one place
            </div>
            <div class="intro-x mt-8">
              <input
                v-model="formData.userName"
                type="text"
                class="form-control w-full pr-10"
                placeholder="Username"
                @change="usernameError = false"
              />

              <InputError v-if="usernameError" errorMessage="usernameErrMsg" />
              <button
                v-if="isHidden == false"
                @click="btnClick(true)"
                class="btn btn-primary bg-transparent text-cyan-800 btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top mt-5"
              >
                Get Token
              </button>
              <div v-show="hideSection">
                <div class="w-full relative text-slate-500 mb-4">
                  <input
                    v-model="formData.newPassword"
                    :type="newVisibility"
                    class="form-control w-full pr-10 mt-5"
                    placeholder="Newpassword"
                    @change="passwordError = false"
                  />
                  <EyeIcon
                    @click="showNewPassword()"
                    v-if="newVisibility == 'password'"
                    class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 mt-7 cursor-pointer"
                  />
                  <EyeOffIcon
                    @click="hideNewPassword()"
                    v-if="newVisibility == 'text'"
                    class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 mt-7 cursor-pointer"
                  />
                  <InputError
                    v-if="newpasswordError"
                    errorMessage="passwordErrMsg"
                  />
                </div>
                <div class="w-full relative text-slate-500 mb-4">
                  <input
                    v-model="formData.confirmPassword"
                    :type="confirmVisibility"
                    class="form-control w-full pr-10"
                    placeholder="Confirmpassword"
                    @change="confirmpasswordError = false"
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
                  <InputError
                    v-if="confirmError"
                    errorMessage="confirmpasswordErrMsg"
                  />
                </div>

                <div
                  class="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4"
                >
                  <!-- <div class="flex items-center mr-auto">
                <input
                  id="remember-me"
                  type="checkbox"
                  class="form-check-input border mr-2"
                />
                <label class="cursor-pointer select-none" for="remember-me"
                  >Remember me</label
                >
              </div> -->
                </div>

                <div
                  class="intro-x mt-1 xl:mt-8 text-center xl:text-left flex space-x-1"
                >
                  <button
                    class="btn btn-primary bg-transparent text-cyan-800 py-3 px-4 w-full xl:w-32 xl:mr-3 align-top float-left"
                  >
                    Cancel
                  </button>
                  <button
                    @click="login()"
                    class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top float-right"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
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
    confirmVisibility: "password",
    newVisibility: "password",
    isHidden: false,
    hideSection: false,
    isLoading: false,
    formData: { userName: "", password: "" },
    formDataDef: { userName: "", password: "" },
    usernameError: false,
    usernameErrMsg: "",
    passwordError: false,
    passwordErrMsg: "",
  }),
  methods: {
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
      router.push({ path: "/admin/storage-bins" });
    },
    btnClick(bool) {
      this.isHidden = bool;
      if (this.isHidden == true) {
        this.hideSection = true;
      } else {
        this.hideSection = false;
      }
    },

    login() {
      if (this.formData.userName == "" || this.formData.password == "") {
        if (this.formData.userName == "") {
          this.usernameError = true;
          this.usernameErrMsg = "User Name Required";

          warningToast("Enter Username");
        }
        if (this.formData.password == "") {
          this.passwordError = true;
          this.passwordErrMsg = "Password Required";
          warningToast("Enter Password");
        }
      } else {
        var username = this.formData.userName;
        var password = this.formData.password;
        this.isLoading = true;
        store
          .dispatch("authUser/login", { username, password })
          .then((response) => {
            console.log(response);
            if (response.success === true) {
              this.isLoading = false;
              successToast(response.message);

              router.push("/admin/locations");
            } else {
              this.isLoading = false;
              failedToast(response.message);
              this.formData = Object.assign({}, this.formDataDef);
            }
          })
          .catch(() => {});

        // axios
        //   .post("Authentications/Login", this.formData)
        //   .then((response) => {
        //     if (response.data.success === true) {
        //       successToast(response.data.message);
        //       router.push("/");
        //     } else {
        //       failedToast(response.data.message);
        //       this.formData = Object.assign({}, this.formDataDef);
        //     }
        //   })
        //   .catch(() => {});
      }
    },
  },
};
</script>
