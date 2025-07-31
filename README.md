# 3lib-config

3lib-config is a library for making projects configurable, with a couple nice-to-have features that are implemented if they don't dramatically increase the complexity of the library.

## end-user usage

3lib-config projects can be configured in one of many ways:

- without arguments:
  - `EXECUTABLE_NAME.json5` in the same directory as the executable OR
  - `config.json5` in the same directory as the executable, if the above file does not exist
- the `-f` flag specifies a config file:
  - `executable_name -f config_name.json5`
- URI encoded config as the input:
  - `executable_name test1=3%0Atest2=4`

if the config is loaded from a file, it will be watched for changes and reloaded automatically.
it is up to the project to handle live-reloading, so look for documentation there on which configuration options are supported.

## developer usage

at the time of writing, 3lib-config is not in the npm registry. you can install it from github:

npm:
```
npm i 3sig/3lib-config
```

pnpm:
```
pnpm i 3sig/3lib-config
```

bun:
```
bun i github:3sig/3lib-config
```

import and use.
example config.json5:
```
{
  test: "value",
  parent: {
    child: "nested value",
  },
}
```

js:
```
import config from "3lib-config";

// read config from args/file
config.init();

// get the whole config file
let entireConfig = config.get();

// get a specific config value
let test = config.get("test");
// value

// get a specific config value with a default value
// the default value is returned if the key is not found
let testWithDefault = config.get("test2", "default");
//default

// get a nested config value
let nested = config.get("parent/child");
// nested value

// add a callback to be called when the config is updated

config.addListener(() => {
  console.log("config updated");
});
```

### developer notes

if you add listeners *before* you call `config.init()`, they will be called when the config is loaded.
otherwise, they will only be called when the config is updated.

`config.get()` will always return the current value if the file is being watched. if you'd like to ignore changes
to the config file after loading, cache the value returned by `config.get()` at the beginning of your project and don't use `config.get()` again.
