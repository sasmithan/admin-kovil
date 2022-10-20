const state = {
  menuTitle: localStorage.getItem("menuTitle") || "",
  subMenuTitle: localStorage.getItem("subMenu_title") || "",
};

const mutations = {
  menu_title(state, menu) {
    state.menuTitle = menu;
    localStorage.setItem("menuTitle", menu);
  },
  subMenu_title(state, menu) {
    state.subMenuTitle = menu;
    localStorage.setItem("subMenu_title", menu);
  },
};

const actions = {
  setMenuTitle: ({ commit }, menu) => {
    return new Promise(() => {
      commit("menu_title", menu); 
    });
  },
  setSubMenuTitle: ({ commit }, menu) => {
    return new Promise(() => {
      commit("subMenu_title", menu); ;
    });
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
