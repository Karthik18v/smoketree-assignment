const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

//connect to the db
mongoose
  .connect(
    "mongodb+srv://bittukarthik77:hQVD2nkCQz48QTgJ@cluster0.n8ibh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

//create user Schema
const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
});

const User = mongoose.model("User", userSchema);

//create address Schema
const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
});

const Address = mongoose.model("Address", addressSchema);

app.listen(4000, () => console.log(`Server Running At http://localhost:4000`));

app.post("/register", async (request, response) => {
  const { name, address } = request.body;
  console.log(address);

  try {
    const user = new User({ name });
    await user.save();
    console.log(user._id);
    const userAddress = new Address({ userId: user._id, address });
    await userAddress.save();
    response.status(201).send("User Registration Successfully");
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});
