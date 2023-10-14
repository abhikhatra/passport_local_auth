require("./config/db")
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const session = require("express-session")
const User = require('./models/user');
const passport = require("passport");
const LocalStategy = require("passport-local").Strategy

const app = express();

app.use(express.json())
app.use(express.urlencoded())

app.use(session({
    secret:"gjhfgsjhfghjsgfjgjgjsgfjhghjsfgjhsdg",
    resave: false,
    saveUninitialized: false
}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// =============================PASPORT STATEGY=====================================
passport.use(new LocalStategy(
    { usernameField: 'email' },
    async function (username, password, done) {
        try {
            const user = await User.findOne({ email: username })
            if (!user) return done(null, false)
            if (password !== user.password) return done(null, false)
            if (user) return done(null, user)
        } catch (error) {
            return done(error, false)
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);

        if (user) {
            return done(null, user)
        }
    } catch (error) {
        return done(error, false)
    }
})

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/main', (req, res) => {
    res.render("main");
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/main',
    failureRedirect: '/',
    failureFlash: false
}))

app.post('/signup', async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body
    try {
        const user = await User.create({
            username,
            email,
            password
        })
        res.json({
            success: true,
            message: "user created"
        })
    } catch (error) {
        console.log(error.message);
    }
})


app.listen(3000, () => {
    console.log("sarver listning on port 3000")
})

