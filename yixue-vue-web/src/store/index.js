import Vue from 'vue'
import Vuex from 'vuex'
import app from './app'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    // 将app和user放在store中
    modules: {
        app,
        user
    }
})
