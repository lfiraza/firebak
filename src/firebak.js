#!/usr/bin/env node
'use strict';
require('babel-polyfill');
Promise = require('bluebird');
Promise.onPossiblyUnhandledRejection(function (error) { console.error(JSON.stringify(error)); throw error; });
import program from 'commander';
import pkg from '../package.json';
import backup from './backup';
import restore from './restore';

program.version(pkg.version)
  // Options that apply to all commands
  .option('-f, --firebase <firebase>', 'All commands: Firebase name (e.g. myfirebase, not https://myfirebase.firebaseio.com)')
  .option('-sc, --secret <secret>', 'All commands: Authentication secret for firebase. If not supplied, looks for process.env.FIREBASE_SECRET');
  // Options that apply to only backup command
  .option('-d, --destination <destDir>', 'Backup: destination directory for storing backups.')
  // Options that apply to only restore command
  .option('-a, --all', 'Restore: restore all paths in the source directory.')
  .option('-s, --source <sourceDir>', 'Restore: directory where the files being restored are located.')

// TODO: make firebase a required option
program.command('backup [collections...]')
  .description('backup a collection or all collections')
  .action((collections) => {
    try {
      backup({
        collections,
        destination: program.destination,
        firebase: program.firebase,
        secret: program.secret
      });
    } catch(error) {
      console.error('error!', error.toString());
    }
  });

program.command('restore [collections...]')
  .description('restore a collection')
  .action((collections) => {
    try {
      restore({
        all: program.all,
        collections,
        firebase: program.firebase,
        secret: program.secret,
        source: program.source
      });
    } catch(error) {
      console.error('error!', error.toString());
    }
  });

program.parse(process.argv)
