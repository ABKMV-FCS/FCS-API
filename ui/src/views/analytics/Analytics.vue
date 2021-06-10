<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm11 md9 lg8 xl6>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Analytics</v-toolbar-title>
          </v-toolbar>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="5">
                  <v-select
                    v-model="dept"
                    item-text="dept"
                    :item-value="(elt) => elt.dept"
                    :items="depts"
                    label="Department"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="5">
                  <v-select
                    :disabled="!dept"
                    v-model="sem"
                    :items="
                      depts.find((o) => o.dept === dept) !== undefined
                        ? depts.find((o) => o.dept === dept).sems
                        : []
                    "
                    label="Semester"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="2">
                  <v-btn
                    color="primary"
                    :loading="loading"
                    :disabled="loading"
                    @click.prevent="changeBarGraph"
                    depressed
                    large
                    block
                    >Apply</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <apexchart
            type="bar"
            height="350"
            :options="barChartOptions"
            :series="barSeries"
          ></apexchart>
          <v-row align-content="center" justify="center">
            <v-col cols="12" sm="12" md="6">
              <apexchart
                type="pie"
                width="100%"
                height="350px"
                :options="chart1Options"
                :series="pieSeries1"
              ></apexchart>
            </v-col>
          </v-row>
          <v-row align-content="center" justify="center">
            <v-col cols="12" sm="12" md="6">
              <apexchart
                type="pie"
                width="100%"
                height="350px"
                :options="chart2Options"
                :series="pieSeries2"
              ></apexchart>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <apexchart
                type="pie"
                width="100%"
                height="350px"
                :options="chart3Options"
                :series="pieSeries3"
              ></apexchart>
            </v-col>
          </v-row>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      dept: null,
      sem: null,
      depts: [],
      bardata: {},
      barSeries: [],
      barChartOptions: {
        chart: {
          stacked: true,
        },
        xaxis: {
          type: "string",
          categories: [],
        },
        title: {
          text: "Hours taken by each Course in each Class",
        },
      },
      pieSeries1: [],
      chart1Options: {
        labels: [],
        title: {
          text: "No. of Faculties handling a Course",
        },
      },
      pieSeries2: [],
      chart2Options: {
        labels: [],
        title: {
          text: "No. of Hours Faculteis Work",
        },
      },
      pieSeries3: [],
      chart3Options: {
        labels: [],
        title: {
          text: "No. of Hours Faculties are Free",
        },
      },
    };
  },
  methods: {
    changeBarGraph() {
      this.barSeries = this.bardata[this.dept][this.sem]["series"];
      this.barChartOptions.xaxis.categories =
        this.bardata[this.dept][this.sem]["sections"];
      this.barChartOptions = { ...this.barChartOptions };
    },
  },
  async created() {
    this.loading = true;
    try {
      let bar = (await this.$http.get("/api/analytics/getclasscoursedetails"))
        .data.result;
      let pie1 = (await this.$http.get("/api/analytics/getcoursefaculties"))
        .data.result;
      let pie2 = (await this.$http.get("/api/analytics/getfacultyworkinghours"))
        .data.result;
      let pie3 = (await this.$http.get("/api/analytics/getfacultyfreehours"))
        .data.result;

      bar = bar.sort((a, b) =>
        a.sem > b.sem
          ? 1
          : b.sem > a.sem
          ? -1
          : a.section > b.section
          ? 1
          : b.section > a.section
          ? -1
          : 0
      );

      this.dept = bar[0].dept;
      this.sem = bar[0].sem;

      for (let data of bar) {
        if (this.bardata[data.dept] === undefined) {
          this.bardata[data.dept] = {};
          this.depts.push({
            dept: data.dept,
            sems: [],
          });
        }
        let bd = this.bardata[data.dept];
        if (bd[data.sem] === undefined) {
          bd[data.sem] = {
            sections: [],
            series: [],
          };
          let deptdown = await this.depts.find((o) => o.dept === data.dept);
          deptdown.sems.push(data.sem);
        }
        let bds = bd[data.sem];
        if (!bds.sections.includes(data.section.toUpperCase())) {
          bds.sections.push(data.section.toUpperCase());
        }
        let found = bds.series.find((o) => o.name === data.coursecode);
        if (found === undefined) {
          bds.series.push({
            name: data.coursecode,
            data: [data.totalhours],
          });
        } else {
          found.data.push(data.totalhours);
        }
      }

      this.barSeries = this.bardata[this.dept][this.sem]["series"];
      this.barChartOptions.xaxis.categories =
        this.bardata[this.dept][this.sem]["sections"];
      this.barChartOptions = { ...this.barChartOptions };

      for (let obj of pie1) {
        this.chart1Options.labels.push(String(obj.coursecode));
        this.pieSeries1.push(obj["count(faculty)"]);
      }

      for (let obj of pie2) {
        this.chart2Options.labels.push("Count: " + String(obj.hours));
        this.pieSeries2.push(obj.nooffaculties);
      }

      for (let obj of pie3) {
        this.chart3Options.labels.push("Count: " + String(obj.hours));
        this.pieSeries3.push(obj.nooffaculties);
      }
    } catch (err) {
      console.log(err);
      this.$store.dispatch("Notify", "Insufficient Data for Analytics!");
      this.$router.push("/Dashboard");
    }
    this.loading = false;
  },
};
</script>
