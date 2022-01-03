const download = require("download-git-repo");
const path = require("path");

module.exports = function (target) {
  target = path.join(target || ".", "tmp");
  return new Promise(function (resolve, reject) {
    let url =
      "direct:http://120.76.250.46:8099/root/vite-react-ts/-/archive/master/vite-react-ts-master.zip";
    download(url, target, {}, function (err) {
      err ? reject(err) : resolve(target);
    });
  });
};
