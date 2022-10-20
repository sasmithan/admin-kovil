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
    <div class="container sm:px-5">
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
              alt="Kovil Admin"
              class="-intro-x w-1/2 -mt-16"
              src="@/assets/images/nallur-ed.png"
            />
            <div
              class="-intro-x text-white font-medium text-4xl leading-tight mt-10"
            >
              Log In to your account.
            </div>
            <div
              class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400"
            >
              நிர்வாக
              <span class="text-white text-opacity-100"> Dashboard</span>யினுள்
              உள் நுழைக
            </div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 xl:my-0">
          <div
            class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto"
          >
            <!-- <div class="xl:mb-2 sm:mb-0">
              <img
                alt="Kovil Logo"
                class="logo__image xl:h-96"
                src="@/assets/images/nallur-ed.png"
              />
            </div> -->

            <h2
              class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left"
            >
              Log In
            </h2>

            <div class="intro-x mt-8">
              <input
                v-model="formData.email"
                type="text"
                class="form-control w-full pr-10"
                placeholder="email"
                @change="emailError = false"
              />

              <div class="w-full relative text-slate-500 mb-4">
                <input
                  v-model="formData.password"
                  :type="visibility"
                  class="form-control w-full pr-10 mt-5"
                  placeholder="Password"
                  @change="passwordError = false"
                  @keyup.enter="login"
                />
                <EyeIcon
                  @click="showPassword()"
                  v-if="visibility == 'password'"
                  class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 mt-7 cursor-pointer"
                />
                <EyeOffIcon
                  @click="hidePassword()"
                  v-if="visibility == 'text'"
                  class="w-6 h-6 absolute my-auto inset-y-0 mr-3 right-0 mt-7 cursor-pointer"
                />
                <InputError
                  v-if="passwordError"
                  errorMessage="passwordErrMsg"
                />
              </div>
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
              <a href="">Forgot Password?</a>
            </div>
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
              <button
                @click="login()"
                class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top"
              >
                Login
              </button>
              <!-- <button
                class="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top"
              >
                Register
              </button> -->
            </div>
            <!-- <div
              class="intro-x mt-10 xl:mt-24 text-slate-600 dark:text-slate-500 text-center xl:text-left"
            >
              By signin up, you agree to our
              <a class="text-primary dark:text-slate-200" href=""
                >Terms and Conditions</a
              >
              &
              <a class="text-primary dark:text-slate-200" href=""
                >Privacy Policy</a
              >
            </div> -->
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

// import { onMounted } from "vue";
// import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
// import dom from "@left4code/tw-starter/dist/js/dom";

// onMounted(() => {
//   dom("body").removeClass("main").removeClass("error-page").addClass("login");
// });

export default {
  components: {
    Loading,
    Footer,
  },
  data: () => ({
    visibility: "password",
    isLoading: false,
    formData: { email: "super@gmail.com", password: "Super@123" },
    formDataDef: { email: "super@gmail.com", password: "Super@123" },
    emailError: false,
    emailErrMsg: "",
    passwordError: false,
    passwordErrMsg: "",
  }),
  methods: {
    showPassword() {
      this.visibility = "text";
    },
    hidePassword() {
      this.visibility = "password";
    },
    login() {
      if (this.formData.email == "" || this.formData.password == "") {
        if (this.formData.email == "") {
          this.emailError = true;
          this.emailErrMsg = "User Name Required";

          warningToast("Enter email");
        }
        if (this.formData.password == "") {
          this.passwordError = true;
          this.passwordErrMsg = "Password Required";
          warningToast("Enter Password");
        }
      } else {
        var email = this.formData.email;
        var password = this.formData.password;
        this.isLoading = true;
        store
          .dispatch("authUser/login", { email, password })
          .then((response) => {
            console.log("authUserres", response);
            if (response.status == 200 || response.status == 201) {
              this.isLoading = false;
              successToast("Logged In");
              var url = window.location.href;
              var check = url.indexOf("=");
              if (check === -1) {
                router.push("/admin/kovils");
              } else {
                var newUrl = url.slice(0, 0) + url.slice(check + 1);
                router.push(newUrl);
              }
            } else {
              this.isLoading = false;
              if (response.status == 0) {
                failedToast(
                  "This request has been blocked. The content must be served over HTTPS"
                );
              } else {
                failedToast(response.statusText);
              }

              // this.formData.password = "";
            }
          })
          .catch(() => {});
      }
    },
  },
};
</script>
