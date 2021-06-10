import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
Vue.config.silent = true;
import Vuex from 'vuex';
import Login from '../../src/views/common/Login.vue';
import App from '../../src/App.vue';
import { store } from '../../src/store/index';
import VueRouter from 'vue-router';
import axios from 'axios';

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
describe('Test Login', () => {

  it('Rendering Title', () => {
    const msg = 'Faculty Calendar Scheduler';
    const wrapper = mount(Login);
    console.log(wrapper.text());
    expect(wrapper.text().substring(0, msg.length)).toStrictEqual(msg);
  });

  it('Login Trigger', async () => {
    const wrapper = mount(Login, {
      store, localVue, router, mocks: {
      }
    });
    let loggedIn = false;
    wrapper.vm.login = function () {
      loggedIn = true;
    };
    wrapper.find('#LoginButton').trigger('click');
    const sleep = m => new Promise(r => setTimeout(r, m));
    await sleep(1);
    expect(loggedIn).toBe(true);
  });


});