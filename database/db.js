const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./database/sqlite.db", (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS Users (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        username text, 
        password text,
        type_of_user text
        )`,
    (err) => {
      if (err) {
        console.log("Some Error Occured");
      } else {
        console.log("Table Created");
      }
    }
  );
  
  db.run(
    `CREATE TABLE IF NOT EXISTS Orders (
                 Id INTEGER PRIMARY KEY AUTOINCREMENT,
                 buyer_id INTEGER,
                 name text,
                 price INTEGER,
                 catalog text,
                 quantity INTEGER,
                 seller_id INTEGER,
                 createdAt DATE
                 )`,
    (err) => {
      if (err) {
        console.log("Some Error Occured");
      } else {
        console.log("Table Created");
      }
    }
  );
});

db.run(
  `CREATE TABLE IF NOT EXISTS Products (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            price INTEGER,
            catalog text,
            seller_id INTEGER,
            createdAt DATE
               )`,
  (err) => {
    if (err) {
      console.log("Some Error Occured");
    } else {
      console.log("Table Created");
    }
  }
);

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
});
