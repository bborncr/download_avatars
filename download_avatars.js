var fs = require('fs');
var request = require('request');
var config = require('./config/credentials');

var args = process.argv.slice(2);
var user = args[0];
var repo = args[1];
var contributors = {};
var contributorLogin = '';
var avatarUrl = '';
var ext = '';
var buffer = '';
var url = `https://api.github.com/repos/${user}/${repo}/contributors`;

if(user == null || repo == null){
  console.log("Usage: node download_avatars.js <user> <repo>");
  process.exit(1);
}

var contributorsOptions = {
  url: url,
  method: 'GET',
  headers: {
    'User-Agent': 'myGitHub app'
  },
  qs: {
      access_token: config.token
    }
};

function getContributors(options, callback) {
  request(options, (error, response, body) => {
    console.log(`Connecting to Github...`);
    console.log(`Response: ${response.statusCode} ${response.statusMessage}`);
    if (!error && response.statusCode === 200) {
      callback(body);
    } else {
      console.log(error);
    }
  });
}

function getAvatar(login, url){

  var avatarOptions = {
    url: url,
    method: 'GET',
    headers: {
      'User-Agent': 'myGitHub app'
    },
    qs: {
      access_token: config.token
    }
  };
  var newFile = '';
  var req = request(avatarOptions)
    .on('response', (response) => {
      if(response.headers['content-type'] === 'image/jpeg'){
        ext = '.jpg';
      } else if(response.headers['content-type'] === 'image/png'){
        ext = '.png';
      } else if(response.headers['content-type'] === 'image/gif'){
        ext = '.gif';
      }
      newFile = `./avatars/${login}${ext}`;
      console.log(`Saving file to: ${newFile}`);
      req.pipe(fs.createWriteStream(newFile));
    });
}

getContributors(contributorsOptions, (body) => {
  console.log(`Successfully retrieved contributors from Github`);
  contributors = JSON.parse(body);
  console.log(`Found ${contributors.length} contributors`);
  for (var contrib in contributors){
    avatarUrl = contributors[contrib].avatar_url;
    contributorLogin = contributors[contrib].login;
    getAvatar(contributorLogin, avatarUrl);
  }
});