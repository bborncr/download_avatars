var fs = require('fs');
var request = require('request');
var config = require('./config/credentials');

var args = process.argv.slice(2);
var user = args[0];
var repo = args[1];
var contributors = {};
var contributorLogin = '';
var avatarUrl = '';
var fileName = '';
var ext = '';
var url = `https://api.github.com/repos/${user}/${repo}/contributors`;

var contributorsOptions = {
  url: url,
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Accept-Charset': 'utf-8',
    'User-Agent': 'myGitHub app'
  }
};

function getContributors(options, callback) {
  request
  .get(options, function (error, response, body) {
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
    }
  };

  request(avatarOptions)
    .on('response', function(response) {
      if(response.headers['content-type'] === 'image/jpeg'){
        ext = '.jpg';
      } else if(response.headers['content-type'] === 'image/png'){
        ext = '.png';
      } else if(response.headers['content-type'] === 'image/gif'){
        ext = '.gif';
      }
      fileName = `./avatars/${login}${ext}`;
      console.log(`Saving to: ${fileName}`);
      //fs.createWriteStream(fileName, response.body);
    }).pipe(fs.createWriteStream('./avatars/bborncr.png'));
}

getContributors(contributorsOptions, function (body) {
  console.log(`Successfully retrieved contributors from Github`);
  contributors = JSON.parse(body);
  console.log(`Found ${contributors.length} contributors`);
  for (var contrib in contributors){
    avatarUrl = contributors[contrib].avatar_url;
    contributorLogin = contributors[contrib].login;
    getAvatar(contributorLogin, avatarUrl);
  }
});