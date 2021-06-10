import firebase from 'firebase';

var firebaseConfig = {
	apiKey: "AIzaSyAflGcALBv3ctCbD_sm8IBlBo8pjsi8s7c",
	authDomain: "facultycalendarscheduler.firebaseapp.com",
	projectId: "facultycalendarscheduler",
	storageBucket: "facultycalendarscheduler.appspot.com",
	messagingSenderId: "659362701908",
	appId: "1:659362701908:web:96866edb3662cccd1e83c1",
	measurementId: "G-LR7XQ5XFNN",
  };
firebase.initializeApp(firebaseConfig);

export default firebase;