import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose
  .connect('mongodb+srv://lepeha:Pass123@cluster0myself.ij4cz.mongodb.net/')
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB errror', err));
 
const app = express();

app.use(express.json());

app.post('/auth/register', (req, res) => {
  
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});