import config from './main.js';

config.addListener(() => {
  console.log("world: ", config.get("world", "default_value"));
  console.log("hello: ", config.get("hello/world", "default_value"));
});

config.init();

let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  while (true) {
    await sleep(150);
  }
})();
