<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm11 md9 lg8 xl6>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Request Leave</v-toolbar-title>
          </v-toolbar>
          <v-form ref="form" @submit.prevent="createSubmit">
            <v-card-text>
              <v-row justify="center">
                <v-col class="d-flex justify-center" md="6">
                  <v-date-picker v-model="dates" scrollabe range></v-date-picker>
                </v-col>
              </v-row>
              <v-text-field
                label="Reason"
                v-model="postData.reason"
                type="text"
                :rules="requiredRule"
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
      postData: {
        reason: null,
        fromdate: null,
        todate: null,
      },
      dates: null,
      loading: false,
      requiredRule: [(val) => !!val || "Required!"],
    };
  },
  async created() {
    this.fetchInitDetails();
  },
  watch: {
    dates() {
      console.log(this.dates);
      if (this.dates.length === 1) {
        this.postData.fromdate = this.postData.todate = this.dates[0];
        return;
      } else if (this.dates.length === 2) {
        if (this.dates[0] > this.dates[1]) {
          let temp = this.dates[0];
          this.dates[0] = this.dates[1];
          this.dates[1] = temp;
        }
        this.postData.fromdate = this.dates[0];
        this.postData.todate = this.dates[1];
      }
    }
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return;
      if (this.postData.date === null) {
        this.$store.dispatch("Notify", "Please Enter a Date!");
        return
      }
      try {
        this.loading = true;
        let res = await this.$http.post("/api/odandleave/requestleave", this.postData);
        this.$store.dispatch("Notify", res.data.message);
        this.fetchInitDetails();
        this.$refs.form.reset()
        this.dates = null;
      } catch (err) {
      }
      this.loading = false;
    },
    async fetchInitDetails() {
      this.postData = {
        reason: null,
        fromdate: null,
        todate: null
      };
    },
  },
};
</script>