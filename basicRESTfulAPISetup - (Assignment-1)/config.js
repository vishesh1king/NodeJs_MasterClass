let productionEnv = {
    port: 4000,
    envName: 'production'
};
let localEnv = {
    port: 5000,
    envName: 'local'
};

let environmentExport = (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() == productionEnv.envName) ? productionEnv : localEnv;

module.exports = environmentExport;