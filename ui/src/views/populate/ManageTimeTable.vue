<template>
  <v-stepper v-model="stepNumber">
    <v-stepper-header>
      <v-stepper-step
        :complete="stepNumber > 1"
        edit-icon="mdi-filter"
        editable
        @click.prevent="
          deptFilter = null;
          semFilter = null;
          secFilter = null;
          noofsems = null;
        "
        step="1"
      >
        Department
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        :editable="stepNumber > 1"
        :complete="stepNumber > 2"
        edit-icon="mdi-filter"
        @click.prevent="
          semFilter = null;
          secFilter = null;
        "
        step="2"
      >
        Semester
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        :editable="stepNumber > 2"
        :complete="stepNumber > 3"
        edit-icon="mdi-filter"
        @click.prevent="secFilter = null"
        step="3"
      >
        Section
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        :editable="stepNumber > 3"
        complete
        complete-icon="mdi-calendar-lock-outline"
        edit-icon="mdi-calendar-edit"
        step="4"
      >
        Manage Time Table
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card class="mb-12" color="grey lighten-1">
          <v-layout justify-center>
            <v-card-title>
              <span class="headline">Select Department</span>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="createDept" persistent max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  style="margin: 16px"
                  color="success"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  tile
                >
                  <v-icon left>mdi-plus-circle-outline</v-icon>Create
                  Departments
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Create Department</span>
                </v-card-title>
                <v-form ref="form" @submit.prevent="createDeptSubmit">
                  <v-card-text>
                    <v-text-field
                      label="Department Name"
                      v-model="deptPostData.dept"
                      type="text"
                      :rules="requiredRule"
                    ></v-text-field>
                    <v-text-field
                      label="No. of Semesters"
                      v-model="deptPostData.sems"
                      type="number"
                      :rules="requiredRule"
                    ></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click.prevent="createClose"
                      >Close</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      :loading="loading"
                      :disabled="loading"
                      @click.prevent="createDeptSubmit"
                      >Submit</v-btn
                    >
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-layout>
          <v-container>
            <v-row>
              <v-col
                v-for="(dept, i) in departments"
                :key="i"
                cols="12"
                sm="4"
                md="3"
              >
                <v-card
                  @click.prevent="
                    stepNumber = 2;
                    deptFilter = dept.dept;
                    noofsems = dept.sems;
                    getSemesters();
                  "
                  hover
                >
                  <v-card-title
                    >{{ dept.dept }}
                    <v-spacer></v-spacer>
                    <v-dialog
                      :retain-focus="false"
                      v-model="updateConfirmation"
                      persistent
                      max-width="600px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          medium
                          v-bind="attrs"
                          v-on="on"
                          @click.prevent="
                            deptPostData = { ...dept };
                            updateSelect = deptPostData.dept;
                          "
                          color="black"
                          >mdi-pencil-box</v-icon
                        >
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="headline">Update Department</span>
                        </v-card-title>
                        <v-form
                          ref="form3"
                          @submit.prevent="updateDeptSubmit(i)"
                        >
                          <v-card-text>
                            <v-text-field
                              label="Department Name"
                              v-model="deptPostData.dept"
                              type="text"
                              :rules="requiredRule"
                            ></v-text-field>
                            <v-text-field
                              label="No. of Semesters"
                              v-model="deptPostData.sems"
                              type="number"
                              :rules="requiredRule"
                            ></v-text-field>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="blue darken-1"
                              text
                              @click="updateClose(i)"
                              >Close</v-btn
                            >
                            <v-btn
                              color="blue darken-1"
                              text
                              :loading="loading"
                              :disabled="loading"
                              @click.prevent="updateDeptSubmit(i)"
                              >Submit</v-btn
                            >
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-dialog>
                    <v-dialog
                      :retain-focus="false"
                      v-model="deleteConfirmation"
                      persistent
                      max-width="600px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          medium
                          v-bind="attrs"
                          v-on="on"
                          @click.prevent="deleteSelect = dept"
                          color="red"
                          >mdi-close-box</v-icon
                        >
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class>Delete Department</span>
                        </v-card-title>
                        <v-form
                          ref="form2"
                          @submit.prevent="deleteDeptSubmit()"
                        >
                          <v-card-text class="headline"
                            >Are You Sure You Want to Delete the Department:
                            {{ dept.dept }} ?</v-card-text
                          >
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="green darken-1"
                              text
                              @click.prevent="
                                deleteConfirmation = false;
                                deleteSelect = null;
                              "
                              >NO</v-btn
                            >
                            <v-btn
                              color="red darken-1"
                              text
                              :loading="loading"
                              :disabled="loading"
                              @click.prevent="deleteDeptSubmit()"
                              >YES</v-btn
                            >
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-dialog>
                  </v-card-title>
                  <v-card-text>No. of Semesters: {{ dept.sems }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-12" color="grey lighten-1">
          <v-layout justify-center>
            <v-card-title>
              <span class="headline">Select Semester</span>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="createCourses" persistent max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  style="margin: 16px"
                  color="success"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  tile
                >
                  <v-icon left>mdi-plus-circle-outline</v-icon>Create Courses
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Add Courses</span>
                </v-card-title>
                <v-form ref="form4" @submit.prevent="createCourseSubmit">
                  <v-card-text>
                    <v-text-field
                      label="Course Code"
                      v-model="coursePostData.coursecode"
                      type="text"
                      :rules="requiredRule"
                    ></v-text-field>
                    <v-text-field
                      label="Course Name"
                      v-model="coursePostData.name"
                      type="text"
                      :rules="requiredRule"
                    ></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click.prevent="createCourseClose"
                      >Close</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      :loading="loading"
                      :disabled="loading"
                      @click.prevent="createCourseSubmit"
                      >Submit</v-btn
                    >
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>

            <v-dialog
              :retain-focus="false"
              v-model="updateCourseConfirmation"
              persistent
              max-width="600px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  style="margin: 16px"
                  color="black"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  tile
                >
                  <v-icon left>mdi-plus-circle-outline</v-icon>Update Courses
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Update Courses</span>
                </v-card-title>
                <v-form ref="form5" @submit.prevent="updateCourseSubmit()">
                  <v-card-text>
                    <v-select
                      :items="courses"
                      v-model="updateSelect"
                      label="Course"
                      :item-text="(item) => `${item.coursecode} - ${item.name}`"
                      :item-value="(item) => item"
                      @input="(item) => (coursePostData = { ...item })"
                    ></v-select>
                    <v-text-field
                      v-if="updateSelect"
                      label="Course Code"
                      v-model="coursePostData.coursecode"
                      type="text"
                      :rules="requiredRule"
                    ></v-text-field>
                    <v-text-field
                      v-if="updateSelect"
                      label="Course Name"
                      v-model="coursePostData.name"
                      type="text"
                      :rules="requiredRule"
                    ></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="updateCourseClose"
                      >Close</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      :loading="loading"
                      :disabled="loading || !updateSelect"
                      @click.prevent="updateCourseSubmit()"
                      >Submit</v-btn
                    >
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>

            <v-dialog
              :retain-focus="false"
              v-model="deleteCourseConfirmation"
              persistent
              max-width="600px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  style="margin: 16px"
                  color="error"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  tile
                >
                  <v-icon left>mdi-plus-circle-outline</v-icon>Delete Course
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Delete Course</span>
                </v-card-title>
                <v-form ref="form6" @submit.prevent="deleteCourseSubmit">
                  <v-card-text>
                    <v-select
                      :items="courses"
                      v-model="deleteSelect"
                      label="Course"
                      :item-text="(item) => `${item.coursecode} - ${item.name}`"
                      :item-value="(item) => item.coursecode"
                    ></v-select>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="deleteCourseClose"
                      >Close</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      :loading="loading"
                      :disabled="loading || !deleteSelect"
                      @click.prevent="deleteCourseSubmit"
                      >Submit</v-btn
                    >
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
            <v-dialog
              :retain-focus="false"
              v-model="attachCourseConfirmation"
              persistent
              max-width="600px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  style="margin: 16px"
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  tile
                >
                  <v-icon left>mdi-plus-circle-outline</v-icon>Attach Courses
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Attach Course</span>
                </v-card-title>
                <v-form ref="form7" @submit.prevent="attachCourseSubmit()">
                  <v-card-text>
                    <v-select
                      :items="semesters"
                      v-model="attachPostData.sem"
                      label="Semester"
                      @input="getCurrentlyAttached"
                    ></v-select>
                    <v-select
                      :items="courses"
                      v-model="attachPostData.coursecodes"
                      label="Courses"
                      :item-text="(item) => `${item.coursecode} - ${item.name}`"
                      :item-value="(item) => item.coursecode"
                      multiple
                    ></v-select>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="attachCourseClose"
                      >Close</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      :loading="loading"
                      :disabled="loading"
                      @click.prevent="attachCourseSubmit()"
                      >Submit</v-btn
                    >
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-layout>
          <v-container>
            <v-row>
              <v-col
                v-for="sems in semesters"
                :key="sems"
                cols="12"
                sm="4"
                md="3"
              >
                <v-card
                  @click.prevent="
                    stepNumber = 3;
                    semFilter = sems;
                    getSections();
                  "
                  hover
                >
                  <v-card-title>{{ sems }} </v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-12" color="grey lighten-1">
          <v-layout justify-center>
            <v-card-title>
              <span class="headline">Select Section</span>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="createSection" persistent max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  style="margin: 16px"
                  color="success"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  tile
                >
                  <v-icon left>mdi-plus-circle-outline</v-icon>Create Sections
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Create Sections</span>
                </v-card-title>
                <v-form ref="form8" @submit.prevent="createSectionSubmit">
                  <v-card-text>
                    <v-text-field
                      label="Section Name"
                      v-model="sectionPostData.section"
                      type="text"
                      :rules="requiredRule"
                    ></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click.prevent="createSectionClose"
                      >Close</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      :loading="loading"
                      :disabled="loading"
                      @click.prevent="createSectionSubmit"
                      >Submit</v-btn
                    >
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-layout>
          <v-container>
            <v-row>
              <v-col
                v-for="(sec, i) in sections"
                :key="i"
                cols="12"
                sm="4"
                md="3"
              >
                <v-card
                  @click.prevent="
                    stepNumber = 4;
                    secFilter = sec.section;
                    getTimeTableInit();
                  "
                  hover
                >
                  <v-card-title
                    >{{ sec.section }}
                    <v-spacer></v-spacer>
                    <v-dialog
                      :retain-focus="false"
                      v-model="updateSectionConfirmation"
                      persistent
                      max-width="600px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          medium
                          v-bind="attrs"
                          v-on="on"
                          @click.prevent="
                            sectionPostData = { ...sec };
                            updateSelect = sectionPostData.section;
                          "
                          color="black"
                          >mdi-pencil-box</v-icon
                        >
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="headline">Update Section</span>
                        </v-card-title>
                        <v-form
                          ref="form9"
                          @submit.prevent="updateSectionSubmit(i)"
                        >
                          <v-card-text>
                            <v-text-field
                              label="Section Name"
                              v-model="sectionPostData.section"
                              type="text"
                              :rules="requiredRule"
                            ></v-text-field>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="blue darken-1"
                              text
                              @click="updateSectionClose(i)"
                              >Close</v-btn
                            >
                            <v-btn
                              color="blue darken-1"
                              text
                              :loading="loading"
                              :disabled="loading"
                              @click.prevent="updateSectionSubmit(i)"
                              >Submit</v-btn
                            >
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-dialog>
                    <v-dialog
                      :retain-focus="false"
                      v-model="deleteSectionConfirmation"
                      persistent
                      max-width="600px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          medium
                          v-bind="attrs"
                          v-on="on"
                          @click.prevent="deleteSelect = sec.section"
                          color="red"
                          >mdi-close-box</v-icon
                        >
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class>Delete Section</span>
                        </v-card-title>
                        <v-form
                          ref="form10"
                          @submit.prevent="deleteSectionSubmit()"
                        >
                          <v-card-text class="headline"
                            >Are You Sure You Want to Delete the Section:
                            {{ sec.section }} ?</v-card-text
                          >
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="green darken-1"
                              text
                              @click.prevent="
                                deleteSectionConfirmation = false;
                                deleteSelect = null;
                              "
                              >NO</v-btn
                            >
                            <v-btn
                              color="red darken-1"
                              text
                              :loading="loading"
                              :disabled="loading"
                              @click.prevent="deleteSectionSubmit()"
                              >YES</v-btn
                            >
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-dialog>
                  </v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="4">
        <v-card class="mb-12" color="grey lighten-1">
          <v-card-title>
            <span class="headline">Time Table</span>
          </v-card-title>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-data-table
                  :headers="cfheaders"
                  :items="coursetofacultydata"
                  :items-per-page="-1"
                  :hide-default-footer="true"
                  class="elevation-1"
                >
                  <template v-slot:[`item.coursecode`]="{ item }">
                    <v-select
                      :items="
                        allcoursesdd[`${item.coursecode}-${item.faculty}`]
                      "
                      v-model="item.coursecode"
                      @input="
                        checkFacultyArray();
                        checkSlotArray();
                      "
                    ></v-select>
                  </template>
                  <template v-slot:[`item.faculty`]="{ item }">
                    <v-select
                      :items="allfaculties[item.coursecode]"
                      v-model="item.faculty"
                      @input="
                        if (
                          coursetofacultydata[coursetofacultydata.length - 1]
                            .faculty !== '-'
                        )
                          coursetofacultydata.push({
                            coursecode: '-',
                            faculty: '-',
                          });
                        checkFacultyArray();
                        checkSlotArray();
                      "
                    ></v-select>
                  </template>
                </v-data-table>
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col
                    v-for="(item, i) in coursetofacultydata"
                    :key="i"
                    cols="12"
                    md="12"
                  >
                    <v-card v-if="item.coursecode !== '-'">
                      <v-card-title class="pt-0 pb-0">
                        <span>{{ item.coursecode }}-{{ item.faculty }}</span>
                      </v-card-title>
                      <v-card-text class="pb-0">
                        <v-chip
                          v-for="(slot, i) in allfacultycourses[
                            item.coursecode
                          ][item.faculty]"
                          :key="i"
                          class="ma-2"
                        >
                          {{ slot }}
                        </v-chip>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>

          <v-data-table
            :headers="ttheaders"
            :items="slotdata"
            :items-per-page="-1"
            :hide-default-footer="true"
            class="elevation-1 ma-4 pl-4"
          >
            <template v-slot:item="{ item }">
              <tr>
                {{
                  item.day
                }}
                <td
                  class="text-start"
                  v-for="sl of Object.keys(slotdet)"
                  :key="sl"
                >
                  <v-select
                    :items="facdd[item.day][sl]"
                    v-model="item[sl]"
                    :disabled="facdd[item.day][sl].length <= 1"
                    @input="checkSlotArray"
                  ></v-select>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
        <v-layout justify-center>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="loading"
            @click="submitChanges"
          >
            Submit Changes
          </v-btn>
        </v-layout>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
export default {
  data() {
    return {
      stepNumber: 1,
      deleteConfirmation: false,
      deleteSelect: null,
      updateSelect: null,
      updateConfirmation: false,
      updateSectionConfirmation: false,
      updateCourseConfirmation: false,
      deleteCourseConfirmation: false,
      attachCourseConfirmation: false,
      deleteSectionConfirmation: false,
      departments: [],
      semesters: [],
      courses: [],
      sections: [],
      createDept: false,
      createCourses: false,
      createSection: false,
      loading: false,
      noofsems: null,
      deptFilter: null,
      semFilter: null,
      secFilter: null,
      deptPostData: {
        dept: null,
        sems: null,
      },
      coursePostData: {
        coursecode: null,
        name: null,
      },
      attachPostData: {
        dept: null,
        coursecodes: [],
        sem: null,
      },
      sectionPostData: {},

      allcourses: [],
      allcoursesdd: {},
      allfaculties: [],
      allfacultycourses: {},
      coursetofacultydata: [],
      cfheaders: [
        {
          text: "Course Code",
          sortable: false,
          value: "coursecode",
        },
        { text: "Faculty", sortable: false, value: "faculty" },
      ],
      slotdet: [],
      ttheaders: [],
      slotdata: [],
      facdd: {
        monday: {},
        tuesday: {},
        wednesday: {},
        thursday: {},
        friday: {},
      },

      requiredRule: [(val) => !!val || "Required!"],
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    async submitChanges() {
      this.loading = true;
      try {
        let res = await this.$http.post("/api/calendar/updatetimetable", {
          slotdata: this.slotdata,
          coursetofacultydata: this.coursetofacultydata,
          dept: this.deptFilter,
          sem: this.semFilter,
          section: this.secFilter,
        });
        this.$store.dispatch("Notify", res.data.message);
        this.getTimeTableInit();
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async getDepartments() {
      try {
        this.departments = (
          await this.$http.get("/api/timetable/readdept")
        ).data.departments;
      } catch (err) {}
    },
    async getSemesters() {
      try {
        let flag = (await this.$http.get("/api/timetable/getactivesem")).data
          .odd;
        this.semesters = [];
        if (flag) {
          for (let i = 1; i <= this.noofsems; i += 2) this.semesters.push(i);
        } else {
          for (let i = 2; i <= this.noofsems; i += 2) this.semesters.push(i);
        }
        this.getCourses();
      } catch (err) {
        this.$router.push("/Dashboard");
      }
    },
    async getCourses() {
      try {
        this.courses = (
          await this.$http.get("/api/timetable/readcourses")
        ).data.courses;
      } catch (err) {}
    },
    async getSections() {
      try {
        this.sections = (
          await this.$http.get(
            `/api/timetable/readclassesunderdept/${this.deptFilter}`
          )
        ).data.sections;
      } catch (err) {}
    },

    async getTimeTableInit() {
      try {
        let result = (
          await this.$http.post("/api/calendar/fetchtimetable", {
            dept: this.deptFilter,
            sem: this.semFilter,
            section: this.secFilter,
          })
        ).data;
        console.log(result);
        this.allfacultycourses = result.faculties;
        this.coursetofacultydata = result.faculty_sub;
        this.coursetofacultydata.push({ coursecode: "-", faculty: "-" });
        this.allcourses = ["-"];
        this.allfaculties = { "-": ["-"] };
        for (let [key, value] of Object.entries(this.allfacultycourses)) {
          this.allcourses.push(key);
          this.allfaculties[key] = ["-"];
          for (let faculty of Object.keys(value)) {
            if (this.allfaculties[key]) this.allfaculties[key].push(faculty);
            else {
              this.allfaculties[key] = [];
              this.allfaculties[key].push(faculty);
            }
          }
        }
        this.checkFacultyArray();

        this.slotdata = result.slotdata;
        this.slotdet = result.slots;
        this.ttheaders = [];
        this.ttheaders.push({ text: "day", sortable: false, value: "day" });
        this.slotdata[0].day = "monday";
        this.slotdata[1].day = "tuesday";
        this.slotdata[2].day = "wednesday";
        this.slotdata[3].day = "thursday";
        this.slotdata[4].day = "friday";
        let daymapp = {
          monday: "MON",
          tuesday: "TUE",
          wednesday: "WED",
          thursday: "THU",
          friday: "FRI",
        };
        for (let sd of this.slotdata) {
          for (let [key, value] of Object.entries(sd)) {
            if (value !== "-" && key !== "day") {
              let facultydata = this.coursetofacultydata.find(
                (obj) => obj.coursecode === value
              );
              console.log(facultydata, value);
              if (facultydata === undefined) {
                sd[key] = "-";
                continue;
              }
              let pval = `${daymapp[sd.day]}-${key.charAt(4)}`;
              if (
                this.allfacultycourses[facultydata.coursecode][
                  facultydata.faculty
                ].indexOf(pval) === -1
              )
                this.allfacultycourses[facultydata.coursecode][
                  facultydata.faculty
                ].push(pval);
            }
          }
        }
        for (let [key, value] of Object.entries(this.slotdet)) {
          let row = { text: `${key} (${value})`, sortable: false, value: key };
          this.ttheaders.push(row);
        }

        this.checkSlotArray();
      } catch (error) {
        console.log(error);
      }
    },

    async checkSlotArray() {
      let days = {
        MON: "monday",
        TUE: "tuesday",
        WED: "wednesday",
        THU: "thursday",
        FRI: "friday",
      };
      let slots = ["buf", "slot1", "slot2", "slot3", "slot4", "slot5", "slot6"];
      try {
        for (let day in this.facdd) {
          for (let keys of Object.keys(this.slotdet)) {
            this.facdd[day][keys] = ["-"];
          }
        }
        for (let cf of this.coursetofacultydata) {
          if (cf.coursecode !== "-" && cf.faculty !== "-") {
            let dates = this.allfacultycourses[cf.coursecode][cf.faculty];
            for (let date of dates) {
              let spl = date.split("-");
              this.facdd[days[spl[0]]][slots[spl[1]]].push(cf.coursecode);
            }
          }
        }
        for (let sd of this.slotdata) {
          for (let [key, value] of Object.entries(sd)) {
            if (key === "day") continue;
            if (value !== "-") {
              let facultydata = this.coursetofacultydata.find(
                (obj) => obj.coursecode === value
              );
              if (facultydata === undefined || facultydata.faculty === "-")
                sd[key] = "-";
              if (
                this.facdd[sd.day][key].indexOf(value) === -1 &&
                facultydata !== undefined &&
                facultydata.faculty !== "-"
              )
                this.facdd[sd.day][key].push(value);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
      this.slotdata = this.slotdata.slice();
    },

    async checkFacultyArray() {
      for (let i = 0; i < this.coursetofacultydata.length - 2; i++) {
        if (this.coursetofacultydata[i].coursecode === "-")
          this.coursetofacultydata.splice(i, 1);
      }
      this.allcoursesdd = {};
      for (let i of this.coursetofacultydata) {
        this.allcoursesdd[`${i.coursecode}-${i.faculty}`] = [
          ...this.allcourses,
        ];
        for (let j of this.coursetofacultydata) {
          if (j.coursecode !== i.coursecode) {
            let idx = this.allcoursesdd[`${i.coursecode}-${i.faculty}`].indexOf(
              j.coursecode
            );
            if (j.coursecode !== "-" && idx !== -1) {
              this.allcoursesdd[`${i.coursecode}-${i.faculty}`].splice(idx, 1);
            }
          }
        }
      }
    },

    async createDeptSubmit() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        let res = await this.$http.post(
          "/api/timetable/createdept",
          this.deptPostData
        );
        this.$store.dispatch("Notify", res.data.message);

        this.createDept = false;
        this.getDepartments();
        this.$refs.form.reset();
      } catch (error) {}
      this.loading = false;
    },
    async updateDeptSubmit(i) {
      if (!this.$refs.form3[i].validate()) return;
      this.loading = true;
      try {
        let newPostData = { ...this.deptPostData };
        newPostData.olddept = this.updateSelect;
        let res = await this.$http.post(
          "/api/timetable/updatedept",
          newPostData
        );
        this.$store.dispatch("Notify", res.data.message);
        this.getDepartments();
        this.updateSelect = null;
        this.$refs.form3[i].reset();
        this.updateConfirmation = false;
      } catch (error) {}
      this.loading = false;
    },
    async deleteDeptSubmit() {
      this.loading = true;
      try {
        let res = await this.$http.post("/api/timetable/deletedept", {
          dept: this.deleteSelect.dept,
        });
        this.$store.dispatch("Notify", res.data.message);
        this.getDepartments();
        this.deleteSelect = null;
        this.deleteConfirmation = false;
      } catch (error) {}
      this.loading = false;
    },
    async createCourseSubmit() {
      if (!this.$refs.form4.validate()) return;
      this.loading = true;
      try {
        let res = await this.$http.post(
          "/api/timetable/createcourse",
          this.coursePostData
        );
        this.$store.dispatch("Notify", res.data.message);

        this.createCourses = false;
        this.getCourses();
        this.$refs.form4.reset();
      } catch (error) {}
      this.loading = false;
    },
    async updateCourseSubmit() {
      if (!this.$refs.form5.validate()) return;
      this.loading = true;
      try {
        let newPostData = { ...this.coursePostData };
        newPostData.oldcoursecode = this.updateSelect.coursecode;
        let res = await this.$http.post(
          "/api/timetable/updatecourse",
          newPostData
        );
        this.$store.dispatch("Notify", res.data.message);
        this.getCourses();
        this.updateSelect = null;
        this.coursePostData = {};
        this.$refs.form4.resetValidation();
        this.$refs.form5.resetValidation();
        this.updateCourseConfirmation = false;
      } catch (error) {}
      this.loading = false;
    },
    async deleteCourseSubmit() {
      this.loading = true;
      try {
        let res = await this.$http.post("/api/timetable/deletecourse", {
          coursecode: this.deleteSelect,
        });
        this.$store.dispatch("Notify", res.data.message);
        this.getCourses();
        this.deleteSelect = null;
        this.deleteCourseConfirmation = false;
        this.$refs.form6.reset();
      } catch (error) {}
      this.loading = false;
    },
    async getCurrentlyAttached() {
      this.loading = true;
      try {
        this.attachPostData.coursecodes = (
          await this.$http.post("/api/timetable/getcourselistundersem", {
            sem: this.attachPostData.sem,
            dept: this.deptFilter,
          })
        ).data.coursecodes;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async attachCourseSubmit() {
      if (!this.$refs.form7.validate()) return;
      this.loading = true;
      try {
        let newPostData = { ...this.attachPostData };
        newPostData.dept = this.deptFilter;
        console.log(newPostData);
        let res = await this.$http.post(
          "/api/timetable/createcourseundersem",
          newPostData
        );
        this.$store.dispatch("Notify", res.data.message);
        this.$refs.form7.reset();
        this.attachCourseConfirmation = false;
      } catch (error) {}
      this.loading = false;
    },
    async createSectionSubmit() {
      if (!this.$refs.form8.validate()) return;
      this.loading = true;
      try {
        this.sectionPostData.dept = this.deptFilter;
        let res = await this.$http.post(
          "/api/timetable/createclassesunderdept",
          this.sectionPostData
        );
        this.$store.dispatch("Notify", res.data.message);
        this.createSection = false;
        this.getSections();
        this.$refs.form8.reset();
      } catch (error) {}
      this.loading = false;
    },
    async updateSectionSubmit(i) {
      if (!this.$refs.form9[i].validate()) return;
      this.loading = true;
      try {
        let newPostData = { ...this.sectionPostData };
        newPostData.oldsection = this.updateSelect;
        newPostData.dept = this.deptFilter;
        let res = await this.$http.post(
          "/api/timetable/updateclassesunderdept",
          newPostData
        );
        this.$store.dispatch("Notify", res.data.message);
        this.getSections();
        this.updateSelect = null;
        this.$refs.form9[i].reset();
        this.updateSectionConfirmation = false;
      } catch (error) {}
      this.loading = false;
    },
    async deleteSectionSubmit() {
      this.loading = true;
      console.log("Deleting...,", this.deleteSelect);
      try {
        let res = await this.$http.post(
          "/api/timetable/deleteclassesunderdept",
          {
            section: this.deleteSelect,
            dept: this.deptFilter,
          }
        );
        this.$store.dispatch("Notify", res.data.message);

        this.getSections();
        this.deleteSelect = null;
        this.deleteSectionConfirmation = false;
      } catch (error) {}
      this.loading = false;
    },
    updateClose(i) {
      this.updateConfirmation = false;
      this.updateSelect = null;
      this.$refs.form3[i].reset();
    },
    createClose() {
      this.createDept = false;
      this.$refs.form.reset();
    },
    createCourseClose() {
      this.createCourses = false;
      this.$refs.form4.reset();
    },
    updateCourseClose() {
      this.updateCourseConfirmation = false;
      this.updateSelect = false;
      this.coursePostData = {};
      this.$refs.form4.resetValidation();
      this.$refs.form5.resetValidation();
    },
    deleteCourseClose() {
      this.deleteCourseConfirmation = false;
      this.deleteSelect = false;
      this.$refs.form6.reset();
    },
    attachCourseClose() {
      this.attachCourseConfirmation = false;
      this.$refs.form7.reset();
    },
    updateSectionClose(i) {
      this.updateSectionConfirmation = false;
      this.updateSelect = null;
      this.$refs.form9[i].reset();
    },
    createSectionClose() {
      this.createSection = false;
      this.$refs.form8.reset();
    },

    save() {
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Data saved";
    },
    cancel() {
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Canceled";
    },
    open() {
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "Dialog opened";
    },
    close() {
      console.log("Dialog closed");
    },
  },
};
</script>

<style></style>
