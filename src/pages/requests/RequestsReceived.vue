<template>
  <div>
    <base-dialog :show='!!error' title='An error occurred!' @close='handleError'>
      <p>{{ error }}</p>
    </base-dialog>

    <section>
      <base-card>
        <header>
          <h2>Requests Received</h2>
        </header>

        <base-spinner v-if='isLoading' />

        <ul v-else-if='hasRequests && !isLoading'>
          <request-item
            v-for='req in requests'
            :key='req.id'
            :email='req.userEmail'
            :message='req.message'
          />
        </ul>

        <h3 v-else>You haven't received any requests yet!</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import RequestItem from '../../components/requests/RequestItem.vue';
import { mapGetters, mapActions } from 'vuex';


export default {
  components: {
    RequestItem
  },
  data() {
    return {
      isLoading: false,
      error: null
    };
  },
  computed: {
    ...mapGetters( 'requests', [ 'requests', 'hasRequests' ]),
  },
  created() {
    this.loadRequests();
  },
  methods: {
    ...mapActions( 'requests', [ 'fetchRequests' ]),
    async loadRequests() {
      this.isLoading = true;
      try {
        await this.fetchRequests();
      } catch ( error ) {
        this.error = error.message || 'Something failed!';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    }
  }
};
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
