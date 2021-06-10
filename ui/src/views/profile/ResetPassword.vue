<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Reset Password</v-toolbar-title>
          </v-toolbar>
          <v-form ref="form" @submit="submit">
            <v-card-text>
              <v-text-field
                label="New Password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="requiredRule"
                v-model="postData.password"
              ></v-text-field>
              <v-text-field
                label="Confirm Password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="[(val) => (!!val && confirmPassword == postData.password) || 'Password Does not Match!']"
                v-model="confirmPassword"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="loading"
                @click.prevent="submit"
                block
                >Submit</v-btn
              >
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
        password: null
      },
      confirmPassword: null,
      loading: false,
      requiredRule: [(val) => !!val || "Required!"],
    };
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        let res = await this.$http.post("/api/auth/resetpassword", this.postData);
        this.$store.dispatch("Notify", res.data.message);
      } catch(err) {}
      this.loading = false;
    },
  },
};
</script>

<style scoped>
</style>