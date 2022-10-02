<template>
  <the-header />
  <router-view v-slot="slotProps">
    <transition name="route" mode="out-in">
      <component :is="slotProps.Component" />
    </transition>
  </router-view>
</template>

<script>
import TheHeader from './components/layout/TheHeader.vue';


export default {
  components: {
    TheHeader
  },
  created() {
    // Automatic Login => get data from local storage
    const user = localStorage.getItem( 'user' )
    if ( user ) {
      const userData = JSON.parse( user )
      const restTime = Math.trunc(( userData.tokenExpiration - new Date().getTime() ) / 1000 )

      if ( restTime > 30 ) {
        this.$store.commit( 'auth/SET_USER', userData )
        this.$store.dispatch(
          'auth/startCountDownTokenExpiration',
          restTime
        )
      } else {
        this.$router.push( 'coaches' )
      }
    }
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
