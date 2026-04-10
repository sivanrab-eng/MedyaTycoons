# 🎬 Media Tycoons - אימפריית המדיה

משחק חדר בריחה לימודי-חברתי ללימוד אנגלית. 2-4 שחקנים פותרים חידות דקדוק יחד כדי להעלות מופעים לבמה!

## 🚀 התקנה מהירה

### שלב 1: Backend (שרת)

```bash
cd media-tycoons
npm install
npm start
```

השרת ירוץ על `http://localhost:3001`

### שלב 2: Frontend (לקוח)

פתחו את `public/index.html` בדפדפן. ברירת המחדל היא מצב מקומי (BroadcastChannel בין טאבים).

לחיבור לשרת, הוסיפו לפני תג ה-`</head>`:
```html
<script>window.MEDIA_TYCOONS_SERVER = 'http://localhost:3001';</script>
```

## 🌐 Deploy

### Frontend → GitHub Pages

1. צרו repo חדש בשם `media-tycoons`
2. העלו את תוכן תיקיית `public/` ל-branch `main`
3. Settings → Pages → Source: `main` / `/ (root)`
4. האתר יהיה זמין ב: `https://USERNAME.github.io/media-tycoons/`

### Backend → Railway

1. צרו חשבון ב-[railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Railway יזהה אוטומטית את `package.json`
4. העתיקו את ה-URL שנוצר (למשל: `https://media-tycoons-server.up.railway.app`)
5. עדכנו ב-`index.html`:
```html
<script>window.MEDIA_TYCOONS_SERVER = 'https://YOUR-URL.up.railway.app';</script>
```

## 📁 מבנה הפרויקט

```
media-tycoons/
├── package.json          # תלויות Backend
├── railway.json          # הגדרות Railway
├── .gitignore
├── README.md
├── server/
│   └── index.js          # Node.js + Socket.io server
└── public/
    └── index.html        # Frontend (כל המשחק בקובץ אחד)
```

## 🎮 איך משחקים

1. שחקן אחד יוצר חדר ומקבל קוד בן 4 אותיות
2. שאר השחקנים מצטרפים עם הקוד
3. מנהל החדר לוחץ "יוצאים לשידור!"
4. כל שחקן רואה מידע אחר על המסך שלו - חייבים לתקשר!
5. פותרים 10 חידות באנגלית יחד

## 🎭 תפקידים

| תפקיד | מה רואה | מה עושה |
|---|---|---|
| Creative Lead 🎬 | המשפט + תרגום | מקריא ומתאם |
| Tech Director 💻 | כפתורי תשובה + רמז | בוחר תשובה |
| Visual Stylist 🎨 | תמונה (יחיד/רבים) | מזהה את הנושא |
| Sound & Timing 🎵 | מילת הזמן | מזהה את הזמן |

## 📋 רישיון

פרויקט פרטי. כל הזכויות שמורות.
