# Castlepedia

[![Screenshot of Castlepedia landing page](https://screenshots.firefoxusercontent.com/images/73011175-3d51-4bd7-9918-1ae280c6fe8b.jpg)](https://castlepedia.herokuapp.com/)

A site for sharing reviews of castles and other historical sites. Built with
Node and Express. Based off the YelpCamp project I built for Colt Steele's
[Web Dev Bootcamp](https://www.udemy.com/the-web-developer-bootcamp/) course.

## User Stories

* Users can create an account, create and edit review pages for castles (and other historical sites), leave comments.
* Users with admin priviledges can edit and delete reviews and comments.
* Users can search for specific castles.
* Includes authentication with emailed password resets.
* Users can add images, which are uploaded to Cloudinary.

## Technology Used

* Node
* Express
* MongoDB
* EJS
* Passport.js
* Mongoose
* Google Maps API
* Google Places API
* Multer
* Cloudinary
* Nodemailer
* Bootstrap 4

Hosted on Heroku. See the current version [here](https://castlepedia.herokuapp.com/).

Current issues:

* Allow users to update castle image.
* Fix bug in Google Places autocomplete.
* Generally improve error handling.
* Add star rating system.
