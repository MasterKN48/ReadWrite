## ReadWrite.io : A Blogging website for articles , news, tech blog, how to guide, ..etc.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://readwrite0.herokuapp.com) 

[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://readwrite0.herokuapp.com) [![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/MasterKN48/blogs/master/LICENSE)  [![GitHub version](https://badge.fury.io/gh/Naereen%2FStrapDown.js.svg)]()  [![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/MasterKN48/ReadWrite)

It is a MERN stack based blogging website where users can read, write, comment, profile management , follow other user, like blogs, get daily updates and user, admin dashboard. 

### How to run locally?

```bash
# clone the project
1. git clone https://github.com/MasterKN48/ReadWrite
2. cd ReadWrite
3. npm i
4. cd client && npm i
# in project dir create .env
# .env must have these
MONGO_URI=<mongodb-server-link>
PORT=8000
NODE_ENV=dev
JWT_SECRET=<your-jwt-secret>
CLIENT_URL=<client-url>
PASS=<secret-for-password>
OAUTH_CLIENT=<google-oauth-client-id>
# in client side
# change google oauth client id
# edit client/src/user/SocialLogin.js
# find and replace <your-google-oauth-client-id> with original id
# `Run App`
npm run dev
```



[![ForTheBadge built-with-swag](http://ForTheBadge.com/images/badges/built-with-swag.svg)](https://hithub.com/MasterKN48/)  [![ForTheBadge uses-js](http://ForTheBadge.com/images/badges/uses-js.svg)](http://ForTheBadge.com)  [![ForTheBadge uses-css](http://ForTheBadge.com/images/badges/uses-css.svg)](http://ForTheBadge.com)  [![ForTheBadge uses-html](http://ForTheBadge.com/images/badges/uses-html.svg)](http://ForTheBadge.com)