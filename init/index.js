
const mongoose = require("mongoose");
const Data = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  Data.data = Data.data.map((obj) => ({...obj, owner:"69268d0b7747ccd02fceee18"}));
  await Listing.insertMany(Data.data);
  console.log("data was initialized");
};

initDB();

