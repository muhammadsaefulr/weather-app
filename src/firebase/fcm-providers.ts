import { getMessaging, getToken } from "firebase/messaging";
import { firebaseAppClient } from "./client";

export default async function fcmProviders() {
  const messaging = getMessaging(firebaseAppClient);
  const usersPermission = await Notification.requestPermission();
  if (usersPermission === "granted") {
    console.log("Notification permission granted.");
    const token = await getToken(messaging, {
      vapidKey:
        "BGNcLX2z3lBoMg22jlekrKpc1aHopCU_lmV3KzbNjGZY6SeOnfXXO5uIgIaBjz_SYMMcPWKlDnPO-m_Zm33ZjQk",
    });  
    console.log(token);
  } 
}
