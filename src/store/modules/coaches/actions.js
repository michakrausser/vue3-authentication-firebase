export default {
  async registerCoach({ commit, rootGetters }, data ) {
    const userId = rootGetters[ 'auth/userId' ]
    const token = rootGetters[ 'auth/token' ]
    const coachData = {
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      hourlyRate: data.rate,
      areas: data.areas
    };

    const response = await fetch(
      `https://vue-authentication-87fa8-default-rtdb.firebaseio.com/coaches/${ userId }.json?auth=${ token }`,
      {
        method: 'PUT',
        body: JSON.stringify( coachData )
      }
    );
    const responseData = await response.json();

    if ( !response.ok ) {
      console.log( responseData );
    }
    commit('REGISTER_COACH', {
      ...coachData,
      id: userId
    });
  },
  async loadCoaches({ commit, getters }, payload ) {
    if ( !payload.forceRefresh && !getters.shouldUpdate ) {
      return;
    }

    const response = await fetch(
      `https://vue-authentication-87fa8-default-rtdb.firebaseio.com/coaches.json`
    );
    const responseData = await response.json();

    if ( !response.ok ) {
      const error = new Error(responseData.message || 'Failed to fetch!' );
      throw error;
    }

    const coaches = [];

    for ( const key in responseData ) {
      const coach = {
        id: key,
        firstName: responseData[ key ].firstName,
        lastName: responseData[ key ].lastName,
        description: responseData[ key ].description,
        hourlyRate: responseData[ key ].hourlyRate,
        areas: responseData[ key ].areas
      };
      coaches.push( coach )
    }
    commit( 'SET_COACHES', coaches )
    commit( 'SET_FETCH_TIMESTAMP' )
  }
};
