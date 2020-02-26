const fs = require("fs");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);

/**
 * View Engine
 * @param {string} path
 * @param {any} options
 * @param {Function} callback
 */
const engine = (path, options, callback) => {
  readFile(path)
    .then(buffer => {
      let renderedStr = buffer.toString();

      renderedStr = parseVariables(renderedStr, options);

      renderedStr = parseForLoop(renderedStr, options);

      return callback(null, renderedStr);
    })
    .catch(err => callback(err, null));
};

/**
 * Parse Variables
 * @param {string} renderedStr
 * @param {any} options
 */
const parseVariables = (renderedStr, options) => {
  const variables = Object.keys(options);
  variables.splice(variables.indexOf("settings"), 1);
  variables.splice(variables.indexOf("_locals"), 1);
  variables.splice(variables.indexOf("cache"), 1);

  variables.forEach(variable => {
    if (typeof variable !== "object" && typeof variable !== "function")
      renderedStr = renderedStr.replace(
        new RegExp(`{{${variable}}}`, "g"),
        options[variable]
      );
  });

  return renderedStr;
};

/**
 * Parse For Loop
 * @param {string} renderedStr
 */
const parseForLoop = (renderedStr, options) => {
  const forLoop = new RegExp(/{{for (\w+) in (\w+)}}(.*){{endfor}}/g).exec(
    JSON.stringify(renderedStr)
  );
  const forLoopVars = forLoop.slice(0, forLoop.length);
  const forLoopArr = options[forLoopVars[2]];
  if (forLoopArr) {
    let forLoopStrResult = "";
    const forLoopContent = forLoopVars[3]
      .replace(/\\r\\n(.*)\\r\\n/, "$1")
      .trim();
    for (let i = 0; i < forLoopArr.length; i++) {
      forLoopStrResult += forLoopContent.replace(
        new RegExp(`{{${forLoopVars[1]}}}`, "g"),
        forLoopArr[i]
      );
    }

    renderedStr = renderedStr.replace(
      new RegExp(
        `{{for ${forLoopVars[1]} in ${forLoopVars[2]}}}(.*){{endfor}}`,
        "s"
      ),
      forLoopStrResult
    );
  }

  return renderedStr;
};

module.exports = engine;
