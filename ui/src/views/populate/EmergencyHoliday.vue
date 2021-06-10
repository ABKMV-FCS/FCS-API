<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Declare Emergency Holiday</v-toolbar-title>
          </v-toolbar>
          <v-form ref="form" @submit="submit">
            <v-card-text>
              <v-menu
                v-model="menu"
                :close-on-content-click="true"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="postData.date"
                    label="Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="postData.date" @input.prevent="menu = false"></v-date-picker>
              </v-menu>
              <v-text-field
                label="Description"
                type="text"
                :rules="requiredRule"
                v-model="postData.description"
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
        date: null,
        description: null,
      },
      menu: false,
      loading: false,
      requiredRule: [(val) => !!val || "Required!"],
    };
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        let res = await this.$http.post("/api/emergencyholiday/createnewholiday", this.postData);
        this.$store.dispatch("Notify", res.data.message);
        this.$refs.form.reset()
      } catch (err) {}
      this.loading = false;
    },
  },
};
</script>

<style scoped></style>
