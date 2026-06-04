# Firebase Admin setup (required for seed + admin login)

Your `.env` already has the **web** Firebase keys. You still need a **service account key** for the server.

## Steps (about 2 minutes)

1. Open:  
   https://console.firebase.google.com/project/salon-hasi/settings/serviceaccounts/adminsdk

2. Click **Generate new private key** → **Generate key**.

3. A JSON file downloads (name like `salon-hasi-firebase-adminsdk-xxxxx.json`).

4. Move/rename it into this project folder as:
   ```
   salon-hasi/firebase-service-account.json
   ```
   (same folder as `package.json`)

5. In `.env` you should already have:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
   ```

6. Enable Email login (if not done):  
   Firebase Console → **Authentication** → **Sign-in method** → **Email/Password** → Enable

7. Run:
   ```powershell
   npm run db:seed
   npm run dev
   ```

8. Admin login: http://localhost:3000/admin/login  
   - Email: `admin@salonhasi.com`  
   - Password: `Admin@123`

**Do not commit** `firebase-service-account.json` (it is in `.gitignore`).
