const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
// app config

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// DB config

const connection_url =
  "mongodb+srv://VueToDo:vuetodo@cluster0.jfx4s.mongodb.net/todoDB?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("DB Connected");
});

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, required: true },
  edit: { type: Boolean, required: true },
});

todoSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

todoSchema.set("toJSON", {
  virtuals: true,
});

const Todo = mongoose.model("todo", todoSchema);
//api routes

//Get Posts
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json({ todos });
  //  res.status(200).send('hello')
});

//Add Post

app.post("/todos", async (req, res) => {
  const { title, completed, edit } = req.body;
  const item = new Todo({ title, completed, edit });
  await item.save();
  res.json({ message: "New Todo Saved" });
});

// put post

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todo = req.body;
 await Todo.findByIdAndUpdate(id,{
      ...todo
  })
  res.json({message:"Todo Updated"})
});

//Delete Post
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Todo.findById(id);
    if (item) {
      await item.remove();
    }
    res.json({ message: "Item Removed" });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
});

//listen

app.listen(port, () => console.log(`Server started on port ${port}`));
