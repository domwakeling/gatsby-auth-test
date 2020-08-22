# Gatsby Auth Test

*(not just auth, other things as well)*

![Netlify](https://img.shields.io/netlify/3bfed8ff-cbb4-4a8c-8be5-b215ad2667a8)

Trial to see whether we can add some form of sign-in/auth to Gatsby, which would enable getting
rhe Bowles [Friday training booking app](https://bowles-friday-training.vercel.app/) as part of
the overall Bowles website, rather than standalone.

## Progress:
* set up a basic Gatsby site using `gatsby-default-starter`
* added `netlify-lambda` to provide access to Netlify Functions
* tested using a function (`getbookings`) and component (`bookings.jsx`) to put a call into a
database, render a component with that data, and update on a regular basis (there are limits
to the free tier on Netlify Functions, but they allow 125,000 requests which is one every 20 
seconds, so for the purposes of this app it should be fine - so long as no-one leaves a tab 
open for an hours at a time; can always add a note on the page asking them to not leave it 
open ...)

## Next Up:
Now that we've worked out how to access database for data and render updates, the next part of the
 puzzle is to look at authentication. The strategy in the round is (I think):
* user logs in by entering email and password
* client hashes the password and sends together with email to a verification end-point
* end-point verifies and returns (I think) (a) a JWT which is stored as a cookie, and (b) the 
user _id which is stored in some local context-provider (Redux feels like overkill, React Context
API maybe)
* whilst the user _id is stored it can be used locally to inform colour of racers ...
* and the JWT can be sent with any requests to other end-points
* if a user returns to the app and a JWT cookie is stored, the app automatically tries to recover
the user _id

Somewhere  we will also need to look at XSS (cross-site scripting) concerns and what the mitigation
strategies are; the end-use we're looking at isn't massively exposed, but still should try to 
provide a semi-decent experience and look to understand how to implement best-practice ...
- - -

## Notes

*Notes and key information as to what changes will need to be implemented in the main Bowles site
in order to successfully implement these patterns ...*

### Netlify Lambda
* add dependencies, `npm install -D http-proxy-middleware netlify-lambda npm-run-all` (these allow 
testing using functions)
* change the scripts in `package.json` (any other scripts, such as `format` or `clean`, can be left):
```
"develop": "gatsby develop",
"build": "gatsby build && netlify-lambda build src/functions",
"build:app": "gatsby build",
"build:lambda": "netlify lambda-build src/functions",
"start": "run-p start:**",
"start:app": "npm run develop",
"start:lambda": "netlify-lambda serve src/functions"
```
* add a `netlify.toml` file in root:
```
[build]
  command = "npm run build"
  functions = "functions"
  publish = "public"
```
* proxy emulated functions by editing `gatsby-config.js`:
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
* add functions in a new `src/functions` folder

### Environment Variables & Netlify Functions (Development)
There seems to be no sane way to get `netlify-lambda` to access `process.env` in development
(it's absoutely fine in production). This apparently leaves us with options to:
* add variables to the `netlify.toml` file; not happy with this since I'm using GitHub to deploy 
to Netlify
* use a test and static replace in the server code, with either a mock or an alternative (non-production) setting; something like:
```
const url = process.env.MONGODB_URL || "some_string"
```
The main thing that I need to test at this stage is MongoDB access, and at the moment I'm electing 
to simply run a local instance of `mongod` rather than 'sacrifice' a public instance by revealing 
user/password information on GitHub. This may be re-thought when it comes to the other secrets 
(which are pretty much entirely to do with gmail and sending password-recovery emails).