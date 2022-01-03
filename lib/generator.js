const Metalsmith = require("metalsmith");
const rimraf = require("rimraf");
const chalk = require("chalk");
const ejs = require("ejs");
const shell = require("child_process");

module.exports = function (context) {
  try {
    let metadata = context.metadata;
    let src = context.tmp;
    let dest = "./" + context.root;
    if (!src) {
      return Promise.reject(new Error(`无效的source：${src}`));
    }

    const metalsmith = Metalsmith(process.cwd())
      .metadata(metadata)
      .clean(false)
      .source(src)
      .destination(dest);

    metalsmith
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata();
        Object.keys(files).forEach((fileName) => {
          const t = files[fileName].contents.toString();
          let data = ejs.render(t, meta);
          files[fileName].contents = new Buffer.from(data);
        });
        done();
      })
      .build((err) => {
        rimraf.sync(src, {})
        err
          ? console.log(chalk.red(err))
          : console.log(chalk.green("初始化完成 安装依赖中"));
        shell.exec(`cd ${metadata.projectName}  && yarn install`, (err) => {
          err
            ? console.log(chalk.red(err))
            : () => {
                console.log(chalk.green("依赖安装完成"));
                shell.exec("git init && yarn prepare", (err) => {
                  err && console.log(chalk.red(err));
                });
              };
        });
      });
  } catch (err) {
    console.log(chalk.red(err));
  }
};
