<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm11 md9 lg8 xl6>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Request Profile Change</v-toolbar-title>
          </v-toolbar>
          <v-form ref="form" @submit.prevent="createSubmit">
            <v-card-text>
              <v-text-field
                label="Name"
                v-model="name"
                type="text"
                :rules="requiredRule"
              ></v-text-field>
              <v-text-field
                label="Email"
                v-model="email"
                type="email"
                :rules="emailRule"
              ></v-text-field>
              <v-text-field
                label="Phone Number"
                v-model="phone"
                type="number"
                :rules="phoneRule"
              ></v-text-field>
              <v-text-field
                label="Qualifications"
                v-model="qualifications"
                type="text"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                :loading="loading"
                :disabled="loading"
                @click.prevent="submit"
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
      qualifications: null,
      phone: null,
      name: null,
      email: null,
      loading: false,
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
  async created() {
    this.fetchInitDetails();
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return;
      try {
        this.loading = true;
        let res = await this.$http.post("/api/profile/requestprofilechange", {
          qualifications: this.qualifications,
          phone: this.phone,
          name: this.name,
          email: this.email,
        });
        this.$store.dispatch("Notify", res.data.message);
        this.fetchInitDetails();
      } catch (err) {
        this.$router.push("/Dashboard");
      }
      this.loading = false;
    },
    async fetchInitDetails() {
      try {
        this.loading = true;
        let res = await this.$http.get("/api/profile/initprofilechangedetails");
        this.qualifications = res.data.result.qualifications;
        this.phone = res.data.result.phone;
        this.name = res.data.result.name;
        this.email = res.data.result.email;
      } catch (err) {
        this.$router.push("/Dashboard");
      }
      this.loading = false;
    },
  },
};
</script>
