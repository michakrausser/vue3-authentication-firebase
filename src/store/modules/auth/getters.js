export default {
  userId( state ) {
    return state.userId;
  },
  token( state ) {
    return state.token
  },
  tokenExpiration( state ) {
    return state.tokenExpiration
  },
  countDownTokenExpiration( state ) {
    return state.countDownTokenExpiration
  },
  isAuthenticated( state ) {
    return !!state.token
  }
}
