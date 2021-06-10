<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Forgot Password</v-toolbar-title>
          </v-toolbar>
          <v-form ref="form" @submit="submit">
            <v-card-text>
              <v-text-field
                label="Username"
                prepend-icon="mdi-account"
                type="text"
                :rules="requiredRule"
                v-model="postData.username"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="flex-column">
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="loading"
                @click.prevent="submit"
                block
                >Submit</v-btn
              >
              <v-btn
                :loading="loading"
                class="ma-1"
                color="primary"
                plain
                to="/login"
              >
                Back to Login
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      postData: {
        username: null
      },
      loading: false,
      requiredRule: [(val) => !!val || "Required!"],
    };
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        let res = await this.$http.post("/api/auth/forgotpassword", this.postData);
        this.$store.dispatch("Notify", res.data.message);
      } catch(err) {}
      this.loading = false;
    },
  },
};
</script>

<style scoped>
</style>