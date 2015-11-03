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
      path = require('path'),
      semver = require('semver'),
      xmlbuilder = require('xmlbuilder'),
      nuspecDir = path.join(__dirname, 'nuspec');

  grunt.registerMultiTask('scNuget', 'NuGet package builder for Sitecore instances.', function() {

    var options = this.options({
      src: '',
      dest: 'sitecore',
      ver: '0.1.0-beta',
      pkgs: [ 'Sitecore.Kernel', 'Sitecore.Analytics', 'Sitecore.Mvc', 'Sitecore.Mvc.Analytics' ]
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
    var nuspecBase = grunt.file.readJSON(path.join(nuspecDir, 'base.json'));
    options.pkgs.forEach(function(pkgName) {
      var nuspecPath = path.join(nuspecDir, pkgName + '.json');
      if (grunt.file.exists(nuspecPath)) {
        var nuspecPkg = grunt.file.readJSON(nuspecPath),
            nuspecCombined = _.merge({}, nuspecBase, nuspecPkg),
            templateData = {
              src: options.src.replace(/\\/g, '\\\\'),
              dest: options.dest.replace(/\\/g, '\\\\'),
              ver: options.ver
            },
            templateString = JSON.stringify(nuspecCombined),
            templateOutput = _.template(templateString)(templateData),
            templateObj = JSON.parse(templateOutput),
            nuspecXml = xmlbuilder.create(templateObj).end({ pretty: true });

        var nuspecTemp = path.join(tempDir, pkgName + '.nuspec');
        grunt.file.write(nuspecTemp, nuspecXml);

        var configPkgName = pkgName.replace(/\./g, '');
        grunt.config.set('nugetpack.' + configPkgName + ".src", nuspecTemp);
        grunt.config.set('nugetpack.' + configPkgName + ".dest", options.dest);
        grunt.task.run('nugetpack:' + configPkgName);
      } else {
        grunt.warn('pkg "' + pkgName + '" cannot be found.');
      }
    });
  });
};
