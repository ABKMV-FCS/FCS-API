import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
Vue.use(Vuetify);
Vue.config.silent = true;
import Vuex from 'vuex';
// import Login from '../../src/views/common/Login.vue';
import ManageUsers from '../../src/views/auth/ManageUsers.vue';
// import App from '../../src/App.vue';
import { store } from '../../src/store/index';
import VueRouter from 'vue-router';
import axios from 'axios';
import Vuetify from 'vuetify'
let vuetify=new Vuetify({
	theme: {
		themes: {
			light: {
				primary: '#7957d5',
				// secondary: '#b0bec5',
				// accent: '#8c9eff',
				// error: '#b71c1c',
			},
		},
	},
})

const router = new VueRouter();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
describe('Test ManageUsers', () => {

	const wrapper = mount(ManageUsers, {
		store, localVue, router,vuetify, mocks: {
		}
	});

	it('Show Table Headers', async () => {

		wrapper.vm.getUsers = function () { };
		wrapper.vm.$data.users = [
			{
				"username": "admin",
				"email": "admin@admin.com",
				"role": "admin",
				"phone": "123123123",
				"name": "admin",
				"isactive": "true",
				"profilephoto": "null",
				"qualifications": "MBA"
			}
		];
		wrapper.vm.$data.tableLoading = false;
		wrapper.vm.$data.dtableKey = 1;
		await wrapper.vm.$forceUpdate()
		// console.log(wrapper.text());
		expect(wrapper.text()).toContain('Manage Users');		
	});

	it('Show testing data for username', async () => {
		expect(wrapper.text()).toContain('admin');
	});

	it('Show testing data for email', async () => {
		expect(wrapper.text()).toContain('admin@admin.com');
	});

	it('Show testing data for qualification', async () => {
		expect(wrapper.text()).toContain('MBA');
	});

});