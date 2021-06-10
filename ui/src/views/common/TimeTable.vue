<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-row justify="center" v-if="!option">
        <v-col cols="12" sm="4">
          <v-card
            @click.prevent="
              option = 'student';
              getDepartments();
            "
            hover
          >
            <v-card-title>Class TimeTable</v-card-title>
            <v-card-subtitle>Download TimeTable of One Section</v-card-subtitle>
            <v-card-text></v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card
            @click.prevent="
              option = 'faculty';
              getFaculty();
            "
            hover
          >
            <v-card-title>Faculty TimeTable</v-card-title>
            <v-card-subtitle>Download TimeTable of a Faculty</v-card-subtitle>
            <v-card-text></v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card
            @click.prevent="
              option = 'exam';
              getExam();
            "
            hover
          >
            <v-card-title>Exam TimeTable</v-card-title>
            <v-card-subtitle>Download TimeTable of Exams</v-card-subtitle>
            <v-card-text></v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-flex xs12 sm8 md7 lg8 xl5 v-if="option == 'student'">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-btn class="mx-2" fab dark small color="secondary">
              <v-icon
                dark
                :loading="loading"
                :disabled="loading"
                @click.prevent="postSubmit(1)"
                block
                >mdi-arrow-left</v-icon
              >
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title>Class Time Table Download</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <v-select
                v-model="postData.dept"
                item-text="dept"
                :item-value="(elt) => elt"
                :items="departments"
                label="Department"
                @change="getSemesters(0)"
                :rules="requiredRule"
              ></v-select>
              <v-select
                :disabled="!postData.dept"
                v-model="postData.sem"
                :items="semesters"
                label="Semester"
                @change="getSections"
                :rules="requiredRule"
              ></v-select>
              <v-select
                :disabled="!postData.sem"
                v-model="postData.sec"
                item-text="section"
                item-value="section"
                :items="sections"
                label="Section"
                :rules="requiredRule"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="loading"
              @click.prevent="studentSubmit"
              depressed
              large
              block
              >submit</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-flex xs12 sm8 md7 lg8 xl5 v-if="option == 'faculty'">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-btn class="mx-2" fab dark small color="secondary">
              <v-icon
                dark
                :loading="loading"
                :disabled="loading"
                @click.prevent="postSubmit(0)"
                block
                >mdi-arrow-left</v-icon
              >
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title>Faculty Time Table Download</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form1">
              <v-select
                v-model="faculty"
                item-text="name"
                item-value="faculty"
                :items="faculties"
                label="Faculty"
                :rules="requiredRule"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="loading"
              @click.prevent="facultySubmit"
              depressed
              large
              block
              >submit</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-flex xs12 sm8 md7 lg8 xl5 v-if="option == 'exam'">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-btn class="mx-2" fab dark small color="secondary">
              <v-icon
                dark
                :loading="loading"
                :disabled="loading"
                @click.prevent="postSubmit(2)"
                block
                >mdi-arrow-left</v-icon
              >
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title>Exam Time Table Download</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form2">
              <v-select
                :items="['p1', 'p2', 'p3', 'endsem']"
                label="Type"
                v-model="examPostData.type"
                :rules="requiredRule"
              ></v-select>
              <v-select
                v-model="examPostData.sem"
                :items="semesters"
                label="Semester"
                :rules="requiredRule"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="loading"
              @click.prevent="examSubmit"
              depressed
              large
              block
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
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  data() {
    return {
      postData: {
        dept: null,
        sem: null,
        sec: null,
      },
      examPostData: {
        sem: null,
        type: null,
      },
      examtypes: [],
      noofsems: null,
      faculty: null,
      faculties: [],
      departments: [],
      semesters: [],
      sections: [],
      option: null,
      loading: false,
      requiredRule: [(val) => !!val || "Required!"],
    };
  },
  created() {
    // this.getDepartments();
  },
  methods: {
    downloadExamTT(timetable, examtypes) {
      var doc = new jsPDF("l", "mm", [297, 210]);
      let title = `Sem-${this.examPostData.sem}-${this.examPostData.type}-timetable`;
      let cols = [
        {
          header: "Date",
          dataKey: "date",
        },
      ];
      let depts = timetable.map((a) => a.dept);
      depts = depts.filter((item, i, ar) => ar.indexOf(item) === i);
      for (let dept of depts) {
        cols.push({
          header: dept,
          dataKey: dept,
        });
      }
      let rows = [];
      timetable.sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        if (a.exam_slot < b.exam_slot) return -1;
        if (a.exam_slot > b.exam_slot) return 1;
        return 0;
      });
      let prevdate = null;
      let prevslot = null;
      for (let data of timetable) {
        if (data.date == prevdate && data.exam_slot == prevslot) {
          let i = rows.length - 1;
          rows[i][
            data.dept
          ] = `${data.coursecode}\nSec: ${data.section}\n${data.faculty}`;
        } else {
          rows.push({
            date: `${data.date}\nSlot ${data.exam_slot[2]}: ${
              examtypes[data.exam_slot]
            }`,
            [data.dept]: `${data.coursecode}\nSec: ${data.section}\n${data.faculty}`,
          });
          prevdate = data.date;
          prevslot = data.exam_slot;
        }
      }
      doc.autoTable({
        body: rows,
        columns: cols,
        theme: "grid",
        styles: {
          halign: "center",
          minCellWidth: 25,
          minCellHeight: 20,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: 40,
          lineColor: 255,
          lineWidth: 1,
        },
        startY: 42,
        didDrawPage: (data) => {
          data.doc.setFontSize(18);
          data.doc.setTextColor(40);
          data.doc.text("Exam Time Table", 125, 20);
          data.doc.setFontSize(12);
          data.doc.text(
            `Sem: ${timetable[0].sem}  Exam: ${timetable[0].type} `,
            225,
            30
          );
        },
      });
      let w = window.open(URL.createObjectURL(doc.output("blob")));
      setTimeout(() => {
        w.document.title = `${title}.pdf`;
      }, 1000);
    },
    downloadFacultyTT(timetable) {
      var doc = new jsPDF("l", "mm", [297, 210]);
      let title = `${this.faculty}-timetable`;
      let cols = [
        {
          header: "",
          dataKey: "day",
        },
        {
          header: "Slot 1",
          dataKey: "slot1",
        },
        {
          header: "Slot 2",
          dataKey: "slot2",
        },
        {
          header: "Slot 3",
          dataKey: "slot3",
        },
        {
          header: "Slot 4",
          dataKey: "slot4",
        },
        {
          header: "Slot 5",
          dataKey: "slot5",
        },
        {
          header: "Slot 6",
          dataKey: "slot6",
        },
      ];
      let rows = [
        {
          day: "Monday",
          slot1: "",
          slot2: "",
          slot3: "",
          slot4: "",
          slot5: "",
          slot6: "",
        },
        {
          day: "Tuesday",
          slot1: "",
          slot2: "",
          slot3: "",
          slot4: "",
          slot5: "",
          slot6: "",
        },
        {
          day: "Wednesday",
          slot1: "",
          slot2: "",
          slot3: "",
          slot4: "",
          slot5: "",
          slot6: "",
        },
        {
          day: "Thursday",
          slot1: "",
          slot2: "",
          slot3: "",
          slot4: "",
          slot5: "",
          slot6: "",
        },
        {
          day: "Friday",
          slot1: "",
          slot2: "",
          slot3: "",
          slot4: "",
          slot5: "",
          slot6: "",
        },
      ];
      let daymap = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4 };
      console.log(timetable);
      for (let data of timetable) {
        rows[daymap[data.day]][
          `slot${data.slot}`
        ] = `${data.coursename}\n${data.coursecode}`;
      }
      console.log(rows, cols);
      doc.autoTable({
        body: rows,
        columns: cols,
        theme: "grid",
        styles: {
          halign: "center",
          minCellWidth: 25,
          minCellHeight: 20,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: 40,
          lineColor: 255,
          lineWidth: 1,
        },
        startY: 42,
        didDrawPage: (data) => {
          console.log(data);
          data.doc.setFontSize(18);
          data.doc.setTextColor(40);
          data.doc.text("Faculty Time Table", 125, 20);
          data.doc.setFontSize(12);
          data.doc.text(
            `Dept: ${timetable[0].dept}   Sem: ${timetable[0].sem}  Sec: ${timetable[0].section} `,
            225,
            30
          );
          data.doc.text(`Faculty: ${title.split("-")[0]}`, 225, 35);
        },
      });
      let w = window.open(URL.createObjectURL(doc.output("blob")));
      setTimeout(() => {
        w.document.title = `${title}.pdf`;
      }, 1000);
    },
    downloadStudentTT(timetable) {
      var doc = new jsPDF("l", "mm", [297, 210]);
      let title = `${this.postData.dept.dept}-${this.postData.sec}-Sem-${this.postData.sem}-timetable`;
      let cols = [
        {
          header: "",
          dataKey: "day",
        },
        {
          header: "Slot 1",
          dataKey: "slot1",
        },
        {
          header: "Slot 2",
          dataKey: "slot2",
        },
        {
          header: "Slot 3",
          dataKey: "slot3",
        },
        {
          header: "Slot 4",
          dataKey: "slot4",
        },
        {
          header: "Slot 5",
          dataKey: "slot5",
        },
        {
          header: "Slot 6",
          dataKey: "slot6",
        },
      ];
      let rows = [
        {
          day: "Monday",
          slot1: "",
          slot2: "",
          slot3: "",
          slot4: "",
          slot5: "",
          slot6: "",
        },
        {
          day: "Tuesday",
          slot1: "",
          slot2: "",
          slot3: "",
          slot4: "",
          slot5: "",
          slot6: "",
        },
        {
          day: "Wednesday",
          slot1: "",
          slot2: "",
          slot3: "",
          slot4: "",
          slot5: "",
          slot6: "",
        },
        {
          day: "Thursday",
          slot1: "",
          slot2: "",
          slot3: "",
          slot4: "",
          slot5: "",
          slot6: "",
        },
        {
          day: "Friday",
          slot1: "",
          slot2: "",
          slot3: "",
          slot4: "",
          slot5: "",
          slot6: "",
        },
      ];
      let daymap = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4 };
      console.log(timetable);
      for (let data of timetable) {
        rows[daymap[data.day]][
          `slot${data.slot}`
        ] = `${data.coursename}\n${data.coursecode}`;
      }
      console.log(rows, cols);
      doc.autoTable({
        body: rows,
        columns: cols,
        theme: "grid",
        styles: {
          halign: "center",
          minCellWidth: 25,
          minCellHeight: 20,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: 40,
          lineColor: 255,
          lineWidth: 1,
        },
        startY: 40,
        didDrawPage: (data) => {
          console.log(data);
          data.doc.setFontSize(18);
          data.doc.setTextColor(40);
          data.doc.text("Class Time Table", 125, 20);
          data.doc.setFontSize(12);
          data.doc.text(
            `Dept: ${this.postData.dept.dept}   Sem: ${this.postData.sem}  Sec: ${this.postData.sec} `,
            225,
            30
          );
        },
      });
      let w = window.open(URL.createObjectURL(doc.output("blob")));
      setTimeout(() => {
        w.document.title = `${title}.pdf`;
      }, 1000);
    },
    async getDepartments() {
      this.loading = true;
      try {
        this.departments = (
          await this.$http.get("/api/timetable/readdept")
        ).data.departments;
      } catch (err) {}
      this.loading = false;
    },
    async getSemesters(flag) {
      this.loading = true;
      if (flag) this.noofsems = this.examPostData.dept.sems;
      else this.noofsems = this.postData.dept.sems;
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
    async getSections() {
      this.loading = true;
      try {
        this.sections = (
          await this.$http.get(
            `/api/timetable/readclassesunderdept/${this.postData.dept.dept}`
          )
        ).data.sections;
      } catch (err) {}
      this.loading = false;
    },
    async getFaculty() {
      this.loading = true;
      try {
        this.faculties = (
          await this.$http.get(`/api/timetable/readfaculty`)
        ).data.faculties;
      } catch (err) {}
      this.loading = false;
    },
    async getExam() {
      this.loading = true;
      try {
        let flag = (await this.$http.get("/api/timetable/getactivesem")).data
          .odd;
        this.semesters = [];
        if (flag) {
          for (let i = 1; i <= 8; i += 2)
            this.semesters.push({ text: i, value: i });
        } else {
          for (let i = 2; i <= 8; i += 2)
            this.semesters.push({ text: i, value: i });
        }
      } catch (err) {}
      this.loading = false;
    },
    async studentSubmit() {
      this.loading = true;
      try {
        let res = await this.$http.post(
          `/api/timetable/studenttimetabledownload`,
          {
            ...this.postData,
            dept: this.postData.dept.dept,
          }
        );
        this.$store.dispatch("Notify", res.data.message);
        if (res.data.message !== "no data available")
          this.downloadStudentTT(res.data.timetable);
        this.postSubmit(1);
      } catch (err) {}
      this.loading = false;
    },
    async facultySubmit() {
      this.loading = true;
      try {
        let res = await this.$http.post(
          `/api/timetable/facultytimetabledownload`,
          {
            faculty: this.faculty,
          }
        );
        this.$store.dispatch("Notify", res.data.message);
        if (res.data.message !== "faculties not found")
          this.downloadFacultyTT(res.data.timetable);
        this.postSubmit(0);
      } catch (err) {}
      this.loading = false;
    },
    async examSubmit() {
      this.loading = true;
      try {
        let res = await this.$http.post(
          `/api/examschedule/downloadexamschedule`,
          this.examPostData
        );
        this.$store.dispatch("Notify", res.data.message);
        if (res.data.message !== "no data available")
          this.downloadExamTT(res.data.timetable, res.data.examtypes);
        this.postSubmit(2);
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },
    postSubmit(flag) {
      this.loading = false;
      if (flag == 1) this.$refs.form.reset();
      else if (flag == 2) this.$refs.form2.reset();
      else this.$refs.form1.reset();
      this.option = null;
    },
  },
};
</script>

<style></style>
