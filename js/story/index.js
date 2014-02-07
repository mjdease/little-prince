var pages = [];
pages.push(require("./menu-00"));
pages.push(require("./menu-01"));
pages.push(require("./earthIntro-00"));
pages.push(require("./earthIntro-01"));
pages.push(require("./earthIntro-02"));
pages.push(require("./earthIntro-03"));
pages.push(require("./earthIntro-04"));
pages.push(require("./earthIntro-05"));
pages.push(require("./earthIntro-06"));
pages.push(require("./earthIntro-07"));
pages.push(require("./earthIntro-08"));
pages.push(require("./earthEnding-00"));
pages.push(require("./earthEnding-01"));
pages.push(require("./earthEnding-02"));
pages.push(require("./earthEnding-03"));
pages.push(require("./earthEnding-04"));
pages.push(require("./earthEnding-05"));
pages.push(require("./earthEnding-06"));
pages.push(require("./earthEnding-07"));
pages.push(require("./earthEnding-08"));
pages.push(require("./earthEnding-09"));
pages.push(require("./asteroids.b325-00"));
pages.push(require("./asteroids.b325-01"));
pages.push(require("./asteroids.b326-00"));
pages.push(require("./asteroids.b327-00"));
pages.push(require("./asteroids.b328-00"));
pages.push(require("./asteroids.b328-01"));
pages.push(require("./asteroids.b329-00"));
pages.push(require("./asteroids.b329-01"));
pages.push(require("./asteroids.b330-00"));
pages.push(require("./asteroids.b330-01"));
pages.push(require("./asteroids.b612-00"));
pages.push(require("./asteroids.b612-01"));
pages.push(require("./asteroids.b612-02"));

var story = {};
for(var i = 0; i < pages.length; i++){
    story[pages[i].id] = pages[i];
}

module.exports = story;
