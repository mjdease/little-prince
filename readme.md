little-prince
=============

A retelling of "The Little Prince" story as a game. Cleaned up re-implementation of a school project.

[Download](http://bit.ly/1fahvCc)

###Improvements
* Added a very basic build script using Gulp.js. To build, just run `gulp` and open the `index.html` file in ./build.
* Added Browserify to use Node.js style modules.
* Re-architected the entire code base to implement and take advantage of the module system.
* Stage is now centered in the viewport and scales with the window.
* Significantly changed how pages are defined, now a single call to `new Page(section, number, isMenu)` is all that's needed to create a page complete with background graphics and story text.
* Implemented image preloader using JS promises.
* Art assets have been optimized for size and organized in a sane manner.
* Updated to work with KineticJS 5.x.

###Changes
* Removed the 'Riddle' and 'Musical Stars' challenges as I did not originally author those.
* Narration was incomplete and of poor quality with multiple actors, it has been removed except for the first page.

###Future Tasks
* Add Phonegap and Node-webkit support.
* Extend build script to produce multiple build targets.
* Improve separation of modules, particularly the ui module.
* Re-implement the 'Riddle' and 'Musical Stars' challenges.
* Factor out elements common to all challenges.
* Reduce use of magic numbers.
* Use new KineticJS get/set interface.
* Clean up code in page-specific modules.
* Record new narration (unlikely).

###Known Issues
* When playing locally, Chrome won't play sounds. Workaround is to launch Chrome with `--allow-file-access-from-files`
* Word-wrapping on high-dpi devices can be inconsistent between browsers causing misalignment and overlapping text.
