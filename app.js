const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require('method-override') // 載入method-override

const routes = require('./routes');
const { proppatch } = require("./routes");
require('./config/mongoose')

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

app.listen(PORT, () => {
  console.log(`Express is listening on localhost:${PORT}`);
});
