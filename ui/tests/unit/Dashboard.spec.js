import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
Vue.config.silent = true;
import Vuex from 'vuex';
import Navbar from '../../src/components/Navbar.vue';
import { store } from '../../src/store/index';
import VueRouter from 'vue-router';
import axios from 'axios';

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
describe('Post Login', () => {
  const wrapper = mount(Navbar, {
    store, localVue, router, mocks: {
      $store: {
        getters: {
          Token: 'abc',
          Name: 'testname',
          Role: 'admin',
          Username: 'testname'
        }
      }
    }
  });

  it('Name Storage and Display', async () => {
    expect(wrapper.text()).toContain('testname');
  });

  it('Check Navbar Render', async () => {
    expect(wrapper.text()).toContain('Faculty Calendar Scheduler');
  });

  it('Check Login State', async () => {
    expect(wrapper.text()).toContain('Logout');
  });

});