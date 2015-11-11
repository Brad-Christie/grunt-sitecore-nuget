# grunt-sitecore-nuget

> NuGet package builder for Sitecore instances.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-sitecore-nuget --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sitecore-nuget');
```

## The "scNuget" task

### Overview
In your project's Gruntfile, add a section named `scNuget` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  scNuget: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.src
Type: `String`
Default value: `''`

Source path to your Sitecore instance (where libraries will be pulled from). This should be the `\Website` root.

#### options.dest
Type: `String`
Default value: `'sitecore'`

Destination path where you want the generated NuGet packages placed.

### options.ver
Type: `String`
Default value: `'0.1.0-beta'`

Version to use when generating the nuget packages. Must follow Semantic Versioning guidelines.

### options.pkgs
Type: `Array`
Default value: `[ 'Sitecore.Kernel', 'Sitecore.Analytics', 'Sitecore.Mvc', 'Sitecore.Mvc.Analytics' ]`

Specify a list of specific packages to generate. This can be used to limit which packages are generated (by exempting those you wish to skip).

### Usage Examples

#### Simple
In this example, we generate the NuGet packages against the local Sitecore v8.1 (RTM) and place them in the project's `sitecore` directory.

```js
grunt.initConfig({
  scNuget: {
    options: {},
    sc81rtm: {
      options: {
        src: '/inetpub/wwwroot/sc81rev151003/Website',
        dest: 'packages',
        ver: '8.1.0.151003'
      }
    }
  },
});
```

#### Custom
In this example, we are only looking for the

```js
grunt.initConfig({
  scNuget: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* v0.2.0
    * Updated to use NuGet.exe directly (removed `grunt-nuget` dependency)
    * Runs code asynchronously (Added `async` dependency)
    * Package specs (`.nuspec`) now saved as `<name>.<version>.nuspec`
* v0.1.0 - Initial Release
