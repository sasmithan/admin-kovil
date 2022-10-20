import Icon from "../views/Components/icon/Main.vue";
import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/side-menu/Main.vue";
import ErrorPage from "../views/Components/error-page/Main.vue";

import ServerDown from "../views/Components-New/error-page/Server Down.vue";
import AccessDenied from "../views/Components-New/error-page/Access Denied.vue";

import Login from "../views/Auth/Sign In.vue";
import ResetPassword from "../views/Auth/Reset Password.vue";

import ChangePassword from "../views/Auth/Change Password.vue";

import LoadingIcon from "../views/Components/loading-icon/Main.vue";
import Button from "../views/Components/button/Main.vue";

import store from "../store";

import Home from "@/views/Home.vue";

import Kovils from "@/views/Kovil-Management/Kovils.vue";
import KovilCategories from "@/views/Kovil-Management/Categories.vue";
import Gods from "@/views/Kovil-Management/Gods.vue";
import PoojaTypes from "@/views/Kovil-Management/PoojaTypes.vue";
import PoojaTimes from "@/views/Kovil-Management/PoojaTimes.vue";

import SpecialPooja from "@/views/Kovil-Management/SpecialPooja.vue";
import ArchanaType from "@/views/Kovil-Management/ArchanaType.vue";
import Natchaththiram from "@/views/Jothidar-Management/Natchaththiram.vue";
 
import Raasi from "@/views/Jothidar-Management/Raasi.vue";
import Jothidar from "@/views/Jothidar-Management/Jothidar.vue";
import AstrologyCategory from "@/views/Jothidar-Management/AstrologyCategory.vue";
import Schedules from "@/views/Jothidar-Management/Schedule.vue";

import ShopCategory from "@/views/Merchandise-Management/ShopCategory.vue";
import ShopType from "@/views/Merchandise-Management/ShopType.vue";
import Shops from "@/views/Merchandise-Management/Shops.vue";
import Products from "@/views/Merchandise-Management/Products.vue";
import ShopProduct from "@/views/Merchandise-Management/ShopProduct.vue";

import ArchanaBooking from "@/views/Booking-Management/ArchanaBooking.vue";
import PoojaBooking from "@/views/Booking-Management/PoojaBooking.vue";
import SpecialPoojaBooking from "@/views/Booking-Management/SpecialPoojaBooking.vue";
const routes = [
  {
    path: "/",
    name: "",
    redirect: (to) => {
      return { path: "/admin/home" };
    },
  },
  {
    path: "/icon",
    name: "simple-menu-icon",
    component: Icon,
  },
  {
    path: "/button",
    name: "top-menu-button",
    component: Button,
  },
  {
    path: "/loading-icon",
    name: "simple-menu-loading-icon",
    component: LoadingIcon,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
    meta: { requiresAuth: true },
  },
  {
    path: "/change-password",
    name: "ChangePassword",
    component: ChangePassword,
    meta: { requiresAuth: true },
  },

  {
    path: "/page-down",
    name: "PageDown",
    component: ServerDown,
  },
  {
    path: "/access-denied",
    name: "AccessDenied",
    component: AccessDenied,
  },

  {
    path: "/:pathMatch(.*)*",
    component: ErrorPage,
  },

  {
    path: "/admin",
    component: SideMenu,
    meta: { requiresAuth: true },

    children: [
      {
        path: "home",
        name: "Home",
        component: Home,
        meta: { requirePermission: true },
      },

      {
        path: "archana-booking",
        name: "ArchanaBooking",
        component: ArchanaBooking,
        meta: { requirePermission: true },
      },
      {
        path: "pooja-booking",
        name: "PoojaBooking",
        component: PoojaBooking,
        meta: { requirePermission: true },
      },
      {
        path: "special-pooja-booking",
        name: "SpecialPoojaBooking",
        component: SpecialPoojaBooking,
        meta: { requirePermission: true },
      },
      {
        path: "kovils",
        name: "Kovils",
        component: Kovils,
        meta: { requirePermission: true },
      },
      {
        path: "raasi",
        name: "Raasi",
        component: Raasi,
        meta: { requirePermission: true },
      },
      {
        path: "natchaththiram",
        name: "Natchaththiram",
        component: Natchaththiram,
        meta: { requirePermission: true },
      },
       
      {
        path: "kovil-categories",
        name: "KovilCategories",
        component: KovilCategories,
        meta: { requirePermission: true },
      },
      {
        path: "gods",
        name: "Gods",
        component: Gods,
        meta: { requirePermission: true },
      },

      {
        path: "pooja-yimes",
        name: "PoojaTimes",
        component: PoojaTimes,
        meta: { requirePermission: true },
      },
      {
        path: "pooja-types",
        name: "PoojaTypes",
        component: PoojaTypes,
        meta: { requirePermission: true },
      },
      {
        path: "special-pooja",
        name: "SpecialPooja",
        component: SpecialPooja,
        meta: { requirePermission: true },
      },
      {
        path: "archana-type",
        name: "ArchanaType",
        component: ArchanaType,
        meta: { requirePermission: true },
      },

      {
        path: "jothidar",
        name: "Jothidar",
        component: Jothidar,
        meta: { requirePermission: true },
      },
      {
        path: "astrology-category",
        name: "AstrologyCategory",
        component: AstrologyCategory,
        meta: { requirePermission: true },
      },
      {
        path: "jothidar-schedule",
        name: "Schedules",
        component: Schedules,
        meta: { requirePermission: true },
      },
      {
        path: "shop-category",
        name: "ShopCategory",
        component: ShopCategory,
        meta: { requirePermission: true },
      },
      {
        path: "shop-type",
        name: "ShopType",
        component: ShopType,
        meta: { requirePermission: true },
      },
      {
        path: "shops",
        name: "Shops",
        component: Shops,
        meta: { requirePermission: true },
      },
      {
        path: "shopproduct",
        name: "ShopProduct",
        component: ShopProduct,
        meta: { requirePermission: true },
      },
      {
        path: "products",
        name: "Products",
        component: Products,
        meta: { requirePermission: true },
      },
    ],
  },
];
function hasAccess(name) {
  var permissions = localStorage.getItem("permissions");
  switch (name) {
    case "ArchanaBooking":
      return permissions.includes("Permissions.Users.View");
    case "PoojaBooking":
      return permissions.includes("Permissions.Users.View");
    case "SpecialPoojaBooking":
      return permissions.includes("Permissions.Users.View");
    case "Kovils":
      return permissions.includes("Permissions.Users.View");
    case "KovilCategories":
      return permissions.includes("Permissions.Users.View");
    case "Gods":
      return permissions.includes("Permissions.Users.View");
    case "PoojaTimes":
      return permissions.includes("Permissions.Users.View");
    case "PoojaTypes":
      return permissions.includes("Permissions.Users.View");
    case "SpecialPooja":
      return permissions.includes("Permissions.Users.View");
    case "ArchanaType":
      return permissions.includes("Permissions.Users.View");
    case "Jothidar":
      return permissions.includes("Permissions.Users.View");
    case "AstrologyCategory":
      return permissions.includes("Permissions.Users.View");
    case "Schedules":
      return permissions.includes("Permissions.Users.View");
    case "ShopCategory":
      return permissions.includes("Permissions.Users.View");
    case "ShopType":
      return permissions.includes("Permissions.Users.View");
    case "Shops":
      return permissions.includes("Permissions.Users.View");
    case "ShopProduct":
      return permissions.includes("Permissions.Users.View");
    case "Products":
      return permissions.includes("Permissions.Users.View");
      case "Raasi":
        return permissions.includes("Permissions.Users.View");
    case "Natchaththiram":
      return permissions.includes("Permissions.Users.View");
    case "Home":
      return permissions.includes("Permissions.Users.View");

    default:
      return false;
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !store.getters["authUser/isLoggedIn"]) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    };
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters["authUser/isLoggedIn"]) {
      if (hasAccess(to.name)) {
      } else {
        return {
          path: "/access-denied",
          query: { redirect: to.fullPath },
        };
      }
    } else {
      return {
        path: "/login",
        query: { redirect: to.fullPath },
      };
    }
  }
});

export default router;
