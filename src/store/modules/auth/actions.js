import router from '@/router'

export default {
  async login( context, payload ) {
    await authenticationFireBase( context, payload,'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBDl88YviRwNYrOi-_SwbvIkhdT0bMXk4Y' )
  },
  async signup( context, payload ) {
    await authenticationFireBase( context, payload,'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBDl88YviRwNYrOi-_SwbvIkhdT0bMXk4Y' )
  },
  logout({ state, commit }) {
    commit( 'LOGOUT_USER' )
    state.isCountDownRunning = false
    localStorage.removeItem( 'user' )
    router.replace( 'coaches' )
  },
  async startCountDownTokenExpiration({ state, commit }, countDownTime ) {
    state.isCountDownRunning = true
    state.countDownTokenExpiration = countDownTime
    while ( state.countDownTokenExpiration > 0 && state.isCountDownRunning ) {
      await new Promise( resolve => setTimeout( resolve, 1000 ))
      state.countDownTokenExpiration--
      if ( state.countDownTokenExpiration === 0 ) {
        commit( 'LOGOUT_USER' )
        router.push( 'coaches' )
      }
    }
  }
}

async function authenticationFireBase( context, payload, url ) {
  const response = await fetch( url,
    {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true
      })
    }
  )
  const responseData = await response.json()

  if ( !response.ok ) {
    console.log( { responseData } );
    throw new Error( responseData.message || 'Failed to authenticate.' )
  }

  // const expiresIn = +responseData.expiresIn * 1000
  const expiresIn = +responseData.expiresIn * 1000
  const expirationDate = new Date().getTime() + expiresIn

  // localId will be a String: The uid of the authenticated user.

  localStorage.setItem( 'user', JSON.stringify({
    userId: responseData.localId,
    token: responseData.idToken,
    tokenExpiration: expirationDate
  }))

  context.commit( 'SET_USER', {
    token: responseData.idToken,
    userId: responseData.localId,
    tokenExpiration: expirationDate
  })

  context.dispatch( 'startCountDownTokenExpiration', +responseData.expiresIn )
}
