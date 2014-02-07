var Page = require("./page");

var page = new Page("asteroids.b612", 2, false);

page.setNextPage("menu", 1);

module.exports = page;
