var _ = require("lodash");
var Kinetic = require("../lib/kinetic");

module.exports = function(id, page){
    var section;
    if(/\./.test(id)){
        var levels = id.split(".");
        section = story[levels[0]][levels[1]];
    }
    else if(story[id]){
        section = story[id]
    }
    else{
        return;
    }
    return section[page];
};

var storyTexts = {
    earthIntro : [
        "My name is of no importance. Really it is of no importance. And no… that is not my name. My name is of no importance because this story is not about me.",
        "This story is about my good friend the prince. Very small in size and very curious by nature. The little prince was most curious about grown-ups.  Grown-ups like a child’s mother and father. Grown-ups like me.",
        "As a grown-up, I lived my life alone without anyone that I could really talk to, until I had an accident with my plane in the Desert of the Sahara, six years ago.",
        "One of the engines had failed and I was forced to manoeuvre my plane from the sky and land safely on the sandy grounds of the desert.",
        "Something was broken in my engine. With  no one around to help me, I set out to do all the repairs alone. ",
        "I was a thousand miles from people just like me and there was hardly any drinking water to last a week. My first night, I went to sleep on the sand. I was lonelier than a ship far away at sea.",
        "Just when I thought I would spend the rest  of my life on the desert alone – the next morning, at sunrise, I was awakened by an odd little voice.",
        "It said:\n“If you please – draw me a sheep!”\n\n“What!” I replied.\n\nIt said again:\n“Draw me a sheep!”",
        "I jumped to my feet, completely shocked.\n\nI blinked my eyes hard and looked carefully all around me.",
        "I finally looked down at my feet and saw the most unusual small person who stood there looking at with me with great seriousness.\n\nWhen at last I was able to speak, I said to him:\n\n“But – what are you doing here?”\n\nAnd he repeated very slowly:\n“If you please – draw me a sheep…”",
        "Oh such a mysterious little boy. I dared not disobey.\n\nSilly as it might have seemed to me – a thousand miles away and alone, I took out from my pocket sheets of paper and a pen.",
        "But then I remembered, it’s been long since I was asked to draw anything that wasn’t geography maps or math symbols.\n\nOh so old I had become.\n\nI had told the little fellow (a little impatiently, too) that I did not know how to draw. ",
        "He answered me:\n“That doesn’t matter. Draw me a sheep…”\n\nI had never drawn a sheep but I was ready to give it a try.\n\nAnd so I did.",
        "But the little boy rejected it. \n“Too sickly,” he said.\n\nAnd so I drew again.\n“Too old,” he replied.\n\nAfter many tries, I grew more impatient. I wanted to start fixing the engine. \n\nSo instead, I drew a box. \n",
        "I explained to him:\n“This is only his box. The sheep you asked  for is inside.”\n\nI was very surprised to see a smile over his face. \n",
        "“That is exactly the way I wanted it! Do you think this sheep will have a lot of grass?”\n\n“Why?”\n\n“Because where I live everything is small…”\n",
        "“Where do you come from my little man? What is this ‘where I live’ of which you   speak of?” I asked.\n\nHe walked up to my ear and whispered:\n\n“Far far away in space. Would you like to know more about my planet?”\n\nI nodded. I was very eager to learn more about this strange little boy.\n",
        "He whispered again:\n“Would you like to know about my travels to other planets and the grown-ups who live there?”\n\nI was curious to know what he would say about the other grown-ups who were as old as me. \n\nAnd so I nodded once more to the boy I grew to know as the little prince. \n",
    ],
    asteroids : {
        b612 : [
            "The prince told me about his little planet which was hardly larger than a house. He also told me of his problems with the baobabs that grew there.\n\nHe had asked me:\n“It is true, isn’t it, that sheep eat little bushes?”\n\n“Yes, that is true.”\n\n“Ah! I am glad!” he responded.\n\nHe asked again:\n“Then that means they also eat baobabs?”\n",
            "I responded:\n“No. Baobabs aren’t little bushes. They are trees as big as castles. Even a whole herd of elephants would not be able to eat up one single baobab.”\n\nI then suggested to the little prince that instead of using the sheep to eat the little baobabs – that maybe he should consider weeding out all the bad baobab seeds from the good seeds before they grow so big. \n",
            "Apart from eating little bushes, the prince also asked if a sheep also ate flowers.\n\n“A sheep,” I answered, “eats anything it finds in its reach.”\n\n“Even flowers that have thorns?”\n\n“Yes, even flowers that have thorns.”\n\n“Oh!” he said close to tears.\n\nAnd then he told me of a special flower. The most special flower in the entire world. One with a lot of petals. A flower that grew nowhere but on his planet.\n",
            "“If someone loves a flower, the way I love my flower, all millions and millions of stars will shine bright. But if the sheep eats the flower, then all the stars will darken.”\n\nI did not like to see my friend sad and so I said:\n\n“Why don’t I draw something to protect your flower from the sheep?”\n\nBut the little prince did not reply. \n",
            "On the morning the prince left his planet, he had wanted everything to be in perfect order. \n\nThe prince owned two volcanoes that he used to help heat his breakfast that morning.",
            "He also owned a third volcano, but that one was damaged.\n\nAfter his breakfast, the prince started to spruce up everything he owned – from cleaning out the volcanoes to watering his special flower. "
        ],
        b325 : [
            "The prince found himself on a planet that was ruled by a king.\n\nAll dressed in royal purple and white fur, the king was seated upon a throne that was both simple and magnificent.\n",
            "“Ah! There you are!” he called out to the little prince, “Approach, so that I may see you better.”\n\nThe little prince looked everywhere for a place to sit down but the entire room was filled with the king’s magnificent fur robe.\n\nSo he remained standing.\n",
            "The planet was tiny. And so the prince wondered what could the king have really ruled?\n\nHe then asked the king the same question.\n\nThe king answered with magnificent simplicity:\n“Over everything.”\n\nHe pointed to his planet, other planets, and all the stars.\n\n“And the stars listen to you?”\n\n“Yes they do,” the king said, “They all obey and listen to my every word.”\n",
            "“Everyone and everything listens to me. However, there is one who dares to disobey me.”\n\nThe king told the prince of an old rat who lived somewhere on the planet.\n\n“He is a tricky little animal. Not to be trusted. Before you leave my planet, I would like for you to entrap this rat and bring him to me.”\n"
        ],
        b326 : [
            "On this planet, the prince met a man who everyone believed to be very proud.\n\nThe man wore a long hat.\n\n“Good morning,” greeted the little prince. “That is an odd looking hat you are wearing.”\n\n“It is a hat for greetings,” the proud man answered. “I raise my hat for people who praise and tell me lots of nice things. Why don’t you try clapping your hands.”\n",
            "The little prince clapped his hands. The man then raised his hat and greeted him.\n\nBut then the prince asked:\n“If it takes praise to raise your hat. What does it take the make the hat come down.”\n\nBut the proud man did not hear him. The man pulled out a mirror from his pocket and started to look at himself through the glass.\n\nThe prince did not understand the man and so he left.\n"
        ],
        b327 : [
            "On this planet lived a man who drank from too many bottles. Too much drinking made him sick.\n\nWhen the little prince saw the drunken man, he asked:\n“What are you doing there?”\n\nThe drunken man replied:\n“Drinking. Can’t you see my collection of full and empty bottles?”\n\nThe man hanged his head low.\n",
            "“Why are you drinking?” asked the prince.\n\n“So that I may forget,” replied the drunken man.\n\n“Forget what?” asked the prince who felt sorry for him.\n\n“Forget that I am sad.”\n\n“Sad about what?”\n\n“Sad about drinking.”\n\nAs much as the prince wanted to help this man, he could not. He did not understand. And so he left.\n"
        ],
        b328 : [
            "This planet belonged to a businessman.\n\nThe man was too busy that he did not raise his head when the prince arrived.\n\nHe was too busy counting.\n\n“Three and two make five. Five and seven make twelve. Twelve and three make fifteen.”\n",
            "“Good morning,” said the little prince.\n\n“Good morning,” replied the businessman. Soon after his greeting, the man returned back to counting.\n\n He had counted up to five-hundred-and-one-million, six-hundred-twenty-two-thousand, seven-hundred-thirty-one.\n",
            "“Millions of what?” asked the little prince.\n\nThe businessman knew that he wouldn’t be left alone until he answered:\n\n“Millions of those golden, glittering objects that you sometimes see in the sky.”\n\n“Ah! You mean the stars?”\n\n“Yes that’s it. The stars.”\n\n“And what do you do with that many stars?”\n\n“Nothing I just own them.”\n",
            "“Why?”\n\n“To be rich of course. Since they belong to no man, then they must belong to me because I’m the first person to think of it.”\n\nThe prince responded:\n\n“Well, I myself own a flower that I water everyday. I also own three volcanoes that I clean every week. It is important that I take care of them. But you man are of no use to the stars.”\n\nThe prince went away, leaving the businessman with a mouth wide open and nothing to say.\n"
        ],
        b329 : [
            "This planet was the strangest and smallest of all the planets.\n\nThere was just enough room on it for a few street lamps and a lamplighter.\n",
            "The lamplighter was working as usual. When he lit the street lights, it was as if he had brought a few stars to life. When he put out the light from the lamps, it was as if he had sent the stars to sleep.",
            "“Good morning,” said the prince to the lamplighter. “Why have you just put out the lamps?”\n\n“Those are the orders sadly. In the old days, I could put the lamps out in the morning, and in the evening I light them again. I had time to rest.\n\nBut now, the planet turns more quickly. It is not long before morning turns to night and night returns to morning. I no longer have time to rest. The orders sadly are still the same.”\n",
            "“Is there anyway I can help,” asked the little prince.\n\nThe lamplighter smiled and said:\n\n“Well, yes you can. If you don’t mind, I would like to get a minute of rest. While I do, you can take care of the lamps.\n\nIt is very simple. Before the planet makes a complete turn, make sure that you light the lamps. It is important that you are coordinated.”\n"
        ],
        b330 : [
            "This planet was the largest of all the other planets.\n\nOn this planet lived an old man who wrote lots and lots of books.\n\n“Oh, look! Here is an explorer!” he called out to the little prince.\n",
            "The prince saw that the old man was holding a big book. He asked the man what he was doing.\n\n“Well I am a geographer,” he replied.\n\n“What is a geographer?”\n\n“A geographer is one who knows the locations of all the seas, rivers, towns, mountains, and deserts.”\n",
            "“Your planet is very beautiful,” the prince responded. “Does it have any oceans?”\n\nThe old man couldn’t answer the question because he had never explored his own planet. He was not an explorer.\n\n“How about you?” asked the geographer. “Have you explored your own planet?”\n",
            "The prince started sharing with the old man stories about his flower and volcanoes.\n\n“So that means you are an explorer,” said the geographer.\n\n“Yes, I suppose.”\n\n“Then I advise that you visit the planet Earth. I’ve heard very good things about it.”\n"
        ]
    },
    earthEnding : [
        "When the little prince arrived on Earth’s gigantic desert, he was very surprised not to see anyone. \n\nThat was until he met a snake. All gold like the color of the moonlight.\n\n“Good evening,” said the little prince.\n\n“Good evening,” said the snake. \n",
        "“What planet is this on which I have come down?” asked the little prince.\n\n“This is Earth. This is Africa,” the snake answered. \n\n“Ah! Then there are no people on Earth?”\n\n“Of course there are. But this is the desert. There are no people in the desert. The Earth is very large,” said the snake.\n",
        "“You are a funny animal,” said the prince. “You are no thicker than a finger.”\n\n“No, but I am more powerful than the finger of a king. And I can carry you farther than any ship could take you. Whomever I touch, I can send them back from where they came.\n\nYou my little boy are so weak on this Earth. I can help you some day, if you one day wish to return back to your planet.”\n",
        "“Why do you always speak in riddles?” asked the little prince. \n\n“Well,” smiled the snake, “I solve them all.”\n\n“I would like to try and solve some too.”\n\n“Ok then, I have some riddles up my skin that will be difficult for you to solve. It’s about the planet Earth. I expect you to think outside the box.”\n",
        "After having met the snake, the Prince continued to walk for a long time through the sand, rocks, and snow. Until he came upon a road that led to a hill. \n\nOn top of the hill was an apple tree.\n\nAs the little prince was starting to make his way up to the tree, he heard a voice.\n",
        "“Good morning,” the voice had said.\n\n“Good morning,” replied the prince, although when he turned around he saw nothing.\n\n“I am right here,” the voice said, “under the apple tree.”\n\nUnder the apple the tree was a small grass cave. Inside that cave hid the fox.\n",
        "“Who are you?” asked the little prince. “You are very pretty to look at.”\n\n“I am a fox,” said the fox.\n\n“Come play with me,” said the little prince. “I have no one to play with.”\n",
        "“Oh, dear child. I would love to play with you, but first you must tame me. You need to sit as far away from my cave as possible.\n\nAnd as each day passes, you must come and sit a little closer. But be careful, I must not see you or this will not work.” \n",
        "Before the Prince had left the fox to continue on his journey, the fox had shared with him a simple secret:\n\n“It is only with your heart that you can see very clearly. What is important can not be seen with your eyes.”\n\n“It is long since I’ve been home and seen my special flower. She is very important,” he said in a sad voice. \n",
        "“Remember,” said the fox, “you are responsible for what ever you tame. You are responsible for your flower.”\n\nThe little prince nodded and made sure to always remember that.\n\n“Goodbye,” said the prince.\n\n“Goodbye,” said the fox. \n",
        "It had been eight days since I had had my accident in the desert, and I had listened to the story of the snake and the fox as I was drinking the last drop of water from my bottle.\n\nThe prince and I were both thirsty and tired from the heat of the sun. \n\n“The desert is beautiful. What makes it beautiful is that somewhere it hides a well,” said the little prince.\n",
        "I carried my little friend and walked through the sands until we found a well. \n\nEverything was ready for use: the pulley, the bucket, the rope, and the water that was deep inside the well.\n\nSince the bucket was too heavy for the prince, I decided to fetch us water. We needed enough buckets of water to quench our thirsts. \n",
        "I had finally fixed the problem with my engine and I was excited to share this good news with the prince who had decided to stay at the well.\n\nWhen I returned to the well, it was evening. The little prince was sitting on top of an old stone wall. \n\nHis hands were covering his eyes. And I could hear him crying. Tears and all. \n",
        "I did not like to see my little friend crying and so I asked:\n“What is wrong my friend? Why are you crying?”\n\nHe looked up wiping his tears away. He gave me a sad smile.\n\n“My dear old friend, my heart is too sad. See that big shiny star amongst all the other stars in the sky?”\n\nI looked up into the evening sky. \n",
        "“Yes, I see the star of which you speak.” I said.\n\n“Well, that is my star and it is from there I came to this Earth. It has been a year and I feel it is time that I return home. Return home to my flower.”\n\nIt couldn’t be true.\n\n“Little man,” I said, “tell me that this is only a bad dream.”\n",
        "“No, it is not. I asked the help of the snake who said he would help me return home. And so he has. It is time that I leave.”\n\n“Little man,” I said, “I want to hear you laugh again.”\n\nAnd so he laughed.\n\n“Goodbye my friend,” said the prince. “It is time that I rise and meet the stars.”\n",
        "Before his departure, I gave my friend the drawing I made of the box that housed his sheep.\n\nHe laughed for the last time and held on \nto the sheet of paper.\n",
        "The prince needed a sequence of melodies to be played at the right time in order for him to rise into the evening sky.",
        "Once my friend was gone. \n\nAll I could ask myself as I looked into the evening sky was: “Yes or no?”\n\nMaybe you too should look up at the sky and ask yourself the same question: “Yes or no?”\n\nWill the sheep eat the flower?\n",
        "And no grown-up will ever understand how important this question is.\n\nBut that is going to be our little secret.\n\nWhen you look out into the evening sky, try and find a star that is the brightest of all the stars.\n\nIf you find it, please say hello. The little prince will be very happy."
    ]
};

var story = {};
for(var volumeName in storyTexts){
    var volume = storyTexts[volumeName];
    if(_.isArray(volume)){
        story[volumeName] = [];
        for(var i = 0; i < volume.length; i++){
            if(i%2 == 0){
                var page = [];
                page.push(getStoryText(volume[i], 30));
                page.push(getStoryText(volume[i+1], 500));
                story[volumeName].push(page);
            }
        }
    }
    else{
        story[volumeName] = {};
        for(var chapterName in volume){
            story[volumeName][chapterName] = []
            var chapter = volume[chapterName];
            for(var j = 0; j < chapter.length; j++){
                if(j%2 == 0){
                    var page = [];
                    page.push(getStoryText(chapter[j], 30));
                    page.push(getStoryText(chapter[j+1], 500));
                    story[volumeName][chapterName].push(page);
                }
            }
        }
    }
}

function getStoryText(text, x){
    return new Kinetic.Text({
        text : text,
        x : x,
        y : 28,
        width : 390,
        fontFamily: "lp_Body",
        fontSize: 24,
        fill: "black",
        lineHeight: 1.2,
        listening: false,
        stroke:"black",
        strokeWidth:1,
    });
}
