<template>
  <div>
    <base-dialog :show='!!error' title='An error occurred' @close='handleError'>
      <p>{{ error }}</p>
    </base-dialog>

    <base-dialog :show='isLoading' title='Authenticating...' fixed>
      <base-spinner />
    </base-dialog>

    <base-card>
      <form @submit.prevent='submitForm'>
        <div class='form-control'>
          <label for='email'>Email</label>
          <input type='email' id='email' v-model.trim='email'>
        </div>

        <div class='form-control'>
          <label for='password'>Password</label>
          <input type='password' id='password' v-model.trim='password'>
        </div>

        <p v-if='!formIsValid'>Please enter a valid email and password ( must be at least 6 characters long )</p>

        <base-button type='submit'>{{ submitButton }}</base-button>

        <base-button type='button' mode='flat' @click='switchAuthMode'>{{ modeButton }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'


export default {
  name: 'UserAuth',
  data() {
    return {
      email: '',
      password: '',
      formIsValid: true,
      mode: 'login',
      submitButton: 'Login',
      modeButton: 'Sign up instead',
      isLoading: false,
      error: null
    }
  },
  methods: {
    ...mapActions( 'auth', [ 'login', 'signup' ]),
    async submitForm() {
      this.formIsValid = true
      this.isLoading = true
      if ( this.email === '' || !this.email.includes( '@' ) || this.password.length < 6 ) {
        this.formIsValid = false
        return
      }

      const credentials = {
        email: this.email,
        password: this.password
      }

      try {
        if ( this.mode === 'login' ) {
          await this.login( credentials )
        } else {
          await this.signup( credentials )
        }
        // In order to can't go back to the Login when just logged in we replace the router history
        const redirectUrl = '/' + ( this.$route.query.redirect || 'coaches' )
        this.$router.replace( redirectUrl )
      } catch ( err ) {
        this.error = err.message || 'Failed to authenticate, please try it in few minutes!'
      }
      this.isLoading = false
    },
    switchAuthMode() {
      if ( this.mode === 'login' ) {
        this.mode = 'signup'
      } else {
        this.mode = 'login'
      }
    },
    handleError() {
      this.error = null;
    }
  },
  watch: {
    mode( newValue ) {
      if ( newValue === 'login' ) {
        this.submitButton = 'Login'
        this.modeButton = 'Sign up instead'
      } else {
        this.submitButton = 'Sign Up'
        this.modeButton = 'Login instead'
      }
    }
  }
};
</script>

<style scoped>
  form {
    margin: 1rem;
    padding: 1rem;
  }

  .form-control {
    margin: 0.5rem 0;
  }

  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
  }

  input,
  textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: 1px solid #ccc;
    padding: 0.15rem;
  }

  input:focus,
  textarea:focus {
    border-color: #3d008d;
    background-color: #faf6ff;
    outline: none;
  }
</style>
