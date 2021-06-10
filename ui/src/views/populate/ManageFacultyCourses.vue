<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md7 lg8 xl5>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Manage Faculty Courses</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <v-select
                v-model="postData.faculty"
                item-text="name"
                item-value="faculty"
                :items="faculties"
                label="Faculty"
                :rules="requiredRule"
                @change="getExistingCourses"
              ></v-select>
              <v-select
                :items="courses"
                v-model="postData.coursecodes"
                label="Courses"
                :item-text="(item) => `${item.coursecode} - ${item.name}`"
                :item-value="(item) => item.coursecode"
                multiple
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click.prevent="Submit" depressed large block
              >submit</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
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
        faculty: null,
        coursecodes: [],
      },
      faculties: [],
      courses: [],
      requiredRule: [(val) => !!val || "Required!"],
    };
  },
  async created() {
    await this.getFaculties();
    await this.getCourses();
  },
  methods: {
    async getFaculties() {
      try {
        this.faculties = (
          await this.$http.get(`/api/profile/getallfaculties`)
        ).data.faculties;
      } catch (err) {}
    },
    async getCourses() {
      try {
        this.courses = (
          await this.$http.get("/api/timetable/readcourses")
        ).data.courses;
      } catch (err) {}
    },
    async getExistingCourses() {
      try {
        let res = (
          await this.$http.get(
            `/api/profile/readsubjectshandledinfo/${this.postData.faculty}`
          )
        ).data.subjects_handledinfo;
        this.postData.coursecodes = [];
        for (let data of res) {
          this.postData.coursecodes.push(data.coursecode);
        }
      } catch (err) {}
    },
    async Submit() {
      if (!this.$refs.form.validate()) return;
      try {
        let res = await this.$http.post(
          `/api/profile/changesubjectshandledinfo`,
          this.postData
        );
        this.$store.dispatch("Notify", res.data.message);
        this.$refs.form.reset();
      } catch (err) {}
    },
  },
};
</script>
