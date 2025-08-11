import minimist from "minimist";
import * as fleece from "golden-fleece";
import fs from "fs";
import path from "path";
import chokidar from "chokidar";

let config = {};
let configChangedListeners = [];

function _get(c, field, defaultValue) {
  if (c === undefined) {
    return defaultValue
  }

  if (field === undefined) {
    return c;
  }

  let slashSplit = field.split("/");
  if (slashSplit.length > 1) {
    return _get(c[slashSplit[0]], slashSplit.slice(1).join("/"), defaultValue);
  }

  if (c[field] === undefined) {
    return defaultValue;
  }
  return c[field];
}

function get(field, defaultValue) {
  return _get(config, field, defaultValue);
}

function addListener(callback) {
  configChangedListeners.push(callback);
}

function _configChanged() {
  configChangedListeners.forEach((listener) => listener());
}

function _setConfig(newConfig) {
  config = newConfig;
  _configChanged();
}

function _watchConfigFile(filename) {
  function updateConfig() {
    let newConfig;
    try {
      let fileContents = fs.readFileSync(filename, "utf8");
      newConfig = fleece.evaluate(fileContents);
    } catch (error) {
      console.error(
        "Error parsing config file. filename:",
        filename,
        "error: ",
        error,
      );
    }
    if (newConfig) _setConfig(newConfig);
  }
  let watcher = chokidar.watch(filename, {
    awaitWriteFinish: true,
    persistent: false,
    atomic: true,
  });
  watcher.on("change", updateConfig);

  updateConfig();
}

function init(customArgs) {
  let args = customArgs || process.argv;
  let executableName = path.basename(args[1], ".exe");
  let argv = minimist(args.slice(2));
  if (argv.f) {
    _watchConfigFile(argv.f);
  } else if (argv._.length === 1) {
    try {
      let newConfig = fleece.evaluate(decodeURI(argv._[0]));
      _setConfig(newConfig);
    } catch (error) {
      console.error("Error parsing config input:", error);
    }
  } else if (fs.existsSync(executableName + ".json5")) {
    _watchConfigFile(executableName + ".json5");
  } else if (fs.existsSync("config.json5")) {
    _watchConfigFile("config.json5");
  } else {
    _setConfig({});
  }
}

export default {
  get,
  addListener,
  init,
};
