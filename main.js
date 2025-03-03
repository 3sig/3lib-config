import minimist from "minimist";
import smolToml from "smol-toml";
import fs from "fs";
import path from "path";
import chokidar from "chokidar";

let executableName = path.basename(process.argv[1], ".exe");
let config = {};
let configChangedListeners = [];

function get(field, defaultValue) {
  if (field === undefined) {
    return config;
  }
  if (config[field] === undefined) {
    return defaultValue;
  }
  return config[field];
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
    try {
        let fileContents = fs.readFileSync(filename, "utf8");
        let newConfig = smolToml.parse(fileContents);
        _setConfig(newConfig);
      } catch (error) {
        console.error("Error parsing config file:", error);
      }
  }
  let watcher = chokidar.watch(filename, {
    awaitWriteFinish: true,
    atomic: true
  })
  watcher.on('change', updateConfig);

  updateConfig();
}

function init() {
  let argv = minimist(process.argv.slice(2));
  if (argv.f) {
    _watchConfigFile(argv.f);
  } else if (argv._.length === 1) {
    try {
      let newConfig = smolToml.parse(decodeURI(argv._[0]));
      _setConfig(newConfig);
    } catch (error) {
      console.error("Error parsing config input:", error);
    }
  }
  else if (fs.existsSync(executableName + ".toml")){
    _watchConfigFile(executableName + ".toml");
  }
  else if (fs.existsSync("config.toml")){
    _watchConfigFile("config.toml");
  }
  else {
    _setConfig({});
  }
}

export default {
  get,
  addListener,
  init,
};
