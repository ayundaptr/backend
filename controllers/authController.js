const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.register = (req, res) => {
  const { username, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(query, [username, hashedPassword], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Registration failed", error: err });
    res.status(201).json({ message: "User registered successfully" });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err)
      return res.status(500).json({ message: "Login failed", error: err });
    if (results.length === 0)
      return res.status(401).json({ message: "User not found" });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  });
};
