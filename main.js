import minimist from "minimist";
import smolToml from "smol-toml";
import fs from "fs";
import path from "path";

let executableName = path.basename(process.argv[1], ".exe");
let config = {};
let configChangedListeners = [];

function get() {
  return config;
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

function init() {
  let argv = minimist(process.argv.slice(2));
  if (argv.f) {
    try {
      let fileContents = fs.readFileSync(argv.f, "utf8");
      let newConfig = smolToml.parse(fileContents);
      _setConfig(newConfig);
    } catch (error) {
      console.error("Error parsing config file:", error);
    }
  } else if (argv._.length === 1) {
    try {
      let newConfig = smolToml.parse(decodeURI(argv._[0]));
      _setConfig(newConfig);
    } catch (error) {
      console.error("Error parsing config input:", error);
    }
  }
  else if (fs.existsSync(executableName + ".toml")){
    try {
      let fileContents = fs.readFileSync(executableName + ".toml", "utf8");
      let newConfig = smolToml.parse(fileContents);
      _setConfig(newConfig);
    } catch (error) {
      console.error("Error parsing default config file:", error);
    }
  }
  else if (fs.existsSync("config.toml")){
    try {
      let fileContents = fs.readFileSync("config.toml", "utf8");
      let newConfig = smolToml.parse(fileContents);
      _setConfig(newConfig);
    } catch (error) {
      console.error("Error parsing default config file:", error);
    }
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
