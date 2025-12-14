# Creating an Admin User

There are three ways to create an admin user in your Competition Management Platform:

## Method 1: Quick Setup Script (Recommended for Development)

The easiest way to create an admin user with default credentials:

```bash
node scripts/quick-admin-setup.js
```

**Default Credentials:**
- Email: `admin@example.com`
- Password: `admin123456`

⚠️ **Important:** Change the password after first login!

To customize the credentials, edit `scripts/quick-admin-setup.js` before running it.

---

## Method 2: Interactive Setup Script

For a more secure approach with custom credentials:

```bash
node scripts/create-admin.js
```

This script will prompt you to enter:
- Admin name
- Admin email
- Admin password (min 6 characters)

---

## Method 3: Manual Database Update

If you already have a user account and want to promote it to admin:

### Using MongoDB Compass or Studio:
1. Open your MongoDB database
2. Find the `users` collection
3. Locate your user document
4. Change the `role` field from `"student"` to `"admin"`
5. Save the changes

### Using MongoDB Shell:
```javascript
// Connect to your database
use competition-platform

// Update a user to admin by email
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Using Mongoose in Node.js:
```javascript
const mongoose = require('mongoose');
const User = require('./models/User');

await mongoose.connect(process.env.MONGODB_URI);

await User.findOneAndUpdate(
  { email: 'your-email@example.com' },
  { role: 'admin' }
);
```

---

## Verifying Admin Access

After creating an admin user:

1. **Log in** to your platform using the admin credentials
2. You should see additional admin features:
   - Create/Edit/Delete competitions
   - Manage users
   - Assign judges
   - View all teams and scores
3. Check the dashboard - admin users have access to all management features

---

## Roles in the System

The platform supports three roles:

- **`admin`** - Full access to all features, can manage competitions, users, judges, teams, and scores
- **`judge`** - Can view assigned competitions and submit scores
- **`student`** - Can register teams and participate in competitions

---

## Security Best Practices

1. **Never commit credentials** to version control
2. **Change default passwords** immediately after first login
3. **Use strong passwords** (min 12 characters, mix of letters, numbers, symbols)
4. **Limit admin accounts** - only create admin accounts for trusted users
5. **Regular audits** - periodically review who has admin access

---

## Troubleshooting

### Script won't run
Make sure you have the required dependencies:
```bash
npm install
```

### MongoDB connection error
Check your `.env` file has the correct `MONGODB_URI`:
```
MONGODB_URI=mongodb://localhost:27017/competition-platform
```
Or for MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/competition-platform
```

### "User already exists" error
- For the quick setup script: It will update the existing user to admin
- For the interactive script: You'll be prompted to update the existing user

### Password not working after creation
Make sure:
1. You're using the correct email (case-insensitive)
2. The password meets the minimum 6 character requirement
3. The database was successfully updated (check MongoDB)

---

## Need Help?

If you encounter issues creating an admin user, check:
1. MongoDB is running and accessible
2. Environment variables are set correctly
3. The User model matches the schema in `models/User.js`
