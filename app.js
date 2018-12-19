/* --- Variables and Modules --- */
const express = require('express');
const data = require('./data.json');
const app = express();

/* --- Setup --- */
app.use('/static', express.static('public'));
app.set('view engine', 'pug');

/* --- Routing --- */
app.get('/', (req, res) => {
  const { projects } = data;
  const templateData = { projects }
  res.render('index', templateData);
});
app.get('/about', (req, res) => {
  res.render('about');
});
// Project route. Redirects to error page if user goes to non-existant project ID.
app.get('/project:id', (req, res) => {
  const { id } = req.params;
  if (id >= data.projects.length) {
    return res.redirect('/error/error');
  }
  const project = data.projects[id];
  const templateData = { project };
  res.render('project', templateData);
});

/* --- Error Handling --- */
// Routing catcher for anything not specified above. Passes to error middleware.
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});
// Error middleware. It will redirect to special error page.
app.use((err, req, res, next)=>{
  console.log(`Sorry, there was an error (${err.message}). Please try again.`);
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});

/* --- Server startup --- */
app.listen(3000, () => console.log('The app is running on port 3000.'));
