#!/usr/bin/env node
var express = require('express');
var app = express();
var glob = require('glob');
var argv = require('yargs')
  .usage("Usage: $0 folder <options>")
  .command("-port, -p", "Which port to use (default: 5000)")
  .command("--items, -i", "ow many items you want per page (default: 20)")
  .alias('p', 'port')
  .alias('i', 'items')
  .help('h')
  .alias('h', 'help')
  .argv;

if (!argv._[0]) {
  console.log("Folder not specified. Run with --help to get usage.");
  process.exit(1);
}

// Array splitting (took from http://waa.ai/vzjO)
function split(a, n) {
  var len = a.length, out = [], i = 0;
  while (i < len) {
    var size = Math.ceil((len - i) / n--);
    out.push(a.slice(i, i += size));
  }
  return out;
}

function rng(i){return i?rng(i-1).concat(i):[]} // number range function

// Useful variables
var folder = './' + argv._[0];
var files = glob.sync(folder + '/**/*(*.jpg|*.jpeg|*.png|*.gif)'); // will catch subdirectories
var port = argv.port || 5000;
var itemsPerPage = argv.items || 20;
var totalPages = Math.ceil(files.length / itemsPerPage);
var pagesNumber = rng(totalPages);
var pages = new Object();

// Create pages before serving them
for(var i=0; i < pagesNumber.length; i++) {
  pages[i] = split(files, totalPages)[i];
}

// Middleware
app.enable('trust proxy');
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use('/' + argv._[0].replace(/\ /g,"_"), express.static(folder));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res) {
  if (!req.query.page) {
    res.redirect('/?page=1')
  } else {
    var n = parseInt(req.query.page) - 1;
    res.render('index', {
      pages: rng(totalPages),
      folder: argv._[0],
      totalPages: totalPages,
      cp: parseInt(req.query.page),
      total: files.length,
      files: pages[n],
      base: __dirname
    });
  }
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Error');
});

console.log("bildo is running at port :" + port + " with a total of " + files.length + " images.");
app.listen(port);
