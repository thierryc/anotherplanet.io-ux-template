import fs from 'fs'
import path from 'path'
import minimist from 'minimist'
import prompt from 'prompt'
import keychain from 'keychain'
import Dropbox from 'dropbox'
// import google from 'googleapis'
import {name, version} from './package.json';

const argv = minimist(process.argv.slice(2))
console.dir(argv)

const appPath = 'Apps/anotherplanet.io-ux'

switch(argv._[0]) {
  case 'init':
    init()
    break;

  default:
    run()
}

function init() {
  const schema = {
    properties: {
      token: {
        hidden: true,
        required: true
      }
    }
  }

  console.log('Please save your dropbox access token in your Keychain')

  //
  // Start the prompt
  //
  prompt.start();

  //
  // Get two properties from the user: email, password
  //
  prompt.get(schema, function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('  token: ' + result.token);

    keychain.setPassword({ account: name, password: result.token, service: `dropbox.com #NODE-CLI (${name})`, type: 'internet' }, function(err) {
        if (!err) {
          console.log('your password is saved');
          run();
        }
    });
  });

}
// account: "asciiAccount", service: testInternetService, type: "internet"

function run() {
  keychain.getPassword({ account: name, service: `dropbox.com #NODE-CLI (${name})`, type: 'internet' }, function(err, token) {
    if (!err) {
      return uploadFile(token)
    }
    init() // first use initialisation
  })

}

function uploadFile(accessToken) {
  const dbx = new Dropbox({ accessToken: accessToken });
  fs.readFile(path.join(__dirname, '/anotherplanet.io-ux.sketch'), 'utf8', function (err, contents) {
    if (err) {
      console.log('Error: ', err);
    }
    // This uploads file into your dropbox
    dbx.filesUpload({ path: '/anotherplanet.io-ux.sketch', contents: contents, mode: { '.tag': 'overwrite' } })
      .then(function (response) {
        console.log(response)
        console.log(appPath + response.path_display)
        const sharedLink = dbx.sharingCreateSharedLink({path: response.path_display, short_url: true})
        .then(function (response) {
          console.log(response)
          console.log(response.url)
          generateReadme({
            DROPBOXLINK: response.url
          })
        }).catch(function(err) {
          console.log(err);
        })
      })
      .catch(function (err) {
        console.log(err);
      });
  });
}

function generateReadme(data) {
  const { DROPBOXLINK } = data
  fs.readFile(path.join(__dirname, '/_README.template.md'), 'utf8', function (err, contents) {
    if (err) {
      console.log('Error: ', err);
    }
    let result = contents
    result = result.replace(/%%VERSION%%/g, version);
    result = result.replace(/%%NAME%%/g, name);
    result = result.replace(/%%DROPBOXLINK%%/g, DROPBOXLINK);

    fs.writeFile(path.join(__dirname, '/README.md'), result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });
}
