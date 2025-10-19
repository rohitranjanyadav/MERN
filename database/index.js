const mongoose = require("mongoose");

async function connectToDatabase() {
  await mongoose.connect(
    "mongodb+srv://iamshareefg_db_user:rohitranjanyadav@cluster0.acaqmp2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("Database connected successfully");
}


module.exports = connectToDatabase;