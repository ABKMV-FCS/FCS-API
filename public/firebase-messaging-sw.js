importScripts('https://www.gstatic.com/firebasejs/8.4.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.4.3/firebase-messaging.js');
var firebaseConfig = {
    apiKey: "AIzaSyAflGcALBv3ctCbD_sm8IBlBo8pjsi8s7c",
    authDomain: "facultycalendarscheduler.firebaseapp.com",
    projectId: "facultycalendarscheduler",
    storageBucket: "facultycalendarscheduler.appspot.com",
    messagingSenderId: "659362701908",
    appId: "1:659362701908:web:96866edb3662cccd1e83c1",
    measurementId: "G-LR7XQ5XFNN"
  };
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();



messaging.setBackgroundMessageHandler(function (payload) {
	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: payload.notification.icon,
		image: payload.notification.image,
		click_action: payload.notification.click_action,
		data: {
			click_action: payload.notification.click_action
		}
	};
	self.addEventListener('notificationclick', function (event) {
		if (!event.action) {
			console.log('Notification Click.');
			// event.notification.click_action
			self.clients.openWindow(payload.notification.click_action, '_blank');
			event.notification.close();
			return;
		} else {
			event.notification.close();
		}
	});
	return self.registration.showNotification(notificationTitle,
		notificationOptions);
});