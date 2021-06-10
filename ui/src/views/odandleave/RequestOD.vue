<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm11 md9 lg8 xl6>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Request OD</v-toolbar-title>
          </v-toolbar>
          <v-form ref="form" @submit.prevent="createSubmit">
            <v-card-text>
              <v-row justify="center">
                <v-col class="d-flex justify-center" md="6">
                  <v-date-picker v-model="postData.date"></v-date-picker>
                </v-col>
                <v-col md="6" style="display:flex;flex-direction:column;">
                  <v-select
                    :items="slots"
                    label="From Slot"
                    v-model="postData.fromslot"
                    :rules="requiredRule"
                  ></v-select>
                  <v-select
                    :items="toslots"
                    label="To Slot"
                    v-model="postData.toslot"
                    :disabled="postData.fromslot === null"
                    :rules="requiredRule"
                  ></v-select>
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
        date: null,
        fromslot: null,
        toslot: null
      },
      slots: [],
      toslots: [],
      loading: false,
      requiredRule: [(val) => !!val || "Required!"],
    };
  },
  async created() {
    this.fetchInitDetails();
  },
  watch: {
    'postData.fromslot': function() {
      this.toslots = this.slots.filter(element => { if(element >= this.postData.fromslot) return element; })
      this.postData.toslot = null;
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
        let res = await this.$http.post("/api/odandleave/requestod", this.postData);
        this.$store.dispatch("Notify", res.data.message);
        this.fetchInitDetails();
        this.$refs.form.reset()
      } catch (err) {
      }
      this.loading = false;
    },
    async fetchInitDetails() {
      this.postData = {
        reason: null,
        date: null,
        fromslot: null,
        toslot: null
      };
      try {
        this.loading = true;
        let res = await this.$http.get("/api/odandleave/getslotdetails");
        this.slots = Object.keys(res.data.slots);
        this.toslots = Object.keys(res.data.slots);
      } catch (err) {
        this.$router.push("/Dashboard");
      }
      this.loading = false;
    },
  },
};
</script>