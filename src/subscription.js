/* eslint-disable */
import { API_URL } from './constants';
const convertedVapidKey = urlBase64ToUint8Array(
    process.env.REACT_APP_PUBLIC_VAPID_KEY
  );
  
  function urlBase64ToUint8Array(base64String) {
    if (!base64String) return;
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  function sendSubscription(subscription) {
    if (!API_URL) return;
    const token = "Bearer " + localStorage.getItem("token");
    return fetch(`${API_URL}/notifications/subscribe/other`, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
  }
  
  function sendSafariSubscription(deviceToken) {
    if(!API_URL) return;
    const token = `Bearer ${localStorage.getItem('token')}`;
    return fetch(`${API_URL}/notifications/subscribe/safari`, {
      method: "POST",
      body: JSON.stringify({ token: deviceToken }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
  }
  
  export default function subscribeUser() {
    console.log("%csubscribeUser:::", "color:green; background-color:black;");
    if ("serviceWorker" in navigator) {
      console.log("%cservice worker:::", "color:green; background-color:black;");
      navigator.serviceWorker.ready
        .then(function (registration) {
          if (!registration.pushManager) {
            console.log(
              "%cPush manager unavailable",
              "color:red; background-color:black;"
            );
            return;
          }
          console.log(
            "%cPush manager available",
            "color:green; background-color:black;"
          );
  
          registration.pushManager
            .getSubscription()
            .then(function (existedSubscription) {
              if (existedSubscription === null) {
                console.log("No subscription detected, make a request.");
                registration.pushManager
                  .subscribe({
                    applicationServerKey: convertedVapidKey,
                    userVisibleOnly: true,
                  })
                  .then(function (newSubscription) {
                    console.log("New subscription added.");
                    sendSubscription(newSubscription);
                  })
                  .catch(function (e) {
                    if (Notification.permission !== "granted") {
                      console.log("Permission was not granted.");
                    } else {
                      console.error(
                        "An error ocurred during the subscription process.",
                        e
                      );
                    }
                  });
              } else {
                console.log("Existed subscription detected.");
                sendSubscription(existedSubscription);
              }
            });
        })
        .catch(function (e) {
          console.error(
            "An error ocurred during Service Worker registration.",
            e
          );
        });
    }
    safariNotificationInit();
  }
  
  // call this function to check for permission
  const safariNotificationInit = () => {
    // Check for notification permission - safari
    if ("safari" in window && "pushNotification" in window.safari) {
      var permissionData = window.safari.pushNotification.permission(
        "web.com.okarrow"
      );
      console.log("permissionData", permissionData);
  
      const closePop = () => {
        document.querySelector('#push-popup').style.display = 'none';
      }
      if(permissionData && !permissionData.deviceToken) {
        const pushContainer = document.createElement('div');
        const enableButton = document.createElement('button');
        enableButton.innerHTML = 'enable';
        enableButton.setAttribute('style', `
        color: #196ee5;
        text-transform: capitalize;
        border: none;
        background: none;
        font-weight: 500;
        margin-right: 10px;
        `);
        enableButton.onclick = () => {
          checkRemotePermission(permissionData);
          closePop();
        }
        const closeButton = document.createElement('button');
        const img = document.createElement('img');
        img.setAttribute('src', '/Icons/Close.svg');
        closeButton.appendChild(img);
        closeButton.setAttribute('style', `
        border: none;
        background: none;
        font-weight: 500;
        `);
        closeButton.onclick = closePop;
        const messageElement = document.createElement('p');
        messageElement.innerHTML = 'Arrow needs your permission to enable desktop notifications';
        messageElement.setAttribute('style', `
        margin: 0;
        flex: 1;
        font-size: 13px;
        font-weight: 500;
        `)
        pushContainer.appendChild(messageElement);
        pushContainer.appendChild(enableButton);
        pushContainer.appendChild(closeButton);
        pushContainer.setAttribute('style', `
        position: absolute;
        z-index: 999;
        bottom: 30px;
        font-size: 12px;
        display: flex;
        background: white;
        padding: 10px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04);
        border-radius: 4px;
        left: 20px;
        align-items: center;
        justify-content: center;
        width: 350px;`);
        pushContainer.setAttribute('id', 'push-popup');
        document.querySelector('#root').appendChild(pushContainer);
        // setTimeout(() => {
        //   closePop();
        // }, 10000);
      }
    }
  };
  
  const checkRemotePermission = (permissionData) => {
    console.log(permissionData);
    if (permissionData.permission === "default") {
      window.safari.pushNotification.requestPermission(
        `${API_URL}/services/safaripush`, // The web service URL.
        "web.com.okarrow", // The Website Push ID.
        {}, // Data that you choose to send to your server to help you identify the user.
        checkRemotePermission // The callback function.
      );
    } else if (permissionData.permission === "denied") {
      console.log("denied");
      // The user said no.
    } else if (permissionData.permission === "granted") {
      // The web service URL is a valid push provider, and the user said yes.
      // permissionData.deviceToken is now available to use.
      console.log("granted", permissionData.deviceToken);
      // NOW SEND TOKEN TO /SUB
      sendSafariSubscription(permissionData.deviceToken);
    }
  };