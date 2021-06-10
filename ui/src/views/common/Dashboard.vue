<template>
  <div>
    <v-container>
      <v-sheet v-if="Role === 'faculty'" tile height="54" class="d-flex">
        <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <span style="color: #1e1e1e"
          >{{ calendarDate | calendarDateString }}
        </span>
        <v-spacer></v-spacer>
        <span v-if="calendarError" style="color: red"
          >Calendar fetch failed</span
        >
        <v-btn icon class="ma-2" @click="$refs.calendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-sheet>
      <v-sheet
        v-if="Role === 'faculty'"
        height="600"
        style="margin-bottom: 15px"
      >
        <v-calendar
          ref="calendar"
          type="week"
          :events="events"
          v-model="value"
          :event-overlap-threshold="30"
          :event-color="getEventColor"
          @change="getEvents"
          @click:event="showEvent"
        >
          <template v-slot:day-body="{ date, week }">
            <div
              class="v-current-time"
              :class="{ first: date === week[0].date }"
              :style="{ top: nowY }"
            ></div>
          </template>
        </v-calendar>
      </v-sheet>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card color="grey lighten-4" flat>
          <v-toolbar :color="selectedEvent.color" dark>
            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
          </v-toolbar>
          <v-card-text style="white-space: break-spaces">
            <span v-html="selectedEvent.details"></span>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="secondary" @click="selectedOpen = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-row>
        <v-col v-if="Role === 'admin'" cols="12" sm="4" md="3">
          <v-card to="ManageUsers" hover>
            <v-card-title>Manage Users</v-card-title>
            <v-card-text>Manage All Users in the System</v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="Role === 'admin'" cols="12" sm="4" md="3">
          <v-card to="ManageTimeTable" hover>
            <v-card-title>Manage Time-Table</v-card-title>
            <v-card-text
              >Manage Departments, Semesters, Courses, Classes and Allocate
              Faculties and Time-Slots</v-card-text
            >
          </v-card>
        </v-col>
        <v-col v-if="Role === 'admin'" cols="12" sm="4" md="3">
          <v-card to="ManageExamSchedule" hover>
            <v-card-title>Manage Exam Schedule</v-card-title>
            <v-card-text>Schedule Exam for Different Departments</v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="Role === 'admin'" cols="12" sm="4" md="3">
          <v-card to="ManageFacultyCourses" hover>
            <v-card-title>Manage Faculty Courses</v-card-title>
            <v-card-text>Attach Courses to Faculty</v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="Role === 'admin'" cols="12" sm="4" md="3">
          <v-card to="EmergencyHoliday" hover>
            <v-card-title>Declare Emergency Holiday</v-card-title>
            <v-card-text
              >Declare an Emergency HOliday for a particular date</v-card-text
            >
          </v-card>
        </v-col>
        <v-col v-if="Role === 'faculty'" cols="12" sm="4" md="3">
          <v-card to="RequestOD" hover>
            <v-card-title>Request OD</v-card-title>
            <v-card-text>Request for a OD for a Range of Slots</v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="Role === 'admin'" cols="12" sm="4" md="3">
          <v-card to="ManageOD" hover>
            <v-card-title>Manage OD</v-card-title>
            <v-card-text>Manage OD Requests made by Faculties</v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="Role === 'faculty'" cols="12" sm="4" md="3">
          <v-card to="RequestLeave" hover>
            <v-card-title>Request Leave</v-card-title>
            <v-card-text>Request for a Leave for a Range of Days</v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="Role === 'admin'" cols="12" sm="4" md="3">
          <v-card to="ManageLeave" hover>
            <v-card-title>Manage Leave</v-card-title>
            <v-card-text>Manage Leave Requests made by Faculties</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <v-card to="RequestProfileChange" hover>
            <v-card-title>Request Profile Change</v-card-title>
            <v-card-text
              >Request for a Change in Profile Information</v-card-text
            >
          </v-card>
        </v-col>
        <v-col v-if="Role === 'admin'" cols="12" sm="4" md="3">
          <v-card to="ManageProfileChangeRequest" hover>
            <v-card-title>Manage Profile Change Request</v-card-title>
            <v-card-text>Approve/Reject Profile Change Requests</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <v-card to="ResetPassword" hover>
            <v-card-title>Reset Password Details</v-card-title>
            <v-card-text>Reset Password of your Profile</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <v-card to="Analytics" hover>
            <v-card-title>Analytics</v-card-title>
            <v-card-text>View Analytics of the Application</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      ready: false,
      value: "",
      calendarDate: null,
      calendarError: false,
      events: [],
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
    };
  },
  mounted() {
    if (this.Role === "faculty") {
      this.ready = true;
      this.scrollToTime();
    }
  },
  computed: {
    ...mapGetters(["Role"]),
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
  },
  methods: {
    getEventColor(event) {
      return event.color;
    },
    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0;
    },
    scrollToTime() {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);

      this.cal.scrollToTime(first);
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    async getEvents({ start, end }) {
      console.log(start, end);
      this.calendarDate = start.date;
      try {
        let res = await this.$http.post("/api/calendar/getcalendarevents", {
          forDate: start.date,
        });
        let ev = res.data.data;
        this.calendarError = false;
        this.events = ev;
      } catch (error) {
        this.calendarError = true;
        this.events = [];
      }
    },
  },
  filters: {
    calendarDateString: (arg) => {
      if (!arg) return "";
      let temp2 = arg;
      let temp = new Date(arg).toLocaleString("default", { month: "long" });
      return temp2.split("-")[0] + " " + temp;
    },
  },
};
</script>

<style lang="scss" scoped>
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: "";
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
</style>