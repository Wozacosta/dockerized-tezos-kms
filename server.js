'use strict';

// const express = require('express');
import express from 'express'
import signer from './signer.js'
import {activateAccount, revealAccount, createAccount, transaction} from "./signer.js";

// Constants
const PORT = process.env.PORT || 8075;
const HOST = process.env.HOST || '0.0.0.0';

// App
const app = express();
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.get('/signer', (req, res) => {
  res.json({signer: signer})
})
app.get('/activate', (req, res) => {
  activateAccount()
})
app.get('/reveal', (req, res) => {
  revealAccount()
})

app.get('/create', (req, res) => {
  createAccount()
})

app.get('/transaction', (req, res) => {
  transaction()
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

