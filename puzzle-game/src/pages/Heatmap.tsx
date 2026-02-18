import  { useEffect, useState } from "react";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Heatmap() {

  const [days, setDays] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "players", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setDays(snap.data().history || []);
      }
    }

    load();
  }, []);

  // generate last 60 days
  const today = new Date();
  const boxes = [];

  for (let i = 59; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];

    const active = days.includes(key);

    boxes.push(
      <div
        key={key}
        style={{
          width: 18,
          height: 18,
          margin: 3,
          borderRadius: 4,
          background: active ? "#2ecc71" : "#e0e0e0"
        }}
        title={key}
      />
    );
  }

  return (
    <div style={{marginTop:"30px"}}>
      <h2>🔥 Your Activity</h2>
      <div style={{
        display:"flex",
        flexWrap:"wrap",
        maxWidth:"400px"
      }}>
        {boxes}
      </div>
    </div>
  );
}

export default Heatmap;
