<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm11 md9 lg8 xl6>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Manage Profile Change Request</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-row justify="center" class="ma-2">
          </v-row>
          <v-card>
            <v-card-title>
              Profile Change Requests
            <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              item-key="_id"
              :loading="tableLoading"
              loading-text="Loading Users...Please Wait!"
              class="elevation-1"
              :items="users"
              :items-per-page="5"
              :search="search"
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-dialog
                  :retain-focus="false"
                  v-model="updateConfirmation"
                  persistent
                  max-width="600px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      medium
                      v-bind="attrs"
                      v-on="on"
                      @click.prevent="
                        updateSelect = item.faculty;
                      "
                      color="success"
                      >mdi-checkbox-marked</v-icon
                    >
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class>Accept Profile Change Request</span>
                    </v-card-title>
                    <v-form ref="form2" @submit.prevent="acceptSubmit()">
                      <v-card-text class="headline"
                        >Are You Sure You Want to Accept the Profile Change Request:
                        {{ updateSelect }} ?</v-card-text
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="red darken-1"
                          text
                          @click.prevent="
                            updateConfirmation = false;
                            updateSelect = {};
                          "
                          >NO</v-btn
                        >
                        <v-btn
                          color="green darken-1"
                          text
                          :loading="loading"
                          :disabled="loading"
                          @click.prevent="acceptSubmit()"
                          >YES</v-btn
                        >
                      </v-card-actions>
                    </v-form>
                  </v-card>
                </v-dialog>
                <v-dialog
                  :retain-focus="false"
                  v-model="deleteConfirmation"
                  persistent
                  max-width="600px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      medium
                      v-bind="attrs"
                      v-on="on"
                      @click.prevent="deleteSelect = { ...item }"
                      color="red"
                      >mdi-close-box</v-icon
                    >
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class>Delete Users</span>
                    </v-card-title>
                    <v-form ref="form2" @submit.prevent="rejectSubmit()">
                      <v-card-text class="headline"
                        >Are You Sure You Want to Reject the User:
                        {{ deleteSelect.faculty }} ?</v-card-text
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green darken-1"
                          text
                          @click.prevent="
                            deleteConfirmation = false;
                            deleteSelect = {};
                          "
                          >NO</v-btn
                        >
                        <v-btn
                          color="red darken-1"
                          text
                          :loading="loading"
                          :disabled="loading"
                          @click.prevent="rejectSubmit()"
                          >YES</v-btn
                        >
                      </v-card-actions>
                    </v-form>
                  </v-card>
                </v-dialog>
              </template>
            </v-data-table>
          </v-card>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      deleteConfirmation: false,
      deleteSelect: {},
      updateSelect: {},
      updateConfirmation: false,
      create: false,
      loading: false,
      search: "",
      tableLoading: true,
      users: [],
      headers: [
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Phone", value: "phone" },
        { text: "Qualifications", value: "qualifications" },
        { text: "Username", value: "faculty" },
        { text: "Actions", value: "actions", align: "end", sortable: false },
      ],
      postData: {
        name: null,
        email: null,
        phone: null,
        role: null,
        qualifications: null,
        username: null,
        password: null,
        profilephoto: null,
      },
      requiredRule: [(val) => !!val || "Required!"],
      emailRule: [
        (v) =>
          (!!v && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)) ||
          "E-mail must be valid",
      ],
      phoneRule: [
        (v) =>
          (!!v && !isNaN(parseFloat(v)) && v >= 1000000000 && v <= 9999999999) ||
          "Phone Number must be valid",
      ],
    };
  },
  created() {
    this.getUsers();
    this.tableLoading = false;
  },
  methods: {
    async getUsers() {
      try {
        this.users = (await this.$http.get("/api/profile/showprofilechangerequest")).data.requests;
      } catch (err) {
		  console.log(err);
	  }
    },
    async acceptSubmit() {
      this.loading = true;
      try {
        let newPostData = { ...this.postData };
        let res = await this.$http.post("/api/profile/acceptprofilechangerequest", { faculty: this.updateSelect });
        this.$store.dispatch("Notify", res.data.message);
        this.getUsers();
        this.updateSelect = {};
        this.updateConfirmation = false;
      } catch (error) {
        console.log("heere", error);
      }
      this.loading = false;
    },
    async rejectSubmit() {
      this.loading = true;
      try {
        let res = await this.$http.post("/api/profile/rejectprofilechangerequest", {
          faculty: this.deleteSelect.faculty,
        });
        this.$store.dispatch("Notify", res.data.message);
        this.getUsers();
        this.deleteSelect = {};
        this.deleteConfirmation = false;
      } catch (error) {}
      this.loading = false;
    }
  },
};
</script>

<style></style>
