<template>
  <div>
    <v-navigation-drawer v-if="Token" v-model="sidebarToggler" app class="">
      <v-list-group prepend-icon="mdi-account-circle" value="true">
        <template v-slot:activator>
          <v-list-item-title>{{ Name }}</v-list-item-title>
        </template>
        <v-list dense shaped nav>
          <div v-for="(itemobj, i) in sidebarURLS" :key="i">
            <v-list-item :to="itemobj.url" v-if="itemobj.role.includes(Role)">
              <v-list-item-action>
                <v-icon>{{ itemobj.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ itemobj.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list>
      </v-list-group>
    </v-navigation-drawer>
    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon
        v-if="Token"
        @click.stop="sidebarToggler = !sidebarToggler"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Faculty Calendar Scheduler</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn rounded v-if="Token !== null" to="Dashboard" text color="white">{{
        Name
      }}</v-btn>
      <v-btn rounded v-if="Token === null" to="Login" text>Login</v-btn>
      <v-btn rounded v-if="Token === null" to="StudentSubscribe" text
        >Subscribe</v-btn
      >
      <v-btn rounded to="TimeTable" text>TimeTable</v-btn>
      <v-btn rounded to="Contact" text>Contact</v-btn>
      <v-btn rounded v-if="Token !== null" @click="logout" text>Logout</v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import firebase from "../firebase";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      nameofuser: "~",
      userimg: null,
      sidebarToggler: null,
      sidebarURLS: [
        {
          name: "Dashboard",
          url: "Dashboard",
          icon: "mdi-home",
          role: ["admin", "faculty"],
        },
        {
          name: "Analytics",
          url: "Analytics",
          icon: "mdi-google-analytics",
          role: ["admin", "faculty"],
        },
        {
          name: "Manage Users",
          url: "ManageUsers",
          icon: "mdi-account-cog",
          role: ["admin"],
        },
        {
          name: "Manage Time-Table",
          url: "ManageTimeTable",
          icon: "mdi-calendar-blank-multiple",
          role: ["admin"],
        },
        {
          name: "Manage Exam-Schedule",
          url: "ManageExamSchedule",
          icon: "mdi-book-open-page-variant",
          role: ["admin"],
        },
        {
          name: "Manage Faculty Courses",
          url: "ManageFacultyCourses",
          icon: "mdi-book-account",
          role: ["admin"],
        },
        {
          name: "Emergency Holiday",
          url: "emergencyholiday",
          icon: "mdi-exit-run",
          role: ["admin"],
        },
        {
          name: "Request OD",
          url: "requestod",
          icon: "mdi-account-hard-hat",
          role: ["admin", "faculty"],
        },
        {
          name: "Manage OD",
          url: "manageod",
          icon: "mdi-file-table-box-multiple",
          role: ["admin"],
        },
        {
          name: "Request Leave",
          url: "requestleave",
          icon: "mdi-briefcase-account",
          role: ["admin", "faculty"],
        },
        {
          name: "Manage Leave",
          url: "manageleave",
          icon: "mdi-email-open-multiple-outline",
          role: ["admin"],
        },
        {
          name: "Request Profile Change",
          url: "requestprofilechange",
          icon: "mdi-account-edit-outline",
          role: ["admin", "faculty"],
        },
        {
          name: "Manage Profile Change Request",
          url: "profileupdaterequest",
          icon: "mdi-account-reactivate-outline",
          role: ["admin"],
        },
        {
          name: "Reset Password",
          url: "resetpassword",
          icon: "mdi-account-lock-outline",
          role: ["admin", "faculty"],
        },
        {
          name: "Contact",
          url: "Contact",
          icon: "mdi-phone",
          role: ["admin", "faculty"],
        },
      ],
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("Logout");
      firebase.auth().signOut();
    },
  },
  computed: mapGetters(["Token", "Name", "Username", "Role"]),
};
</script>

<style scoped>
.bgcustom {
  background-image: url(https://www.toptal.com/designers/subtlepatterns/patterns/symphony.png);
  background-repeat: repeat;
  background-position: bottom;
  animation: 10s linear 0s infinite bap;
  display: flex;
}
@keyframes bap {
  from {
    background-position: 198px 0;
  }
  to {
    background-position: 0 198px;
  }
}
</style>
