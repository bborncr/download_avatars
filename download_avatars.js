// github.com API URL https://api.github.com/repos/bborncr/nextion/contributors
// Returns array of objects: login, avatar_url
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
  request(options, function (error, response, body) {
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
      // console.log(response.statusCode);
      // console.log(response.statusMessage);
      // console.log(response.headers['content-type']);
      if(response.headers['content-type'] === 'image/jpeg'){
        ext = '.jpg';
      }
      if(response.headers['content-type'] === 'image/png'){
        ext = '.png';
      }
      if(response.headers['content-type'] === 'image/gif'){
        ext = '.gif';
      }
    })
    .on('end', function(){
      fileName = `./avatars/${login}${ext}`;
      console.log(`Saving to: ${fileName}`);
      fs.createWriteStream(fileName);
    });

}

//.pipe(fs.createWriteStream(filename);
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