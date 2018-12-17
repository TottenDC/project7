const express = require('express');
const data = require('./data.json');

const app = express();

app.use('/static', express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  const { projects } = data;
  const templateData = { projects }
  res.render('index', templateData);
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/project:id', (req, res) => {
  const { id } = req.params;
  if (id >= data.projects.length) {
    return res.redirect('/error/error');
  }
  const project = data.projects[id];
  const templateData = { project };

  res.render('project', templateData);
});

app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next)=>{
  console.log(`Sorry, there was an error (${err.message}). Please try again.`);
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});

app.listen(3000, () => console.log('The app is running on port 3000.'));
