<template>
  <div>
    <v-form ref="form" @submit="submit">
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
      <v-select
        :items="semesters"
        label="Semester"
        v-model="postData.sem"
        :rules="requiredRule"
      ></v-select>
      <div v-if="departmentClasses">
        <v-select
          :items="Object.keys(departmentClasses)"
          label="Department"
          v-model="postData.dept"
          :rules="requiredRule"
        ></v-select>
        <div v-if="postData.dept">
          <v-select
            :items="departmentClasses[postData.dept]"
            label="Section"
            v-model="postData.section"
            :rules="requiredRule"
          ></v-select>
        </div>
      </div>

      <v-btn @click="submit" color="primary" class="ma-4" elevation="2"
        >submit</v-btn
      >
    </v-form>
  </div>
</template>


<script>
export default {
  data() {
    return {
      postData: {
        name: null,
        email: null,
        sem: null,
        dept: null,
        section: null,
        academic_year: null,
        fcmToken:null
      },
      requiredRule: [(val) => !!val || "Required!"],
      noofsems: 8,
      emailRule: [
        (v) =>
          (!!v && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)) ||
          "E-mail must be valid",
      ],
      semesters: [],
      departmentClasses: null,
      loading: false,
    };
  },
  async created() {
    this.getInitData();
  },
  methods: {
    async getInitData() {
      try {
        let res = await this.$http.get("/api/student/subscribeinit");
        this.semesters = [];
        for (let i = res.data.odd ? 1 : 2; i <= this.noofsems; i += 2)
          this.semesters.push(i);
        this.postData.academic_year = res.data.academic_year;
        this.departmentClasses = res.data.departmentClasses;
      } catch (error) {}
    },
    async submit() {
      if (!this.$refs.form.validate()) return;
      try {
        this.postData.fcmToken=this.$store.getters.fcmToken
        let res = await this.$http.post("/api/student/subscribe", this.postData);
        this.$store.dispatch("Notify", res.data.message);
      } catch (error) {}
    },
  },
};
</script>

<style>
</style>