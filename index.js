
const db = require('./db.js');
const inquirer = require('inquirer');
// 添加任务
module.exports.add = async (title) => {
  // 读取之前的任务
  const list =await db.read();
  // 往list里面添加任务
  list.push({title,done:false})
  //存储任务到文件
  await db.write(list);
}

//清除任务
module.exports.clear = async () => {
  await db.write([])
}

//展示所有任务

module.exports.showAll = async () => {
    // 读取之前的任务
    const list = await db.read();
    //打印之前的任务
    printTasks(list);
}



function markAsDone(list,index){
  list[index].done = true;
  db.write(list);
}

function markAsUnDone(list,index){
  list[index].done = false;
  db.write(list);
}

function updateTitle(list,index){
  inquirer.prompt(  {
    type: 'input',
    name: 'title',
    message: "请输入新的标题",
    default: list[index].title
  },).then(newTitle => {
    console.log(newTitle)
    list[index].title = newTitle.title;
    db.write(list);
  });
}

function removeTask(list,index){
  list.splice(index,1);
  db.write(list);
}



function askForAction(list,index){
  const actions = {
    markAsDone,
    markAsUnDone,
    updateTitle,
    removeTask
  }
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: '请选择操作?',
      choices: [
        {name:'退出',value:'quit'},
        {name:'已完成',value:'markAsDone'},
        {name:'未完成',value:'markAsUnDone'},
        {name:'改标题',value:'updateTitle'},
        {name:'删除',value:'remove'}
      ]
    }
  ]).then((answer2) => {
    const action = actions[answer2.action];
    action && action(list,index);
  })
}


function askForCreateTask(list){
  inquirer.prompt(  {
    type: 'input',
    name: 'title',
    message: "请输入任务"
  },).then(newTask => {
    list.push({title:newTask.title,done:false});
    db.write(list);
  });
}

function printTasks(list){
  inquirer.prompt([
    {
      type: 'list',
      name: 'index',
      message: '请选择你想操作的任务?',
      choices: [...list.map((item,index) => {
        return {
          name:`${item.done?'[x]':'[_]'}-${index + 1}-${item.title}`,
          value:index.toString()
        }
      }),{name:'-退出',value:'-1'},{name:"+创建任务",value:"-2"}]
    }
  ])
  .then(answer => {
    const index = parseInt(answer.index);
    if(index >= 0){
      //选中任务
      askForAction(list,index);
    }else if(answer.index == -2){
      // 创建任务
      askForCreateTask(list);
    }
  });
}





