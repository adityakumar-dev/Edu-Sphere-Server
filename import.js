// import.js (using CommonJS)
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const app = express();
module.exports = { express, app, jwt, fs, path, dotenv };
