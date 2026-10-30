importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js","https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
firebase.initializeApp({apiKey:"AIzaSyDoS-TG7IPeoJG2TB64Q5KA_cxLfCJHBRE",authDomain:"tablet-reminder-35d34.firebaseapp.com",projectId:"tablet-reminder-35d34",storageBucket:"tablet-reminder-35d34.firebasestorage.app",messagingSenderId:"542605937342",appId:"1:542605937342:web:5336d839639e4e2672ecef"});
var m=firebase.messaging();
m.onBackgroundMessage(function(p){var d=p.data||{};self.registration.showNotification(d.title||"Tablet Reminder",{body:d.body||"",icon:"icon-192.png",badge:"icon-192.png",tag:"t"+Date.now(),requireInteraction:true})});
self.addEventListener("notificationclick",function(e){e.notification.close();e.waitUntil(clients.openWindow("./"))});
self.addEventListener("fetch",function(){});
