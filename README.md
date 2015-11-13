# grunt-sitecore-nuget

> NuGet package builder for Sitecore instances.

## About

(Hopefully) makes developing in Sitecore with Visual Studio 2015 and npm/grunt integration easier by bunding the necessary binaries into NuGet packages for you. From there, define the project/solution's package source to this directory, and you're good-to-go.

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

### options.feed
Type: `String` `Object`
Default value: `''`

Specify a NuGet feed for packages to be publish to automatically after they're built. If an `Object` is specified, it must contain the `url` property denoting the feed's url. Optionally, it may contain the `apiKey` property for secured feeds.

This is good for scenarios where you'd like to share packages between other team members or leverage them in a continuous integration (CI) environment.

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
        dest: 'sitecore',
        ver: '8.1.151003'
      }
    }
  },
});
```

#### Multiple Instances
In this example, we generate the NuGet packages for multiple sitecore instances and placing them in the project's `sitecore` directory.

```js
grunt.initConfig({
  scNuget: {
    options: {
      dest: 'sitecore',
      feed: 'http://nuget.sitecore.local/nuget/packages'
    },
    sc81rtm: {
      options: {
        src: '/inetpub/wwwroot/sc81rev151003',
        ver: '8.1.151003'
      }
    },
    sc81rtt: {
      options: {
        src: '/inetpub/wwwroot/sc81rev150819',
        ver: '8.1.150819'
      }
    },
  },
});
```

### Auto-publishing to an internal NuGet feed
In this example, we generate the NuGet packages against the local Sitecore v8.1 (RTM) and publish them to our internal repository.

Note we target `tmp` instead of `sitecore` as the final location of the packages has little significance once we have them on a server.

```js
grunt.initConfig({
  scNuget: {
    options: {
      dest: 'tmp',
      feed: 'http://myget.org/F/myfeed/api/v2'
    },
    sc81rtm: {
      options: {
        src: '/inetpub/wwwroot/sc81rtm/Website',
        ver: '8.1.151003'
      }
    }
  }
});
```

### Auto-publishing to a private internal NuGet feed
In this example, we generate the NuGet packages against the local Sitecore v8.1 (RTM) and publish them to our private internal repository using the supplied api key.

Note we target `tmp` instead of `sitecore` as the final location of the packages has little significance once we have them on a server.

```js
grunt.initConfig({
  scNuget: {
    options: {
      dest: 'tmp',
      feed: {
        url: 'http://myget.org/F/myfeed/api/v2',
        apiKey: 'abc123ghi789mno'
      }
    },
    sc81rtm: {
      options: {
        src: '/inetpub/wwwroot/sc81rtm/Website',
        ver: '8.1.151003'
      }
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* v0.4.0
    * Added support for supplying a NuGet feed (and having packages automatically publish to that feed).
* v0.3.0
    * Fixed dependency in `Sitecore.Mvc.Analytics` (missing `Sitecore.Analytics` dependency)
    * Fixed example usage error in README
    * Added more detail to README
* v0.2.0
    * Updated to use NuGet.exe directly (removed `grunt-nuget` dependency)
    * Runs code asynchronously (Added `async` dependency)
    * Package specs (`.nuspec`) now saved as `<name>.<version>.nuspec`
* v0.1.0
    * Initial Release
