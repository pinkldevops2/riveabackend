const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');

const dbConfig = require("./app/config/db.config");
var bcrypt = require("bcryptjs");
const app = express();

//app.use(cors());
/* for Angular Client (withCredentials) */
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

// parse requests of content-type - application/json
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use('/uploads', express.static('uploads'));

app.use(
  cookieSession({
    name: "revia-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);

const db = require("./app/models");
const User = require("./app/models/user.model");

db.mongoose
  /*.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })*/
  .connect(`${dbConfig.DB_CONFIG_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Rivea." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/admin.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8181;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  User.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      const hashedPassword = bcrypt.hashSync('Test@1234', 8);
      new User({
        username: "AdminTest",
        email: "admin@example.com",
        password: hashedPassword,
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin@example.com' to users collection");
      });
      
    }
  });
}