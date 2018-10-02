// if we'd like nodemon to watch other files than js: nodemon server.js -e js,hbs
const express = require('express');
const hbs = require('hbs'); // handlebars
const fs = require('fs');

// heroku should set the process.env.PORT
const port = process.env.PORT || 3000;
const app = express();

hbs.registerPartials(__dirname + '/views/partials');

// get started hbs
app.set('view engine', 'hbs');
// all of the templates should be in views dir (the default dir of hbs views)

// app.use - add a middleware
// middlewares has been called in the order they have written
// next exist to tell that the middleware has done
// on the req object we have all the information from the client
app.use((req, res, next) => {
    const now = new Date().toString();
    const log = `${now}: ${req.method} ${req.url}`;
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next(); // if we don't call next, the routes will never invoked
});

// remove the comment when the website is under maintenance
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
//     // after that we don't want nothing will executed, so we won't call next.
// });

// app.use add a middleware
// express.static add a static page, it gets the absolute path
app.use(express.static(__dirname + '/public'));
// now if we write in the browser: "http://localhost:3000/help.html we'll get to the help page


hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', text => text.toUpperCase());

// set a route
app.get('/', (req, res) => {
    // res.send('Hello Express!'); // regular string
    // res.send('<h1>Hello Express!</h1>'); // string that render by the browser
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Shalom!'
    })
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    })
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects Page',
    })
});

app.get('/bad', (req, res) => {
    res.send({
        errorMeassage: 'Unable to handle request'
    })
});

// can get a 2nd arg as a function, that we'll invoke till the server is app.
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

// now, if we run locally, we can write in the browser: localhost:3000 => and we'll get 'Hello Express'
// we can run it with the script - instead of "node server.js" => "npm start" as far it's defined in the package.json