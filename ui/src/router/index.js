import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/common/Login';
import ForgotPassword from '../views/common/ForgotPassword';
import Dashboard from '../views/common/Dashboard';
import Contact from '../views/common/Contact';
import TimeTable from '../views/common/TimeTable';
import ManageUsers from '../views/auth/ManageUsers';
import ManageTimeTable from '../views/populate/ManageTimeTable';
import ManageExamSchedule from '../views/populate/ManageExamSchedule';
import ProfileUpdateRequest from '../views/profile/ProfileUpdateRequest';
import RequestProfileChange from '../views/profile/RequestProfileChange';
import ManageFacultyCourses from '../views/populate/ManageFacultyCourses';
import EmergencyHoliday from '../views/populate/EmergencyHoliday.vue'
import RequestOD from '../views/odandleave/RequestOD';
import ManageOD from '../views/odandleave/ManageOD';
import RequestLeave from '../views/odandleave/RequestLeave';
import ManageLeave from '../views/odandleave/ManageLeave';
import ResetPassword from '../views/profile/ResetPassword';
import StudentSubscribe from '../views/subscribe/StudentSubscribe.vue';
import Analytics from '../views/analytics/Analytics.vue'
import store from '../store/index';

Vue.use(VueRouter);

const authGuard = (to, from, next) => {
	if (store.getters.Token)
		next();
	else
		next('Login');
};

const routes = [
	{
		path: '/login',
		name: 'Login',
		component: Login,
		beforeEnter: (to, from, next) => {
			if (store.getters.Token)
				next('Dashboard');
			else
				next();
		}
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: Dashboard,
		beforeEnter: authGuard
	},
	{
		path: '/manageusers',
		name: 'ManageUsers',
		component: ManageUsers,
		beforeEnter: authGuard
	},
	{
		path: '/managetimetable',
		name: 'ManageTimeTable',
		component: ManageTimeTable,
		beforeEnter: authGuard
	},
	{
		path: '/manageexamschedule',
		name: 'ManageExamSchedule',
		component: ManageExamSchedule,
		beforeEnter: authGuard
	},
	{
		path: '/managefacultycourses',
		name: 'ManageFacultyCourses',
		component: ManageFacultyCourses,
		beforeEnter: authGuard
	},
	{
		path: '/emergencyholiday',
		name: 'EmergencyHoliday',
		component: EmergencyHoliday,
		beforeEnter: authGuard
	},
	{
		path: '/resetpassword',
		name: 'ResetPassword',
		component: ResetPassword,
		beforeEnter: authGuard
	},
	{
		path: '/studentsubscribe',
		name: 'StudentSubscribe',
		component: StudentSubscribe
	},
	{
		path: '/timetable',
		name: 'TimeTable',
		component: TimeTable
	},
	{
		path: '/contact',
		name: 'Contact',
		component: Contact
	},
	{
		path: '/forgotpassword',
		name: 'ForgotPassword',
		component: ForgotPassword
	},
	{
		path: '/profileupdaterequest',
		name: 'ProfileUpdateRequest',
		component: ProfileUpdateRequest,
		beforeEnter: authGuard
	},
	{
		path: '/requestprofilechange',
		name: 'RequestProfileChange',
		component: RequestProfileChange,
		beforeEnter: authGuard
	},
	{
		path: '/requestod',
		name: 'RequestOD',
		component: RequestOD,
		beforeEnter: authGuard
	},
	{
		path: '/manageod',
		name: 'ManageOD',
		component: ManageOD,
		beforeEnter: authGuard
	},
	{
		path: '/requestleave',
		name: 'RequestLeave',
		component: RequestLeave,
		beforeEnter: authGuard
	},
	{
		path: '/manageleave',
		name: 'ManageLeave',
		component: ManageLeave,
		beforeEnter: authGuard
	},
	{
		path: '/analytics',
		name: 'Analytics',
		component: Analytics,
		beforeEnter: authGuard
	},
	{
		path: '*',
		name: "Redirector",
		component: Login,
		beforeEnter: (to, from, next) => {
			next('Login');
		}
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;