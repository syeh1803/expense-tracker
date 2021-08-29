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

const routes = require('./routes')

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
app.use(routes)



app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
