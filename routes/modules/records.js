// 引用Express與Express路由器
const express = require("express");
const router = express.Router();
// 引入record & category model
const Record = require("../../models/record");
const CATEGORY = require("../../models/category");
// 載入moment - 轉換日期格式
const moment = require("moment");

// render new page
router.get("/new", (req, res) => {
  return res.render("new");
});

// Create function
router.post("/", (req, res) => {
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
router.get("/:id/edit", (req, res) => {
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
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  const id = req.params.id; // 取得網址上的id, 查詢使用者想要刪除的record
  return Record.findById(id) // 查詢成功後, 將資料放進record
    .then((record) => record.remove()) // 刪除該筆資料
    .then(() => res.redirect("/"))
    .catch((error) => console.error(error));
});

// Filter function
router.get("/filter", (req, res) => {
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

// 匯出路由器
module.exports = router;