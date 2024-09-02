/* eslint-disable */
importScripts("./sl.algo.js")

onmessage = (args) => {
    const res = sl(args)
    postMessage(res.message, res.transfers)
}
