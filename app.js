const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose"); // 載入mongoose
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const Record = require("./models/record"); // 載入Record model
const CATEGORY = require("./models/category"); // 載入Category icon
const moment = require("moment"); // 載入moment - 轉換日期格式

const methodOverride = require('method-override') // 載入method-override

// 設定連線到 mongoDB
mongoose.connect("mongodb://localhost/expense", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 取得資料庫連線狀態
const db = mongoose.connection;
// 連線異常
db.on("error", () => {
  console.log("mongodb error!");
});
// 連線成功
db.once("open", () => {
  console.log("mongodb connected!");
});

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    // 觀摩同學作業
    // express-handlebars helpers setting - 保留edit page的表單選項
    helpers: {
      isEqual: function (a, b) {
        return a === b;
      },
    },
  })
);
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

// render homepage
app.get("/", (req, res) => {
  Record.find()
    .lean()
    .then((record) => {
      let totalAmount = 0;
      record.forEach((item) => {
        // 觀摩同學的作業
        // 將icon套用至不同category
        // switch: 某一個case就切換成該結果
        switch (item.category) {
          case "家居物業":
            item["icon"] = CATEGORY.home;
            break;
          case "交通出行":
            item["icon"] = CATEGORY.transportation;
            break;
          case "休閒娛樂":
            item["icon"] = CATEGORY.entertainment;
            break;
          case "餐飲食品":
            item["icon"] = CATEGORY.food;
            break;
          default:
            item["icon"] = CATEGORY.other;
        }
        totalAmount += item["amount"];
        item["date"] = moment(item["date"]).format("YYYY-MM-DD");
      });
      res.render("index", { record, totalAmount });
    })
    .catch((error) => console.error(error));
});

// render new page
app.get("/records/new", (req, res) => {
  return res.render("new");
});

// Create function
app.post("/records", (req, res) => {
  // 從req.body拿出這些資料
  const { name, date, category, amount } = req.body;
  // 存進資料庫
  return (
    Record.create({
      name,
      date,
      category,
      amount,
    })
      // 新增完成後導回首頁
      .then(() => res.redirect("/"))
      .catch((error) => console.error(error))
  );
});

// render edit page
app.get("/records/:id/edit", (req, res) => {
  const id = req.params.id; // 先擷取網址上的id
  return Record.findById(id) // 查詢資料庫
    .lean()
    .then((record) => {
      record.date = moment(record.date).format("YYYY-MM-DD");
      res.render("edit", { record });
    })
    .catch((error) => console.error(error));
});

// Update function
app.put("/records/:id", (req, res) => {
  const id = req.params.id;
  const { name, date, category, amount } = req.body;
  return Record.findById(id) // 查詢資料庫
    .then((record) => {
      record.name = name;
      record.date = date;
      record.category = category;
      record.amount = amount;
      return record.save();
    }) // 若查詢成功，修改後儲存資料
    .then(() => res.redirect(`/`)) // 若儲存成功導回首頁
    .catch((error) => console.error(error));
});

// Delete function
app.delete("/records/:id", (req, res) => {
  const id = req.params.id; // 取得網址上的id, 查詢使用者想要刪除的record
  return Record.findById(id) // 查詢成功後, 將資料放進record
    .then((record) => record.remove()) // 刪除該筆資料
    .then(() => res.redirect("/"))
    .catch((error) => console.error(error));
});

// Filter function
app.get("/records/filter", (req, res) => {
  const filter = req.query.filter;
  if (!filter) {
    return res.redirect("/");
  }
  return Record.find({ category: filter }) // 在資料庫搜尋全部資料的category有沒有等於filter
    .lean()
    .then((record) => {
      let totalAmount = 0;
      record.forEach((item) => {
        switch (item.category) {
          case "家居物業":
            item["icon"] = CATEGORY.home;
            break;
          case "交通出行":
            item["icon"] = CATEGORY.transportation;
            break;
          case "休閒娛樂":
            item["icon"] = CATEGORY.entertainment;
            break;
          case "餐飲食品":
            item["icon"] = CATEGORY.food;
            break;
          default:
            item["icon"] = CATEGORY.other;
        }
        totalAmount += item["amount"];
        item["date"] = moment(item["date"]).format("YYYY-MM-DD");
      });
      res.render("index", { record, totalAmount, filter });
    })
    .catch((error) => console.error(error));
});

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
