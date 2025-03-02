import config from './main.js';

config.init();

console.log("hello: ", config.get()["hello"]);
