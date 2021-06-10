import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
Vue.config.silent = true;
import Vuex from 'vuex';
import ManageTimeTable from '../../src/views/populate/ManageTimeTable.vue';
import { store } from '../../src/store/index';
import VueRouter from 'vue-router';
import axios from 'axios';
const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
describe('Admin Control Center Flow', () => {

  const wrapper = mount(ManageTimeTable, {
    store, localVue, router, mocks: {
    }
  });
  const sleep = m => new Promise(r => setTimeout(r, m));

  it('Initial Render', async () => {
    wrapper.vm.getDepatments = async function () {
      wrapper.vm.departments = [{"dept":"CSE","sems":8}];
    };
    expect(wrapper.text()).toContain('Manage Time Table');
  });

  it('Get Departments', async () => {
    expect(wrapper.text()).toContain('Select Department');
  });

  it('Create Departments', async () => {
    expect(wrapper.text()).toContain('Create Department');
  });

  it('Get Semesters', async () => {
    expect(wrapper.text()).toContain('Select Semester');
  });

  it('Add Courses', async () => {
    expect(wrapper.text()).toContain('Add Courses');
  });

  it('Update Courses', async () => {
    expect(wrapper.text()).toContain('Update Courses');
  });

  it('Delete Courses', async () => {
    expect(wrapper.text()).toContain('Delete Course');
  });

  it('Attach Courses', async () => {
    expect(wrapper.text()).toContain('Attach Course');
  });

  it('Get Sections', async () => {
    expect(wrapper.text()).toContain('Select Section');
  });

  it('Create Sections', async () => {
    expect(wrapper.text()).toContain('Create Sections');
  });

  it('Manage TimeTable Route', async () => {
    expect(wrapper.text()).toContain('Time Table');
  });

});