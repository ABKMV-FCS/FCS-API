<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm11 md9 lg8 xl6>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Manage Users</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-row justify="center" class="ma-2"> </v-row>
          <v-card>
            <v-card-title>
              Users
              <v-spacer></v-spacer>
              <v-dialog v-model="create" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="success" dark v-bind="attrs" v-on="on" tile>
                    <v-icon left>mdi-plus-circle-outline</v-icon>Create Users
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Create Users</span>
                  </v-card-title>
                  <v-form ref="form" @submit.prevent="createSubmit">
                    <v-card-text>
                      <v-text-field
                        label="Name"
                        v-model="postData.name"
                        type="text"
                        :rules="requiredRule"
                      ></v-text-field>
                      <v-text-field
                        label="Email"
                        v-model="postData.email"
                        type="email"
                        :rules="emailRule"
                      ></v-text-field>
                      <v-text-field
                        label="Phone Number"
                        v-model="postData.phone"
                        type="number"
                        :rules="phoneRule"
                      ></v-text-field>
                      <v-select
                        :items="['faculty', 'admin']"
                        v-model="postData.role"
                        filled
                        label="Role"
                        :rules="requiredRule"
                      ></v-select>
                      <v-text-field
                        label="Qualifications"
                        v-model="postData.qualifications"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        label="Username"
                        v-model="postData.username"
                        type="text"
                        :rules="requiredRule"
                      ></v-text-field>
                      <v-text-field
                        label="Password"
                        v-model="postData.password"
                        type="password"
                        :rules="requiredRule"
                      ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="createClose"
                        >Close</v-btn
                      >
                      <v-btn
                        color="blue darken-1"
                        text
                        :loading="loading"
                        :disabled="loading"
                        @click.prevent="createSubmit"
                        >Submit</v-btn
                      >
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-dialog>
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
            :key="dtableKey"
              id="main-table"
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
                        postData = { ...item };
                        updateSelect = postData.username;
                      "
                      color="black"
                      >mdi-pencil-box</v-icon
                    >
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Update Users</span>
                    </v-card-title>
                    <v-form ref="form3" @submit.prevent="updateSubmit()">
                      <v-card-text>
                        <v-text-field
                          label="Username"
                          v-model="postData.username"
                          type="text"
                          :rules="requiredRule"
                        ></v-text-field>
                        <v-text-field
                          label="Name"
                          v-model="postData.name"
                          type="text"
                          :rules="requiredRule"
                        ></v-text-field>
                        <v-text-field
                          label="Email"
                          v-model="postData.email"
                          type="email"
                          :rules="emailRule"
                        ></v-text-field>
                        <v-text-field
                          label="Phone Number"
                          v-model="postData.phone"
                          type="number"
                          :rules="phoneRule"
                        ></v-text-field>
                        <v-text-field
                          label="Qualifications"
                          v-model="postData.qualifications"
                          type="text"
                        ></v-text-field>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="updateClose"
                          >Close</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          :loading="loading"
                          :disabled="loading"
                          @click.prevent="updateSubmit()"
                          >Submit</v-btn
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
                    <v-form ref="form2" @submit.prevent="deleteSubmit()">
                      <v-card-text class="headline"
                        >Are You Sure You Want to Delete the User:
                        {{ deleteSelect.name }} ?</v-card-text
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
                          @click.prevent="deleteSubmit()"
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
      dtableKey:0,
      headers: [
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Phone", value: "phone" },
        { text: "Role", value: "role" },
        { text: "Qualifications", value: "qualifications" },
        { text: "Username", value: "username" },
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
          (!!v &&
            !isNaN(parseFloat(v)) &&
            v >= 1000000000 &&
            v <= 9999999999) ||
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
        this.users = (
          await this.$http.get("/api/profile/getallusers")
        ).data.users;
      } catch (err) {}
    },
    async createSubmit() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        let res = await this.$http.post("/api/auth/register", this.postData);
        this.create = false;
        this.$store.dispatch("Notify", res.data.message);
        this.getUsers();
        this.$refs.form.reset();
      } catch (error) {}
      this.loading = false;
    },
    async updateSubmit() {
      if (!this.$refs.form3.validate()) return;
      this.loading = true;
      try {
        let newPostData = { ...this.postData };
        newPostData.oldusername = this.updateSelect;
        console.log(newPostData);
        let res = await this.$http.post(
          "/api/profile/changeuserinfo",
          newPostData
        );
        this.$store.dispatch("Notify", res.data.message);
        this.getUsers();
        this.$refs.form3.reset();
        this.updateConfirmation = false;
      } catch (error) {
        console.log("heere", error);
      }
      this.loading = false;
    },
    async deleteSubmit() {
      this.loading = true;
      console.log("Deleting...,", this.deleteSelect);
      try {
        let res = await this.$http.post("/api/auth/forceremoveuser", {
          username: this.deleteSelect.username,
        });
        this.$store.dispatch("Notify", res.data.message);
        this.getUsers();
        this.deleteSelect = {};
        this.deleteConfirmation = false;
      } catch (error) {}
      this.loading = false;
    },
    createClose() {
      this.create = false;
      this.$refs.form.reset();
    },
    updateClose() {
      this.updateConfirmation = false;
      this.updateSelect = {};
      this.$refs.form3.reset();
      if (this.$refs.form) this.$refs.form.resetValidation();
    },
  },
};
</script>

<style></style>
