# Rating Service System

A production-ready, mobile-first React + Vite web app for collecting technician service ratings and storing them in Google Sheets through a Google Apps Script Web App.

## What this system does

Customers select the technician who served them, tap one emoji rating, and the system saves the rating to Google Sheets. Admin users can open `/admin` to view rating analytics, technician averages, rating distribution, and recent rating records.

Important flow correction implemented: after the Thank You countdown ends, users are redirected back to `/`, the Technician Selection Page. They are **not** sent back to `/rating`, which prevents the next customer from accidentally rating the previous technician.

## Tech stack

- React + Vite
- React Router
- Framer Motion
- Recharts
- Google Sheets
- Google Apps Script Web App
- GitHub
- Vercel

## Project structure

```text
rating-service-system/
├── public/
│   ├── technician1.jpg
│   ├── technician2.jpg
│   ├── technician3.jpg
│   ├── technician4.jpg
│   ├── technician5.jpg
│   ├── technician6.jpg
│   ├── technician7.jpg
│   ├── technician8.jpg
│   ├── technician9.jpg
│   ├── technician10.jpg
│   ├── technician11.jpg
│   └── technician12.jpg
├── src/
│   ├── components/
│   │   ├── TechnicianCard.jsx
│   │   ├── RatingButton.jsx
│   │   ├── EmojiBurst.jsx
│   │   ├── BackButton.jsx
│   │   ├── LoadingButton.jsx
│   │   ├── StatCard.jsx
│   │   └── AdminChart.jsx
│   ├── pages/
│   │   ├── TechnicianSelection.jsx
│   │   ├── RatingPage.jsx
│   │   ├── ThankYouPage.jsx
│   │   ├── AdminLogin.jsx
│   │   └── AdminDashboard.jsx
│   ├── data/
│   │   └── technicians.js
│   ├── services/
│   │   └── googleSheetService.js
│   ├── utils/
│   │   ├── ratingHelpers.js
│   │   └── deviceHelpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── google-apps-script.js
├── vercel.json
├── package.json
└── README.md
```

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your local environment file

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_ADMIN_PASSWORD=change-this-password
```

### 3. Run the app

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Google Sheet setup

1. Create a new Google Sheet.
2. Rename the first sheet tab to `Ratings`.
3. The script will automatically create this header row if it is missing:

| Timestamp | Technician ID | Technician Name | Rating Value | Rating Label | Emoji Selected | Device Type | User Agent |
|---|---|---|---|---|---|---|---|

## Google Apps Script setup

1. In your Google Sheet, click **Extensions > Apps Script**.
2. Delete any starter code.
3. Open `google-apps-script.js` from this project.
4. Copy everything into Apps Script as `Code.gs`.
5. Save the script.
6. Click **Run** once from the editor to authorize the script if prompted.
7. Click **Deploy > New deployment**.
8. Select type: **Web app**.
9. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
10. Deploy.
11. Copy the Web App URL ending with `/exec`.
12. Paste that URL into:
    - local `.env` as `VITE_GOOGLE_SCRIPT_URL`
    - Vercel environment variable `VITE_GOOGLE_SCRIPT_URL`

## Apps Script API behavior

### POST: save rating

React sends this payload:

```json
{
  "technicianId": "T001",
  "technicianName": "Ahmad",
  "ratingValue": 5,
  "ratingLabel": "Excellent",
  "emojiSelected": "😄",
  "deviceType": "mobile",
  "userAgent": "browser user agent"
}
```

The script validates:

- `technicianId` is required
- `technicianName` is required
- `ratingValue` is required
- `ratingValue` must be between 1 and 5

### GET: fetch records

The dashboard fetches:

```text
YOUR_WEB_APP_URL?action=list
```

The script returns:

```json
{
  "success": true,
  "records": []
}
```

## Where to change technician names and images

Edit:

```text
src/data/technicians.js
```

Example:

```js
{ id: 'T001', name: 'Ahmad', image: '/technician1.jpg' }
```

To change images, replace files in:

```text
public/
```

Keep the same filenames or update the image path in `technicians.js`.

## How to access the admin dashboard

Open:

```text
https://your-vercel-domain.vercel.app/admin
```

Enter the password stored in:

```env
VITE_ADMIN_PASSWORD=your-password
```

Security warning: this is a client-side demo password. Because Vite exposes `VITE_` variables to the browser bundle, this is not real authentication. For a real company deployment, use proper auth such as Google login, a backend API, Vercel authentication, or a serverless function that keeps secrets server-side.

## Data flow

1. Customer opens `/`.
2. Customer selects a technician.
3. React stores the selected technician in state and `localStorage`.
4. Customer is redirected to `/rating`.
5. Customer taps an emoji rating.
6. The UI shows an emoji burst and loading state.
7. React sends the rating payload to the Apps Script Web App.
8. Apps Script validates the payload.
9. Apps Script appends a new row into the `Ratings` sheet.
10. On success, React clears the selected technician from `localStorage`.
11. Customer is redirected to `/thank-you`.
12. Thank You page counts down from 5 to 0.
13. Customer is redirected back to `/` for the next customer.
14. Admin opens `/admin`, logs in, and the dashboard fetches all Google Sheet records.

## GitHub setup

```bash
git init
git add .
git commit -m "Initial rating service system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rating-service-system.git
git push -u origin main
```

## Vercel deployment

`vercel.json` is included so direct visits to `/rating`, `/thank-you`, and `/admin` correctly load the React single-page app instead of causing a 404.


1. Go to Vercel.
2. Add New Project.
3. Import your GitHub repository.
4. Framework preset should be **Vite**.
5. Build command:

```bash
npm run build
```

6. Output directory:

```text
dist
```

7. Add environment variables:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_ADMIN_PASSWORD=your-admin-password
```

8. Deploy.
9. If you change environment variables later, redeploy the project.

## Troubleshooting

### Data not saving

Check these first:

- `VITE_GOOGLE_SCRIPT_URL` is correct and ends with `/exec`.
- Apps Script deployment is set to **Execute as: Me**.
- Apps Script access is set to **Anyone**.
- You authorized the script by running it once from the Apps Script editor.
- The sheet tab is named `Ratings`, or the script has permission to create it.
- You redeployed Apps Script after editing the script.
- You redeployed Vercel after changing environment variables.

### Admin dashboard not loading

Possible causes:

- Wrong Apps Script Web App URL.
- Apps Script deployment not public.
- Google account authorization missing.
- The Web App URL was copied from a test deployment instead of the live `/exec` deployment.
- Browser/network blocks the Apps Script request.

Open the Apps Script URL directly in the browser with:

```text
?action=list
```

You should see JSON like:

```json
{"success":true,"records":[]}
```

### Images not showing

Check:

- Images are inside `public/`.
- Filenames match exactly, including capitalization.
- Paths in `src/data/technicians.js` start with `/`, for example `/technician1.jpg`.
- If replacing placeholders, use web-safe formats such as `.jpg`, `.png`, or `.webp`.

### Vercel environment variable issue

Check:

- Variable names start with `VITE_`.
- Variables are added to the correct Vercel project.
- Variables are added for Production, Preview, and Development as needed.
- You redeployed after editing environment variables.
- You did not accidentally include extra spaces or quotes in the value.

### Admin password does not work

Check:

- `VITE_ADMIN_PASSWORD` exists in Vercel.
- You redeployed after setting the password.
- You are entering the exact password.
- Clear session storage if the browser has stale state.

## Production hardening checklist

The system is polished enough for a company presentation, but these are the upgrades needed before treating it as truly production-secure:

- Replace client-side password gate with real authentication.
- Add rate limiting or duplicate protection server-side.
- Add technician management in the admin dashboard instead of editing code.
- Add export to CSV/PDF if management needs reports.
- Add Apps Script audit logging for failed submissions.
- Consider moving from Google Sheets to a real database if rating volume becomes high.
