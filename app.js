const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");

const app = express();
app.use(morgan("dev"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts
        .map(
          (post) =>
            `
        <div class='news-item'>
          <p>
           <a href="/posts/${post.id}"<span class="news-position">${post.id}. ▲</span><a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
        )
        .join("")}
    </div>
  </body>
</html>`;

  res.send(html);
});
app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  ////////////////////////////////
  try {
    if (!post.id) {
      throw new Error();
    } else {
      res.send(
        `<!DOCTYPE html>
          <html>
           <head>
             <title>Wizard News</title>
             <link rel="stylesheet" href="/style.css" />
           </head>
           <body>
           <div class="news-list">
           <header><img src="/logo.png"/>Wizard News</header>
           <div class='news-item'>
             <p>
               <span class="news-position"> </span><b>${post.title}</b>
               <small>(by ${post.name})</small>
             </p>
             <p >
               <b>${post.content}</b>|
             </p>
             <p>
             <a href="/">Back</a>
             </p>
           </div>
       </div>
     </body>
   </html>`
      );
    }
  } catch (error) {
    console.log("error");
    next(error);
  }
});

app.use("*", () => {
  try {
    throw new Error();
  } catch (error) {
    console.log("error");
    next(error);
  }
});

app.use((err, req, res, next) => {
  res.status(404).send(
    `
  <html>
    <head>
      <title>404 Error</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
  <body id='mainBody'>
  <div id="main">
    <div class="fof">
        <h1>Error 404</h1>
        <a href="/">Back</a>
    </div>
  </div>
  </body>`
  );
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
