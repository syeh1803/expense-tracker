// 引用Express與Express路由器
const express = require("express");
const router = express.Router()
// 引入record & category model
const Record = require('../../models/record')
const CATEGORY = require('../../models/category')
// 載入moment - 轉換日期格式
const moment = require("moment"); 

// 定義首頁路由
// render homepage
router.get("/", (req, res) => {
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
// 匯出路由器
module.exports = router;
