// Vue

import Vuex from "vuex";

import authUser from "./authUser";
import menuTitle from "./menuTitle";

const store = new Vuex.Store({
  modules: { authUser, menuTitle },
  plugins: [],
  state: {},
  mutations: {},
});

export default store;

export const ROOT_DISPATCH = Object.freeze({ root: true });
