import axios from "../services/http-common";

const state = {
  username: localStorage.getItem("username") || "",
  firstName: localStorage.getItem("firstName") || "",
  lastName: localStorage.getItem("lastName") || "",
  email: localStorage.getItem("email") || "",
  token: localStorage.getItem("token") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  permissions: localStorage.getItem("permissions") || [],
  isRefreshing: true,
};

const mutations = {
  auth_success(state, user) {
    state.username = user.username;
    state.firstName = user.firstName;
    state.lastName = user.lastName;
    state.email = user.email;
    state.token = user.customerAccessToken;
    state.refreshToken = user.refreshToken;
    state.permissions = user.permissions;

    localStorage.setItem("username", user.username);
    localStorage.setItem("firstName", user.firstName);
    localStorage.setItem("lastName", user.lastName);
    localStorage.setItem("email", user.email);
    localStorage.setItem("token", user.customerAccessToken);
    localStorage.setItem("refreshToken", user.refreshToken);
    localStorage.setItem("permissions", user.permissions);
 
  },

  auth_error(state) {
    state.username = "";
    state.email = "";
    state.firstName = "";
    state.lastName = "";
    state.token = "";
    state.refreshToken = "";
    state.permissions = [];

    localStorage.removeItem("username");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("permissions");
  },
};

const actions = {
  authenticate: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get("Authentications/Authenticate")
        .then((response) => {
          resolve();
        })
        .catch((err) => {
          commit("auth_error");
          reject();
        });
    });
  },

  login: ({ commit }, user) => {
    return new Promise((resolve, reject) => {
      axios
        .post("auth/login", user)
        .then((response) => {
        console.log("response",response);

          if (response.data) {
            var userData = response.data; 
            userData.permissions = [
              "Permissions.Users.View",
              "Permissions.Users.Create",
              "Permissions.Users.View",
              "Permissions.Users.Delete",
            ];
           // console.log("authUser:", userData);
            commit("auth_success", userData);
          } else {
            commit("auth_error");
          }
          resolve(response);
        })
        .catch((err) => {
          console.log("Error",err.response);
          resolve(err.response);
          commit("auth_error");
          reject(err);
        });
    });
  },

  getAccessToken: ({ state, commit }) => {
    return new Promise((resolve, reject) => {
      if (state.refreshToken) {
        axios
          .post("Authentications/RefreshToken", { token: state.refreshToken })
          .then((response) => {
            commit("auth_success", response.data);
            resolve(response);
          })
          .catch((err) => {
            commit("auth_error");
            reject(err);
          });
      } else {
        reject();
      }
    });
  },

  logout: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit("auth_error");
      resolve();
    });
  },
};

const getters = {
  isRefreshing: (state) => !!state.isRefreshing,
  isLoggedIn: (state) => !!state.token,
  token: (state) => state.token,
  permissions: (state) => state.permissions,
  getPermission: (state) => (permissionName) => {
    let status = state.permissions.includes(permissionName);
    return status;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
