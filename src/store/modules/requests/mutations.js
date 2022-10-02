export default {
  ADD_REQUEST( state, payload ) {
    state.requests.push( payload );
  },
  SET_REQUEST( state, payload ) {
    state.requests = payload;
  }
};
