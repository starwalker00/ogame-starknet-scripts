exports.namedConsoleLog = function (variableName, variableValue) {
    console.log(`${variableName}:::::`);
    console.log(variableValue);
};

exports.sleep = function (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}