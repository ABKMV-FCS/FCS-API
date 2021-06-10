<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Faculty Calendar Scheduler</v-toolbar-title>
          </v-toolbar>
          <v-form ref="form" @submit="login">
            <v-card-text class="pb-0">
              <v-text-field
                label="Username"
                prepend-icon="mdi-account"
                type="text"
                :rules="requiredRule"
                v-model="postData.username"
              ></v-text-field>
              <v-text-field
                label="Password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="requiredRule"
                v-model="postData.password"
              ></v-text-field>
              <v-checkbox
                class="ma-0"
                v-model="postData.staysignedin"
                label="Keep me signed in"
              ></v-checkbox>
            </v-card-text>
            <v-card-actions class="flex-column">
              <v-btn
                id="LoginButton"
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="loading"
                @click.prevent="login"
                block
                >Login</v-btn
              >
              <v-btn
                class="mt-3 mb-3 ml-0"
                id="LoginButtonGoogle"
                color="white"
                type="submit"
                :disabled="loading"
                @click.prevent="googleLogin"
                block
                >Login with <img style="margin-left:7px;height:20px;width:20px" src="../../assets/gicon.png" alt=""></v-btn
              >
              <v-btn
                :disabled="loading"
                class="ma-1"
                color="primary"
                plain
                to="/forgotpassword"
              >
                Forgot Password?
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "../../firebase";
export default {
  data() {
    return {
      postData: {
        username: null,
        password: null,
        staysignedin: false,
      },
      loading: false,
      forgotpassword: null,
      requiredRule: [(val) => !!val || "Required!"],
    };
  },
  methods: {
    async googleLogin() {
      this.loading = true;
      try {
        let provider = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(provider);
        // console.log(firebase.auth().currentUser.getIdToken());
        let idToken = firebase.auth().currentUser.getIdToken();
        let postData = {
          fcmToken: this.$store.getters.fcmToken,
          idToken,
          staysignedin: this.postData.staysignedin,
        };
        let res = await this.$http.post("/api/auth/googlelogin", postData);

        this.$store.dispatch("Login", {
          token: res.data.token,
          username: this.postData.username,
          name: res.data.name[0].toUpperCase() + res.data.name.substring(1),
          expiration: res.data.expiration,
          role: res.data.role,
        });
        if (res.data.expiration !== -1) {
          setTimeout(() => {
            this.$store.dispatch("Logout");
          }, res.data.expiration * 60 * 1000);
        }
      } catch (error) {
        this.$store.dispatch("Notify", "Error logging in with google");
        try {
          firebase.auth().signOut();
        } catch (error) {}
        console.log(error);
      }
      this.loading = false;
    },
    login() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      this.postData.fcmToken = this.$store.getters.fcmToken;
      this.$http
        .post("/api/auth/login", {...this.postData,fcmToken: this.$store.getters.fcmToken})
        .then((res) => {
          this.$store.dispatch("Login", {
            token: res.data.token,
            username: this.postData.username,
            name: res.data.name[0].toUpperCase() + res.data.name.substring(1),
            expiration: res.data.expiration,
            role: res.data.role,
          });
          if (res.data.expiration !== -1) {
            setTimeout(() => {
              this.$store.dispatch("Logout");
            }, res.data.expiration * 60 * 1000);
          }
        })
        .catch((err) => {})
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style scoped>
</style>