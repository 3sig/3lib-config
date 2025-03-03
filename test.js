import config from './main.js';

config.addListener(() => {
  console.log("hello: ", config.get("hello", "default_value"));
});

config.init();

let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  while (true) {
    await sleep(150);
  }
})();
