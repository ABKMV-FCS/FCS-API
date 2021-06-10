<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm11 md9 lg8 xl6>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Manage Exam Schedule</v-toolbar-title>
          </v-toolbar>
          <v-card-text
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              width: 100%;
            "
          >
            <v-select
              :items="['p1', 'p2', 'p3', 'endsem']"
              label="Type"
              v-model="examType"
              :rules="requiredRule"
            ></v-select>
            <v-select
              :disabled="!examType"
              :items="departments"
              label="Department"
              item-text="dept"
              :item-value="(elt) => elt"
              v-model="department"
              @change="getSemesters"
              :rules="requiredRule"
            ></v-select>
            <v-select
              :disabled="!department"
              :items="semesters"
              label="Semester"
              v-model="semester"
              :rules="requiredRule"
            >
            </v-select>
            <v-date-picker v-model="dates" scrollabe range></v-date-picker>
            <div v-if="enumeratedDates">
              <v-data-table
                :headers="FormatHeader(sections)"
                :items="[{}]"
                :items-per-page="-1"
                :hide-default-footer="true"
                class="elevation-1"
              >
                <template v-slot:item="{}">
                  <tr
                    v-for="(currdate, enind) in enumeratedDates"
                    :key="currdate"
                  >
                    <td>{{ currdate }}</td>
                    <td
                      class="text-start"
                      v-for="(section, secind) in sections"
                      :key="secind"
                    >
                      <v-select
                        :items="faculties"
                        item-text="name"
                        item-value="faculty"
                        label="Faculty"
                        v-model="examSlot[enind][secind]['faculty']"
                      >
                      </v-select>
                      <v-select
                        :items="courses"
                        label="CourseCode"
                        v-model="examSlot[enind][secind]['courseCode']"
                      >
                      </v-select>
                      <v-select
                        :items="examSlotsAvailable"
                        label="Slot"
                        v-model="examSlot[enind][secind]['slot']"
                      >
                      </v-select>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
          <v-layout justify-center>
            <v-btn @click="submit" color="primary" class="ma-4" elevation="2"
              >submit</v-btn
            >
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from "moment";
export default {
  data: () => ({
    loading: false,
    examType: null,
    semesters: [],
    semester: null,
    dates: [],
    startDate: null,
    endDate: null,
    examSlot: [],
    examSlotsAvailable: [],
    departments: [],
    department: null,
    sections: [],
    courses: [],
    faculties: [],
    enumeratedDates: null,
    academicYear: null,
    requiredRule: [(val) => !!val || "Required!"],
  }),
  watch: {
    async dates() {
      console.log(this.dates);
      if (this.dates.length === 1) {
        this.startDate = this.endDate = this.dates[0];
        return;
      } else if (this.dates.length === 2) {
        if (this.dates[0] > this.dates[1]) {
          let temp = this.dates[0];
          this.dates[0] = this.dates[1];
          this.dates[1] = temp;
        }
        this.startDate = this.dates[0];
        this.endDate = this.dates[1];
        if (this.semester === null) return;
        try {
          let res = await this.$http.post("/api/examschedule/getexamschedule", {
            type: this.examType,
            dept: this.department.dept,
            sem: this.semester,
            startdate: this.startDate,
            enddate: this.endDate,
          });
          let result = res.data.result;
          this.faculties = res.data.faculties;
          this.sections = res.data.sections;
          this.courses = res.data.courses;
          this.examSlotsAvailable = res.data.totalslot;
          this.academicYear = res.data.academic_year;
          let from = new Date(this.startDate);
          let to = new Date(this.endDate);
          this.examSlot = [];
          this.enumeratedDates = [];
          for (let day = from; day <= to; day.setDate(day.getDate() + 1)) {
            this.enumeratedDates.push(
              moment(new Date(day)).utc(true).format("yyyy-MM-DD")
            );
            this.examSlot.push(Array(this.sections.length));
            for (let section in this.sections) {
              this.examSlot[this.examSlot.length - 1][section] = {
                faculty: null,
                courseCode: null,
                slot: null,
              };
            }
          }
          for (let item of result) {
            let row = this.enumeratedDates.indexOf(item.date);
            let column = res.data.sections.indexOf(item.section);
            this.examSlot[row][column]["slot"] = item.exam_slot;
            this.examSlot[row][column]["courseCode"] = item.coursecode;
            this.examSlot[row][column]["faculty"] = item.faculty;
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  methods: {
    async submit() {
      //  error check
      let postData = {
        startDate: this.startDate,
        endDate: this.endDate,
        es: [],
        sem: this.semester,
        dept: this.department.dept,
      };
      try {
        let columncode = {};
        for (let i = 0; i < this.examSlot.length; i++) {
          let samefaculty = {};
          for (let j = 0; j < this.examSlot[i].length; j++) {
            if (
              this.examSlot[i][j]["slot"] === null &&
              this.examSlot[i][j]["courseCode"] === null &&
              this.examSlot[i][j]["faculty"] === null
            )
              continue;
            else if (
              this.examSlot[i][j]["slot"] === null ||
              this.examSlot[i][j]["courseCode"] === null ||
              this.examSlot[i][j]["faculty"] === null
            )
              throw new Error("Invalid Data");
            else {
              if (samefaculty[this.examSlot[i][j]["faculty"]] !== undefined) {
                if (
                  samefaculty[this.examSlot[i][j]["faculty"]] ===
                  this.examSlot[i][j]["slot"]
                )
                  throw new Error("Invalid Slot on Same Day");
              } else
                samefaculty[this.examSlot[i][j]["faculty"]] =
                  this.examSlot[i][j]["slot"];
              if (
                columncode[j] !== undefined &&
                columncode[j].includes(this.examSlot[i][j]["courseCode"])
              ) {
                throw new Error("Invalid Exam Schedule");
              } else {
                if (columncode[j] === undefined) {
                  columncode[j] = [];
                }
                columncode[j].push(this.examSlot[i][j]["courseCode"]);
              }
            }
            console.log(columncode);
            postData.es.push([
              this.enumeratedDates[i],
              this.examSlot[i][j]["slot"],
              this.examSlot[i][j]["courseCode"],
              this.semester,
              this.department.dept,
              this.examSlot[i][j]["faculty"],
              this.examType,
              this.sections[j],
              this.academicYear,
            ]);
          }
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch("Notify", String(error));
        return;
      }
      try {
        let res = await this.$http.post(
          "/api/examschedule/examscheduleinit",
          postData
        );
        this.$store.dispatch("Notify", String(res.data.message));
      } catch (error) {}
    },
    FormatHeader(sections) {
      let header = [];
      header.push({
        text: "",
        align: "start",
        sortable: false,
        value: "currdate",
      });
      for (let section of Object.values(sections)) {
        header.push({
          text: section,
          sortable: false,
          value: section,
        });
      }
      return header;
    },
    async getSemesters() {
      this.loading = true;
      this.noofsems = this.department.sems;
      try {
        let flag = (await this.$http.get("/api/timetable/getactivesem")).data
          .odd;
        this.semesters = [];
        if (flag) {
          for (let i = 1; i <= this.noofsems; i += 2)
            this.semesters.push({ text: i, value: i });
        } else {
          for (let i = 2; i <= this.noofsems; i += 2)
            this.semesters.push({ text: i, value: i });
        }
      } catch (err) {}
      this.loading = false;
    },
  },
  async created() {
    this.loading = true;
    try {
      this.departments = (
        await this.$http.get("/api/timetable/readdept")
      ).data.departments;
    } catch (err) {}
    this.loading = false;
  },
};
</script>

<style>
</style>