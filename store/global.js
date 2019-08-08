export const state = () => ({
  notifySuccess: {
    message: ''
  },
  notifyWarning: {
    message: ''
  },
  notifyInfo: {
    message: ''
  },
  notifyError: {
    message: ''
  },
  token: {
      value: ''
  }
});

export const getters = () => ({});

export const mutations = {
  setToken(state, data) {
    state.token.value = data;
  },
  notifySuccess(state, message) {
    state.notifySuccess = { message };
  },
  notifyWarning(state, message) {
    state.notifyWarning = { message };
  },
  notifyInfo(state, message) {
    state.notifyInfo = { message };
  },
  notifyError(state, message) {
    state.notifyError = { message };
  }
};

export const actions = {
  notifySuccess({ commit }, message) {
    commit('notifySuccess', message);
  },
  notifyWarning({ commit }, message) {
    commit('notifyWarning', message);
  },
  notifyInfo({ commit }, message) {
    commit('notifyInfo', message);
  },
  notifyError({ commit }, message) {
    commit('notifyError', message);
  },
  setToken({commit}, data) {
    commit('setToken', data); 
  }
};

