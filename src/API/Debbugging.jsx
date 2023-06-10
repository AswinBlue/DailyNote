export const adjustLogLevel = () => {
  var debugOn = (process.env.REACT_APP_ENV == "DEVELOPMENT") ? true : false; // run level에 따라 결정, DEVELOPMENT / PRODUCTION

  var tempConsole = console;
  if (debugOn === false) {
    // supress the default console functionality
    console.log = function () {};
    // console.info = function () {};
    // console.warn = function () {};
    // console.error = function () {};
  } else {
    console = tempConsole;
  }
};