<template>
  <v-app>
    <navbar />
    <v-main>
      <router-view />
    </v-main>
    <v-bottom-sheet v-model="NotifierView" inset persistent>
      <v-sheet class="text-center" height="200">
        <div class="py-3">
          <b>{{ NotificationMessage }}</b>
        </div>
        <v-btn
          class="mt-6"
          color="error"
          @click="$store.dispatch('CloseNotification')"
          >close</v-btn
        >
      </v-sheet>
    </v-bottom-sheet>
  </v-app>
</template>

<script>
import firebase from './firebase'
import { mapGetters } from "vuex";
import navbar from "./components/Navbar";

export default {
  name: "App",
  created() {
    document.title='Faculty Calendar Scheduler'
    //For reset password
    if(this.$route.path.toLowerCase().includes("/resetpassword")) {
      this.resetPasswordCheck();
      return
    }


    if(this.Token) {
      let curDate = new Date();
      let oldDate;
      if(this.Expiration !== '-1') {
        if((oldDate = new Date(this.Expiration)) > curDate) {
          setTimeout(() => {
              this.$store.dispatch("Logout");
          }, (oldDate-curDate));
        }
        else {
          this.$store.dispatch("Logout");
        }
      }
    }
    else {
      this.$store.dispatch("Logout");
    }

    firebase.analytics()
    const messaging = firebase.messaging();
    messaging
      .requestPermission()
      .then(() => {
        console.log("granted");
        return messaging.getToken({vapidKey:'BD1WBlV_Ho0GYo7sbIrHAlRrhyNnVUjbgW0Z4H7FSRazeCGHev0H4ikRLhj_xtG-xy4uDzVZBdiBmr5yyLk-aN0'});
      })
      .then((token) => {
        console.log(token);
        this.$store.commit("setFcmToken", token);
      })
      .catch((err) => {
        console.log("denied ", err);
      });
    let self = this;
    messaging.onMessage(function (payload) {
      console.log("payload", payload);
      self.$store.dispatch("Notify", payload.notification.body);
    });
  },
  computed: {
    ...mapGetters([
      "Token",
      "Expiration",
      "NotifierView",
      "NotificationMessage",
    ]),
  },
  watch: {
    Token() {
      this.$router.push(this.Token ? "Dashboard" : "Login");
    },
  },
  components: {
    navbar,
  },

  data: () => ({
    //
  }),
  methods: {
    async resetPasswordCheck() {
      let token = this.$route.query.token;
      if (token == null || token == undefined) {
          if(this.Token == null) {
              this.$router.push("/");
              return;
          }
      }
      else {
          this.$store.dispatch("Logout");
          try{
            let res = await this.$http.post("/api/auth/check-jwt", { token });
            this.$store.dispatch("Login", {
              token: token,
              username: res.data.username,
              name: res.data.name[0].toUpperCase() + res.data.name.substring(1),
              expiration: res.data.expiration,
              role: res.data.role,
            });
            setTimeout(() => {
                this.$store.dispatch("Logout");
            }, res.data.expiration*60*1000);
            this.$nextTick(() => {
              this.$router.push("/ResetPassword");
            });
          } catch(err) {
            this.$router.push("/");
            return;
          }
      }
    }
  }
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  position: relative;
}
.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown),
html.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) {
  height: 100% !important;
  overflow-y: visible !important;
  overflow-x: visible !important;
}
</style>