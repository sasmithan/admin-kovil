<template>
  <!-- BEGIN: Top Bar -->
  <div
  style="background-image:repeating-linear-gradient(to right, red, white);"
    class="  h-[70px] md:h-[65px] z-[51] border-b   md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0 relative md:fixed md:inset-x-0 md:top-0 sm:px-8 md:px-10 md:pt-0 md:bg-gradient-t "
  >
    <div class="h-full flex items-center  ">
 
      <a
        href="/"
        class="logo -intro-x hidden md:flex xl:w-[100px] block bg-white rounded-lg  border-2 border-red-600"
      >
        <img
          alt="Kovil Logo"
          class="logo__image ml-2"
          style="width: auto; height: 45px"
          src="@/assets/images/logo.png"
        />
        <span class="mt-5 -ml-2 mr-2 text-primary font-semibold"> layam </span>
      </a>
   
      <nav aria-label="breadcrumb" class="-intro-x h-[45px] mr-auto bg-white border-2 border-red-600 rounded-lg">
     
        <ol class="breadcrumb breadcrumb-light mr-14 ">
          <li class="breadcrumb-item text-xl font-semibold text-primary">
            {{ store.state.menuTitle.subMenuTitle }}
          </li>
        </ol>
      </nav>
   
      <Dropdown class="intro-x w-8 h-8">
        <DropdownToggle
          tag="div"
          role="button"
          class="w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
        >
        
          <img alt="user image" src="@/assets/images/userM.png" />
        </DropdownToggle>
        <DropdownMenu class="w-56">
          <DropdownContent
            class="bg-primary/20 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white"
          >
            <DropdownHeader tag="div" class="!font-normal">
              <div class="font-medium">
                {{ authUser.username }}  
              </div>
              <div class="text-xs text-white/60 mt-0.5 dark:text-slate-500">
                {{ authUser.email }}
              </div>
            </DropdownHeader>
            <DropdownDivider class="border-white/[0.08]" />
            <DropdownItem class="dropdown-item hover:bg-white/5">
              <UserIcon class="w-4 h-4 mr-2" /> Profile</DropdownItem
            >
            <DropdownItem
              @click="addAccount"
              class="dropdown-item hover:bg-white/5"
            >
              <EditIcon class="w-4 h-4 mr-2" /> Add Account</DropdownItem
            >
            <DropdownItem
              @click="changePassword"
              class="dropdown-item hover:bg-white/5"
            >
              <LockIcon class="w-4 h-4 mr-2" /> Change Password</DropdownItem
            >
            <DropdownItem class="dropdown-item hover:bg-white/5">
              <HelpCircleIcon class="w-4 h-4 mr-2" /> Help</DropdownItem
            >
            <DropdownDivider class="border-white/[0.08]" />
            <DropdownItem
              @click="logout"
              class="dropdown-item hover:bg-white/5"
            >
              <ToggleRightIcon class="w-4 h-4 mr-2" /> Logout</DropdownItem
            >
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
      <!-- END: Account Menu -->
    </div>

    <LogoutConfirm
      :name="authUser.username"
      :modalStatus="logoutConfirmModal"
      :modalConfirm="logoutConfirm"
      :modalClose="closeLogout"
    />
    <ResetConfirm
      :name="authUser.username"
      :modalStatus="resetConfirmModal"
      :modalConfirm="resetConfirm"
      :modalClose="closeReset"
    />
  </div>
  <!-- END: Top Bar -->
</template>

<script setup>
import { useSideMenuStore } from "@/stores/side-menu";
import { computed, onMounted, provide, ref, watch } from "vue";
import { helper as $h } from "@/utils/helper";
import {
  linkTo,
  nestedMenu,
  enter,
  leave,
} from "../../layouts/side-menu/index";
import { useRoute, useRouter } from "vue-router";
import router from "../../router";
import axios from "../../services/http-common";
import store from "../../store";

const sideMenuStore = useSideMenuStore();
const route = useRoute();
const formattedMenu = ref([]);
const sideMenu = computed(() => nestedMenu(sideMenuStore.menu, route));
const authUser = ref({});
const logoutConfirmModal = ref(false);
const resetConfirmModal = ref(false);

provide("forceActiveMenu", (pageName) => {
  route.forceActiveMenu = pageName;

  formattedMenu.value = $h.toRaw(sideMenu.value);
});

watch(
  computed(() => route.path),
  () => {
    delete route.forceActiveMenu;
    formattedMenu.value = $h.toRaw(sideMenu.value);
  }
);

onMounted(() => {
  authUser.value = store.state.authUser 
  
  dom("body").removeClass("error-page").removeClass("login").addClass("main");
  formattedMenu.value = $h.toRaw(sideMenu.value);
});
const logout = () => {
  logoutConfirmModal.value = true;
};

const logoutConfirm = () => {
  store.dispatch("authUser/logout").then(() => {
    logoutConfirmModal.value = false;
    router.push("/login");
  });
};
const closeLogout = () => {
  logoutConfirmModal.value = false;
};

const changePassword = () => {
  router.push("/change-password");
};

const reset = () => {
  resetConfirmModal.value = true;
};
const resetConfirm = () => {
  resetConfirmModal.value = false;
  router.push("/reset-password");
};

const closeReset = () => {
  resetConfirmModal.value = false;
};

const addAccount = () => {
  router.push("/admin/users");
};

const searchDropdown = ref(false);
const showSearchDropdown = () => {
  searchDropdown.value = true;
};
const hideSearchDropdown = () => {
  searchDropdown.value = false;
};
</script>
