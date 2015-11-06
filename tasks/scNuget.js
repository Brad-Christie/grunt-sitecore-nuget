/*
 * grunt-sitecore-nuget
 * https://github.com/Brad-Christie/grunt-sitecore-nuget
 *
 * Copyright (c) 2015 Brad Christie
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var _ = require('lodash'),
      async = require('async'),
      fs = require('fs'),
      path = require('path'),
      semver = require('semver'),
      xmlbuilder = require('xmlbuilder');

  var nuspecDir = path.join(__dirname, 'nuspec'),
      nugetExe = path.join(__dirname, '../bin/nuget-2.8.60717.93.exe');

  grunt.registerMultiTask('scNuget', 'NuGet package builder for Sitecore instances.', function() {

    var done = this.async(),
        options = this.options({
          src: '',
          dest: 'sitecore',
          ver: '0.1.0-beta',
          pkgs: [ 'Sitecore.Kernel', 'Sitecore.Analytics', 'Sitecore.Mvc', 'Sitecore.Mvc.Analytics' ],
          nuget: nugetExe
        });

    // validation
    if (process.platform !== 'win32') {
      grunt.warn('Intended for use on windows platform only.');
    }
    if (!options.src || !grunt.file.isDir(options.src)) {
      grunt.fatal('src missing or invalid (must be a valid path).');
    }
    if (!options.dest) {
      grunt.fatal('dest missing or invalid (must be a valid path).');
    }
    if (!options.ver || !semver.valid(options.ver)) {
      grunt.fatal('ver missing or invalid (must be a valid semver).');
    }
    if (!options.pkgs) {
      grunt.fatal('pkgs missing or invalid (must be a valid array).');
    }

    // sanitization
    if (!grunt.file.isPathAbsolute(options.src)) {
      options.src = path.resolve(process.cwd(), options.src);
      grunt.log.debug('src resolved to ' + options.src);
    }
    if (!grunt.file.isPathAbsolute(options.dest)) {
      options.dest = path.resolve(process.cwd(), options.dest);
      grunt.log.debug('dest resolved to ' + options.dest);
    }

    // setup
    if (!grunt.file.isDir(options.dest)) {
      grunt.file.mkdir(options.dest);
    }
    var tempDir = path.join(options.dest, '.nuspec');
    if (!grunt.file.isDir(tempDir)) {
      grunt.file.mkdir(tempDir);
    }

    // process
    var nuspecPath = path.join(nuspecDir, 'base.json');
    if (!grunt.file.exists(nuspecPath)) {
      grunt.warn('Base template for packages cannot be found.');
    }
    var nuspecBase = grunt.file.readJSON(nuspecPath);
    async.each(options.pkgs, function(pkgName, callback) {
      grunt.log.writeln('Generating ' + pkgName + '.nupkg');
      var nuspecPath = path.join(nuspecDir, pkgName + '.json');
      if (grunt.file.exists(nuspecPath)) {
        var nuspecPkg = grunt.file.readJSON(nuspecPath),
            nuspecCombined = _.merge({}, nuspecBase, nuspecPkg),
            templateData = {
              src: '',//options.src.replace(/\\/g, '\\\\'),
              dest: '',//options.dest.replace(/\\/g, '\\\\'),
              ver: options.ver
            },
            templateString = JSON.stringify(nuspecCombined),
            templateOutput = _.template(templateString)(templateData),
            templateObj = JSON.parse(templateOutput),
            nuspecXml = xmlbuilder.create(templateObj).end({ pretty: true });

        var nuspecTemp = path.join(tempDir, [ pkgName, options.ver, 'nuspec' ].join('.')),
            nuspecTempName = path.basename(nuspecTemp);
        try {
          grunt.file.write(nuspecTemp, nuspecXml);
          grunt.log.ok('Saved "' + nuspecTempName + '" successfully.');
        }
        catch (e) { grunt.fatal('Unable to write nuspec file(s); Are you fighting with UAC?'); }

        grunt.log.writeln('Packaging "' + nuspecTempName + '"...');
        grunt.util.spawn({
          cmd: options.nuget,
          args: [ 'pack', nuspecTemp, '-OutputDirectory', options.dest, '-BasePath', options.src, '-Version', options.ver, '-Verbosity', 'detailed'],
        }, function(error, result, code) {
          grunt.log.debug(result);
          if (error) {
            var err = 'Error packaging "' + nuspecTempName + '": ' + error;
            grunt.log.error(err);
            callback(err);
          } else {
            grunt.log.ok('"' + nuspecTempName + '" created.');
            callback();
          }
        });
      } else {
        grunt.warn('Template for "' + pkgName + '" cannot be found.');
      }
    }, function(err) {
      if (err) {
        grunt.log.error(err);
        done(false);
      } else {
        grunt.log.ok('Packages created!');
        done();
      }
    });
  });
};
