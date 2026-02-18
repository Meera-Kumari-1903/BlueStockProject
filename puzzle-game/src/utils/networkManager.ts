import { disableNetwork, enableNetwork } from "firebase/firestore";
import { db } from "../firebase";

export function setupNetworkManager() {
    window.addEventListener("offline", () => {
        console.log("Offline mode");
        disableNetwork(db);
    });

    window.addEventListener("online", () => {
        console.log("Online mode");
        enableNetwork(db);
    });
}
