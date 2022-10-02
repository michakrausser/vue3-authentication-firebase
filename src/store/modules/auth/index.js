import mutations from './mutations'
import actions from './actions'
import getters from './getters'

export default {
  namespaced: true,
  state() {
    return {
      userId: null,
      token: null,
      tokenExpirationTime: null,
      countDownTokenExpiration: null,
      isCountDownRunning: false
    };
  },
  mutations,
  actions,
  getters
}
