// 引用Express與Express路由器 
const express = require('express')
const router = express.Router()

// 引入 module
const home = require('./modules/home')
const records = require('./modules/records')

// 導引routes
router.use('/', home)
router.use('/records', records)

// 匯出路由器
module.exports = router;