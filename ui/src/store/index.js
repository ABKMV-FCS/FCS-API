import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const setAndManage = (state, value, key) => {
  state[key] = value;
  if (value)
    localStorage.setItem(key, value)
  else
    localStorage.removeItem(key)
}
const expirationCalc = (ticks) => {
  let t = new Date();
  t.setMinutes(t.getMinutes()+ticks);
  return t;
}

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    name: localStorage.getItem('name') || null,
    username: localStorage.getItem('username') || null,
    expiration: localStorage.getItem('expiration') || null,
    role: localStorage.getItem('role') || null,
    notificationMessage: null,
    notifierView: false,
    fcmToken: null
  },
  getters: {
    fcmToken: state => state.fcmToken,
    Token: state => state.token,
    Name: state => state.name,
    Username: state => state.username,
    Expiration: state => state.expiration,
    Role: state => state.role,
    NotificationMessage: state => state.notificationMessage,
    NotifierView: state => state.notifierView
  },
  mutations: {
    setFcmToken: (state, value) => state.fcmToken = value,
    Token: (state, value) => setAndManage(state, value, 'token'),
    Name: (state, value) => setAndManage(state, value, 'name'),
    Username: (state, value) => setAndManage(state, value, 'username'),
    Expiration: (state, value) => setAndManage(state, value, 'expiration'),//manage auto logout,
    Role: (state, value) => setAndManage(state, value, 'role'),
    NotificationMessage: (state, value) => state.notificationMessage = value,
    NotifierView: (state, value) => state.notifierView = value
  },
  actions: {
    Logout: ({ commit }) => {
      commit('Token', null)
      commit('Name', null)
      commit('Username', null)
      commit('Expiration', null)
      commit('Role', null)
    },
    Login: ({ commit }, details) => {
      commit('Token', details.token)
      commit('Name', details.name)
      commit('Username', details.username)
      commit('Expiration', details.expiration===-1?details.expiration:expirationCalc(details.expiration))
      commit('Role', details.role)
    },
    Notify: ({ commit }, message) => {
      commit('NotificationMessage', message.length<150?message:message.substring(0,150)+'.....')
      commit('NotifierView', true)
    },
    CloseNotification: ({ commit }) => {
      commit('NotificationMessage', null)
      commit('NotifierView', false)
    }
  },
  modules: {
  }
})
