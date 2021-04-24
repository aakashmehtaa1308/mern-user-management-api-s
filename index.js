const mongoose = require('mongoose');
const env = require('dotenv');

const app = require('./src/Express');

//environment variables
env.config();

// DB connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PWD}@cluster0.rgsad.mongodb.net/${process.env.MONGO_DB_dbName}`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log(`successfully connected to MONGODB`);
  })
  .catch((error) => {
    throw new Error(`unable to connect to MONGODB`);
  });

app.listen(process.env.PORT || '4000', (err) => {
  if (err) {
    console.log(err);
  }

  console.log(`node server is listening on port 4000`);
});
