const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => console.log('Connected to mongodb'));

app.use('/graphiql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('listening for requests on port 4000');
});