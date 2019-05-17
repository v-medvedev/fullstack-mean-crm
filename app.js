const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');
const configKeys = require('./config/keys');

const app = express();

mongoose.connect(configKeys.mongoURI, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('MongoDB Connected.'))
    .catch(err => console.log('MongoDB Connection Error', err));

app.use(passport.initialize())
require('./middleware/passport')(passport);

app.use(require('morgan')('dev'));
app.use(require('cors')());
app.use('/uploads', express.static(process.cwd() + '/uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);

module.exports = app;