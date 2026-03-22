# MA Box Fabrication Tracker — Firebase Setup

## โครงสร้างไฟล์
```
ma-box-firebase/
├── index.html
├── vite.config.js
├── package.json
├── firebase.json
├── .firebaserc
└── src/
    ├── main.jsx
    └── App.jsx     ← แอปหลัก (ใส่ Firebase config ในนี้)
```

---

## ขั้นตอนที่ 1 — สร้าง Firebase Project

1. ไปที่ https://console.firebase.google.com
2. คลิก **Add project** → ตั้งชื่อ เช่น `ma-box-tracker`
3. สร้างเสร็จแล้ว คลิก **Web** icon (</>)
4. Register app → copy **firebaseConfig** ที่ได้

---

## ขั้นตอนที่ 2 — เปิด Firestore

1. ใน Firebase Console → **Firestore Database** → **Create database**
2. เลือก **Start in test mode** (ปรับ rules ทีหลัง)
3. เลือก region → Done

---

## ขั้นตอนที่ 3 — ใส่ Config ในโค้ด

เปิดไฟล์ `src/App.jsx` แล้วหาส่วนนี้ (บรรทัดที่ 5-16):

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",          // ← ใส่ค่าจาก Firebase console
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};
```

แก้ `.firebaserc` ด้วย:
```json
{
  "projects": {
    "default": "YOUR_PROJECT_ID"
  }
}
```

---

## ขั้นตอนที่ 4 — ติดตั้งและรัน local

```bash
# เข้าโฟลเดอร์
cd ma-box-firebase

# ติดตั้ง dependencies
npm install

# รัน local
npm run dev
# เปิด http://localhost:5173?project=tallgrass
```

---

## ขั้นตอนที่ 5 — Deploy ขึ้น Firebase Hosting

```bash
# ติดตั้ง Firebase CLI (ครั้งแรก)
npm install -g firebase-tools

# Login
firebase login

# Build
npm run build

# Deploy
firebase deploy
```

เสร็จแล้วจะได้ URL เช่น:
```
https://ma-box-tracker-xxxxx.web.app
```

---

## การใช้งาน URL แยก Project

| Project    | URL                                               |
|------------|---------------------------------------------------|
| Tallgrass  | `https://your-app.web.app?project=tallgrass`      |
| Bison      | `https://your-app.web.app?project=bison`          |
| Duke       | `https://your-app.web.app?project=duke`           |

แต่ละ project เก็บข้อมูลแยกกันใน Firestore โดยอัตโนมัติ
ไม่ต้อง deploy ใหม่เมื่อเพิ่ม project — แค่เปิด URL ใหม่ได้เลย

---

## Firestore Security Rules (เมื่อ deploy จริง)

ไปที่ Firestore → Rules → วางนี้:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read, write: if true;  // ← ปรับเพิ่ม auth ได้ในอนาคต
    }
  }
}
```
