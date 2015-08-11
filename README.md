# native-builder

Utility to build native packages according to your engine

<table>
  <thead>
    <tr>
      <th>Linux</th>
      <th>OSX</th>
      <th>Windows</th>
      <th>Coverage</th>
      <th>Dependencies</th>
      <th>DevDependencies</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" align="center">
        <a href="https://travis-ci.org/nachos/native-builder"><img src="https://img.shields.io/travis/nachos/native-builder.svg?style=flat-square"></a>
      </td>
      <td align="center">
        <a href="https://ci.appveyor.com/project/nachos/native-builder"><img src="https://img.shields.io/appveyor/ci/nachos/native-builder.svg?style=flat-square"></a>
      </td>
      <td align="center">
<a href='https://coveralls.io/r/nachos/native-builder'><img src='https://img.shields.io/coveralls/nachos/native-builder.svg?style=flat-square' alt='Coverage Status' /></a>
      </td>
      <td align="center">
        <a href="https://david-dm.org/nachos/native-builder"><img src="https://img.shields.io/david/nachos/native-builder.svg?style=flat-square"></a>
      </td>
      <td align="center">
        <a href="https://david-dm.org/nachos/native-builder#info=devDependencies"><img src="https://img.shields.io/david/dev/nachos/native-builder.svg?style=flat-square"/></a>
      </td>
    </tr>
  </tbody>
</table>

## Have a problem? Come chat with us!
[![Join the chat at https://gitter.im/nachos/packages](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nachos/native-builder?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Installation
### For native modules 
``` bash
$ [sudo] npm install native-builder --save
```

Add to your ```package.json```
``` json 
{
  ...
  "scripts": {
    "install": "native-builder build"
  }
}
```

#### Engines
Engines allows you to complie native package accourding to the package engine.

The user of your package should add to his ```package.json```
``` json 
{
  ...
  "engines": {
    "electron": "0.30.1"
  }
}
```

Available engines are ```electron```, ```atom-shell```, ```nw.js``` and ```node-webkit```.

For more info look at [which-native-nodish](https://github.com/maxkorp/which-native-nodish)

## Optional usage
### cli
#### Installation
``` bash
$ [sudo] npm install native-builder -g
```
#### Example
``` bash
$ native-builder build
```
#### Options
``` bash
$ native-builder --help

  Usage: native-builder [command]

  Commands:

    resolve   Resolve the build command
    build     Build native packages according to your engine

  A cli tool to build native packages according to your engine

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    
```


### Programmatically
#### Installation
``` bash
$ [sudo] npm install native-builder --save
```
#### Initialize
``` js
var nativeBuilder = require('native-builder');
```

#### resolve()
``` js
nativeBuilder.resolve()
  .then(function (command) {
    // command -> resolved command to execute
  });
```

#### build(command)
Unistall a package
``` js
nativeBuilder.build('command to build with')
  .then(function () {
    // Build successfully
  });
```

## Run Tests
``` bash
$ npm test
```

## License

[MIT](LICENSE)
