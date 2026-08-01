const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to DB successfully!");
  const users = await User.find({});
  console.log("Total Users in Database:", users.length);
  console.log(JSON.stringify(users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role })), null, 2));
  process.exit(0);
}).catch(err => {
  console.error("DB Connection Error:", err.message);
  process.exit(1);
});
