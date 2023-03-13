export const Logger = (debugOn) => {
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