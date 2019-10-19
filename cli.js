const program = require('commander');

const api = require('./index.js');



program
  .option('-x, --xxx', '这里是调试xxx')
  // 添加子命令
  // 默认以空格分隔任务，如果想要获取用户完整的话需要处理一下。
program
  .command('add')
  .description('add a task')
  .action((...args) => {
    let addWords = args.slice(0,-1).join(' ');
    api.add(addWords)
  });

program
  .command('clear')
  .description('clear all tasks')
  .action((...args) => {
    api.clear();
  });


program.parse(process.argv);

if (program.xxx){
  console.log('xxxxxxxxxxxxxxxx')
}


//观察node.js传递的参数
// node cli 得到的结果就是：[ 'C:\\Program Files\\nodejs\\node.exe','C:\\Users\\yinhaiying\\Desktop\\node-todo\\cli' ]
// console.log(process.argv);
if(process.argv.length === 2){
  // 说明用户直接运行node cli.js
  api.showAll();
}
