import minimist from "minimist";
import smolToml from "smol-toml";

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
      let newConfig = smolToml.parseFile(argv.f);
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
  else {
    _configChanged();
  }
}

export default {
  get,
  addListener,
  init,
};
