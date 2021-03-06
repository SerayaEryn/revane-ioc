# revane-ioc


![Build Status](https://github.com/SerayaEryn/revane-ioc/workflows/ci/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/revane-ioc/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/revane-ioc?branch=master) 
[![NPM version](https://img.shields.io/npm/v/revane-ioc.svg?style=flat)](https://www.npmjs.com/package/revane-ioc)

`revane-ioc` is a inversion of control framework inspired by spring.

## Table of Content

* [Installation](#installation)
* [Example](#example)
* [Usage](#usage)
  * [Component registration](#component-registration)
    * [via Json file](#json-file)
    * [via Xml file](#xml-file)
    * [via Component Scan](#component-scanning)
  * [Dependency Injection](#dependency-injection)
  * [Post Construct](#post-construct)
  * [Scopes](#scopes)
  * [Bean Factory](#bean-factory)
* [API](#api)

## Installation

```bash
npm i revane-ioc
```

## Example

```js
//userRepository.js
const { Repository } = require('revane-ioc');

class UserRepository {
  getUser(id) {
    return {name: 'max'}
  }
};

module.exports = Repository(UserRepository);

//userController.js
const { Controller } = require('revane-ioc');

class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  addRoutes(router) {
    router.get('/user/:id', (req, res, next) => {
      const { id } = req.params;
      const user = this.userRepository.getUser(id);
      res.json(user);
    });
  }
};

module.exports = Controller(UserController);

//app.js
const RevaneIOC = require('revane-ioc');

const options = {
  basePackage: __dirname,
  loaderOptions: [
    { componentScan: true, basePackage: __dirname }
  ]
};
const revane = new RevaneIOC(options);
revane.initialize()
  .then(() => {
    revane.get('userController');
    // ...
  });
```

## Usage

### Component registration

Components may be registered by json file, xml file or by scanning for components.
The class property in the configuration files accepts three different kind of paths:

* Absolute paths starting with `/`
* Paths relative to `basePackage` starting with `./`
* Names of modules 

Configuration files may be passed with the `configurationFiles` option. The `configurationFiles` requires absolute paths.

#### Json File

```json
[
  {
    "id": "userRepository",
    "class": "./lib/UserRepository"
  },
  {
    "id": "userController",
    "class": "./lib/UserControllre",
    "properties": [{
      "ref": "userRepository"
    }]
  }
]
```

```js
//app.js
const options = {
  basePackage: __dirname,
  loaderOptions: [
    { file: __dirname + '/config.json' }
  ]
};
const revane = new RevaneIOC(options);
revane.initialize()
```

#### Xml File

```xml
<?xml version="1" encoding="utf-8">
<beans>
  <bean id="userRepository" class="./lib/UserRepository"/>
  <bean id="userController" class="./lib/UserController">
    <ref bean="userRepository"/>
  </bean>
</beans>
```

```js
//app.js
const options = {
  basePackage: __dirname,
  loaderOptions: [
    { file: __dirname + '/config.xml' }
  ]
};
const revane = new RevaneIOC(options);
revane.initialize()
```

#### Component Scanning

The component scan scans for decorated classes.

It determines the id, scope and dependencies of the decorated class (if not passed as options to the decorator).
The id of a bean is based on the class name. The dependencies will be determined by the constructor of the class and passed to the constructor at the creation of a bean.

**Note**: The component scan is enabled by default.

**Note**: The `basePackage` option determines which folder will be scanned.

**Note**: The component scan may be deactivated with the `componentScan` option.

```js
//userRepository.js
const { Repository } = require('revane-ioc');

class UserRepository {
  getUser(id) {
    return {name: 'max'}
  }
};

module.exports = Repository()(UserRepository);

//controller.js
const { Controller } = require('revane-ioc');

class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  addRoutes(router) {
    router.get('/user/:id', (req, res, next) => {
      res.json(this.userRepository.getUser(req.params.id));
    });
  }
};
```

The component scan may be activated in a xml file, too:

```xml
<?xml version="1" encoding="utf-8">
<beans>
  <component-scan base-package="."/>
</beans>
```

#### Filters

It is possible to apply filters to the component scan. There are two types of filters: `includeFilters` and `excludeFilters`.

```js
//app.js
const options = {
  basePackage: __dirname,
  loaderOptions: [
    {
      componentScan: true,
      basePackage: __dirname,
      excludeFilters: [{
        type: 'regex',
        regex: '.*Mock.js'
      }]
    }
  ]
};
const revane = new RevaneIOC(options);
revane.initialize()
```

### Dependency Injection

If configuration by json file is used it is possible to inject dependencies to a class by adding a reference or a value object to the `properties`:

```json
[
  {
    "id": "userController",
    "class": "./lib/UserControllre",
    "properties": [
      {"ref": "userRepository"},
      {"value": "hello world"}
    ]
  }
]
```

The xml files work the same way.<br>
If component scanning is used the dependencies defined by the constructor parameters of a class or defined by the options of the decorator are being injected.

### Post Construct

If a class has a `postConstruct` function it will be executed after the creation of the bean.

```js
class Example {
  postConstruct() {
    // do something amazing
  }
}
```

### Scopes

There are two possible scopes: `singleton` and `prototype`. If no scope is specified `singleton` will be used.

### Bean Factory

Beans may be defined by decorating a method, that returns a bean, on a class 
with the `@Bean` decorator.

```ts
import { Bean } from 'revane-ioc'

class BeanFactory {
  @Bean
  bean () {
    return aBean
  }
}
```

## API

### Container

```js
const RevaneIOC = require('revane-ioc');

const options = {
  basePackage: __dirname
};
const revane = new RevaneIOC(options);
revane.initialize()
  .then(() => /*...*/)
```

#### get(id): Promise\<any>

Returns the bean for the `id`. Throws an error if no bean with the `id` is found.

#### has(id): Promise\<boolean>

Allows to check if a bean for `id` exists.

#### getMultiple(ids): Promise\<any[]>

Returns multiple beans specified by the `ids`.

#### initialize(): Promise\<void>

Initializes the container by reading all configured configuration files and performes the component scan. Returns a Promise that resolves when all `postConstruct` calls are finished.

#### tearDown(): Promise\<void>

Calls `preDestroy()` on all beans if present.

#### options

##### componentScan

A `boolean` that enables or disables the component scan. Defaults to `true`.

##### basePackage (required)

The base package where the container looks for files.

##### noRedefinition

Prevents the duplicate defininion of beans. If a duplicate definition is found an error will be thrown. Defaults to `true`.

##### configurationFiles

An `array` of absolute paths to configuration files, that provide bean definitions.

##### includeFilters

##### excludeFilters

### Decorators

#### Component(options: string | Options): Function

Used to declare classes as components to be considered by the component scan.<br>
In Javascript it is necessary to call the decorator on the class:

```js
const { Service } = require('revane-ioc');
class Example {}
Service()(Example)
```

In Typescript it is possible to use them as decorators if the
`experimentalDecorators` option is activated.

```ts
import { Service } from 'revane-ioc';

@Service()
class Example {}
```

##### options

It is possible to pass the following options to the `Component` decorator:

* **id** - the id of the bean
* **dependencies** - the dependencies of the class

```js
Service({id: 'example', dependencies: ['test']})(Example)
```

#### Service(options: string | Options): Function

Alias for `Component`.

#### Repository(options: string | Options): Function

Alias for `Component`.

#### Controller(options: string | Options): Function

Alias for `Component`.

#### Scope(scope: string): Function

Adds a scope to a class. Possible values: `singleton`, `prototype`

```js
const { Scope } = require('revane-ioc');
class Example {}
Scope('prototype')(Example)
```

#### Inject(ids: string | string[])

Sets the properties defined by `ids` at the decorated class.

```js

const { Inject } = require('revane-ioc');
class Example {}
Inject('test')(Example)
```

## License

[MIT](./LICENSE)
