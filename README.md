# Gatsby Auth Test

_(not just auth, other things as well)_

![Netlify](https://img.shields.io/netlify/3bfed8ff-cbb4-4a8c-8be5-b215ad2667a8)

Trial to see whether we can add some form of sign-in/auth to Gatsby, which would enable getting
the Bowles [Friday training booking app](https://bowles-friday-training.vercel.app/) as part of
the overall Bowles website, rather than standalone.

## Progress:

- set up a basic Gatsby site using `gatsby-default-starter`
- added `netlify-lambda` to provide access to Netlify Functions
- tested using a function (`getbookings`) and component (`bookings.jsx`) to put a call into a
  database, render a component with that data, and update on a regular basis (there are limits
  to the free tier on Netlify Functions, but they allow 125,000 requests which is one every 20
  seconds, so for the purposes of this app it should be fine - so long as no-one leaves a tab
  open for an hours at a time; can always add a note on the page asking them to not leave it
  open ...)
- tested writing cookies (`cookie_test` and `cookie_read_test`)
- added logic and endpoints to create an account (`newuser`) and log in a user (`login`); both write
  a jwt to cookies and set 'user' and 'mode' hooks at the page-level, using some common logic which
  is in `src/lib/token.js`
- added logic so that when a user goes to the booking page and isn't logged in, app will check with
  an endpoint (`polltoken`) whether (a) there is a jwt in cookies, (b) whether that jwt is valid
  (signed and in-date) and (c) whether an id retrieved from the validated jwt is itself valid; if
  yes to all three, will auto-log in the user
- also read some more on the `swr` package and believe I can set a much longer refresh period in the
  `bookings.jsx` component but then use the `swr/mutate` method in different components to trigger
  a 'signal' to refresh the data (when a user tries to add/remove a racer)
- **think** I've solved the worst of the XSS/CSRF security issues, but to be proven
- "properly" implemented most of the sign-in/sign-up UI and logic, including breaking out components
  as appropriate to simplify the `bookings.js` code

## Next Up:

- add logic/UI for adding racers to an account
- implement the bookings system
- note re: above; I think it's going to be better to have Tuesday/Friday bookings as two pages
  (from a user experience at least) to avoid complication over which day is being booked for
- look at what happens if a JWT expires during a session (planning on making them hour-long, and
  dumping a user back to the log-in page with a "your session has expired" message; this wouldn't
  be great in a larger project that users would sit on "all-day", but for discrete bookings I feel
  it is appropriate)

## What's Left (Long List)

- [x] endpoint & UI for adding a racer to account (and updating racers hook)
- [ ] endpoint for requesting a password reset token
- [ ] endpoint for resetting password with valid token
- [ ] logic to switch between Tuesday and Thursday training sessions (and re-loading bookings on
that basis)
- [ ] logic to add/remove racer from database
- [ ] styling for inputs

_Just occurred to me that I could have **both** booking lists in 'state' and update them as things
change, rather than using a local variable (hook? not sure) within Bookings_

---

## Notes

_Notes and key information as to what changes will need to be implemented in the main Bowles site
in order to successfully implement these patterns ..._

### Netlify Lambda

- add dependencies, `npm install -D http-proxy-middleware netlify-lambda npm-run-all` (these allow
  testing using functions)
- change the scripts in `package.json` (any other scripts, such as `format` or `clean`, can be left):

```
"develop": "gatsby develop",
"build": "gatsby build && netlify-lambda build src/functions",
"build:app": "gatsby build",
"build:lambda": "netlify lambda-build src/functions",
"start": "run-p start:**",
"start:app": "npm run develop",
"start:lambda": "netlify-lambda serve src/functions"
```

- add a `netlify.toml` file in root:

```
[build]
  command = "npm run build"
  functions = "functions"
  publish = "public"
```

- proxy emulated functions for local development environment by editing `gatsby-config.js`:

```
// at the top:
const { createProxyMiddleware } = require("http-proxy-middleware")

// add to module.exports:
module.exports = {
  ...
  developMiddleware: app => {
    app.use(
      "/.netlify/functions/",
      createProxyMiddleware({
        target: "http://localhost:9000",
        pathRewrite: {
          "/.netlify/functions/": "",
        },
      })
    )
  },
  ...
```

- add functions in a new `src/functions` folder

### Environment Variables & Netlify Functions (Development)

There seems to be no sane way to get `netlify-lambda` to access `process.env` in development
(it's absoutely fine in production). This apparently leaves us with options to:

- add variables to the `netlify.toml` file; not happy with this since I'm using GitHub to deploy
  to Netlify
- use a test and static replace in the server code, with either a mock or an alternative
  (non-production) setting; something like:

```
const url = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017"
```

The main thing that I need to test at this stage is MongoDB access, and at the moment I'm electing
to simply run a local instance of `mongod` rather than 'sacrifice' a public instance by revealing
user/password information on GitHub. This may be re-thought when it comes to the other secrets
(which are pretty much entirely to do with gmail and sending password-recovery emails).

Commands for **my** local mongodb instance:

```
brew services start mongodb-community@3.6
```
and
```
brew services stop mongodb-community@3.6
```

And then `mongo <dbname>` from another terminal window to get a local shell in order to interact
with the database.

### bcrypt vs bcryptjs

Not entirely sure what happened (I could have sworn that I've user `bcrypt` before in npm) but when
I tried it threw a **HUUUGE** list of errors and warnings at me; have therefore decided to go the
easy route and instead use `bcryptjs` which is an entirely-JS implementation. Apparently it's not
as fast/efficient, but frankly I don't have anything like the throughput to have to worry about
speed so the convenience wins out every time.
