// seed.js
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const { data } = require("./init/data.js"); // ✅ adjust if sampleListings.js is in the same folder

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

  await Listing.deleteMany({});
  console.log("Old listings removed.");

  await Listing.insertMany(data);
  console.log("New sample listings inserted!");

  mongoose.connection.close();
}
