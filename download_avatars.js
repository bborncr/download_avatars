// github.com API URL https://api.github.com/repos/bborncr/nextion/contributors
// Returns array of objects: login, avatar_url
var fs = require('fs');
var request = require('request');

var args = process.argv.slice(2);
var user = args[0];
var repo = args[1];
var contributors = {};
var contributorLogin = "";
var avatar_url = "";
var filename = "";

var url = `https://api.github.com/repos/${user}/${repo}/contributors`;

var contributorsOptions = {
    url: url,
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'myGitHub app'
    }
}

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

getContributors(contributorsOptions, function (body) {
  console.log(`Successfully retrieved data from Github`);
  contributors = JSON.parse(body);
  console.log(`Found ${contributors.length} contributors`);
  for (var contrib in contributors){
    avatar_url = contributors[contrib].avatar_url;
    contributorLogin = contributors[contrib].login;
    getAvatar(contributorLogin, avatar_url);
  }
});

var avatarOptions = {
    url: url,
    method: 'GET',
    headers: {
        'User-Agent': 'myGitHub app'
    }
}

function getAvatar(login, url){

var avatarOptions = {
    url: url,
    method: 'GET',
    headers: {
        'User-Agent': 'myGitHub app'
    }
}

filename = `./avatars/${contributorLogin}.png`;
console.log(`Saving to: ${filename}`);
request(avatarOptions).pipe(fs.createWriteStream(filename));
}