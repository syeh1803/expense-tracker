const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose"); // 載入mongoose
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const Record = require("./models/record"); // 載入Record model
const CATEGORY = require("./models/category"); // 載入Category icon

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

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  Record.find()
  .lean()
  .then((record) => {
    let totalAmount = 0
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
      totalAmount += item['amount']
      // item['date'] = moment(item.date).format('YYYY-MM-DD') 會一直buffer, 無法拿掉ISO date
    })
    res.render('index', {record, totalAmount})
  })
  .catch((error) => console.error(error))
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
