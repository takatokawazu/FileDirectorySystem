/*
touch [fileOrDirName]: // 指定した名前のファイルをカレントディレクトリに作成します。ファイルまたはディレクトリが既に存在する場合は、ノードのdateModified値を現在の日付に更新します。
mkDir [dirName]: // 与えられた名前でカレントディレクトリに新しいディレクトリを作成します。
ls [?fileOrDirName]: // ターゲットノードがディレクトリの場合、ターゲットディレクトリノードの直下の全てのファイルリストを出力します。ターゲットノードがファイルの場合、与えられたノードのみ出力します。引数が存在しない場合、カレントディレクトリの全てのファイルリストを出力します。
cd [..| dirName]: // 現在の作業ディレクトリを指定されたものに変更します。引数が'..'の場合はカレントディレクトリを親ディレクトリに、そうでない場合はカレントディレクトリをカレントディレクトリ内のdirNameに変更します。
pwd []: // 現在の作業ディレクトリのパスを出力します。
print [fileName]: // カレントディレクトリ内の指定されたfileNameの.content値（ファイルの情報）を表示します。
setContent [fileName]: // 与えられたfileNameの.content値をカレントディレクトリに設定します。
rm [fileOrDirName]: // 指定したfileOrDirNameのファイルまたはディレクトリをカレントディレクトリから削除します。
*/

let CLITextInput = document.getElementById('CLITextInput');
let CLIOutputDiv = document.getElementById('CLIOutputDiv');

const config = {
  CLIOutputDiv: 'CLIOutputDiv',
  CLITextInput: 'CLITextInput',
  CommandList: [
    'touch',
    'mkdir',
    'ls',
    'cd',
    'pwd',
    'print',
    'setContent',
    'rm',
  ],
};

class Node {
  constructor(data, type, parent) {
    this.data = data;
    this.parent = parent;
    this.type = type;
    let tempDate = new Date(Date.now());
    this.createDate = tempDate.toDateString() + ' ' + tempDate.toTimeString();
    this.content = this.type == 'file' ? 'empty' : 'This is directory';
    this.next = null;
    this.prev = null;
    this.list = new LinkedList();
  }

  setType(type) {
    this.type = type;
  }

  getChildNodeList() {
    return this.list;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = this.head;
  }

  search(key) {
    let iterator = this.head;
    while (iterator != null) {
      if (iterator.data === key) break;
      iterator = iterator.next;
    }
    return iterator;
  }

  addLast(data, type, parent) {
    let newNode = new Node(data, type, parent);
    if (this.head === null) {
      this.head = newNode;
      this.tail = this.head;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      newNode.next = null;
      this.tail = newNode;
    }
  }

  popFront() {
    if (this.head === null) return;
    this.head = this.head.next;

    if (this.head != null) this.head.next = null;
    else this.tail = null;
  }

  popLast() {
    if (this.tail === null) return;
    this.tail = this.tail.prev;

    if (this.tail != null) this.tail.next = null;
    else this.tail = null;
  }

  remove(key) {
    let iterator = this.head;
    while (iterator != null) {
      if (iterator.data == key) break;
      iterator = iterator.next;
    }

    if (iterator === this.head) this.popFront();
    else if (iterator === this.tail) this.popLast();
    else {
      iterator.prev.next = iterator.next;
      iterator.next.prev = iterator.prev;
    }
  }

  toString() {
    let iterator = this.head;
    let str = '';
    if (iterator === null) return str;

    while (iterator.next != null) {
      str += iterator.data + ' ';
      iterator = iterator.next;
    }
    str += iterator.data;
    return str;
  }
}

class FileSystem {
  constructor() {
    this.root = new Node('root');
    this.currentDir = this.root;
  }

  ls(key) {
    if (key === undefined) {
      return this.currentDir.getChildNodeList().toString();
    }

    let target = this.currentDir.list.search(key);
    if (target === null) return;
    else if (target.type === 'file') return target.data;
    else if (target.type === 'dir') return target.getChildNodeList().toString();
    else return 'no file in this directory';
  }

  touch(fileName, parent = this.currentDir) {
    if (this.currentDir.getChildNodeList().search(fileName) === null) {
      this.currentDir.list.addLast(fileName, 'file', parent);
      return `created ${fileName} (file)`;
    } else return 'This file name already exists';
  }

  mkdir(dirName, parent = this.currentDir) {
    if (this.currentDir.getChildNodeList().search(dirName) === null) {
      this.currentDir.list.addLast(dirName, 'dir', parent);
      return `created ${dirName} (dir)`;
    } else return 'This directory name already exists';
  }

  print(fileName) {
    let target = this.currentDir.list.search(fileName);
    if (target !== null) return target.content;
    else return 'there is no such file';
  }

  cd(cmd) {
    if (cmd === undefined) return;
    if (cmd === '..' && this.currentDir == this.root) return;
    else if (cmd === '..') this.currentDir = this.currentDir.parent;
    else
      this.currentDir =
        this.currentDir.list.search(cmd).type === 'dir'
          ? this.currentDir.list.search(cmd)
          : this.currentDir;
  }

  pwd() {
    let iterator = this.currentDir;
    let str = '';
    while (iterator != this.root) {
      str += iterator.data + '/';
      iterator = iterator.parent;
    }
    const sortedString = str
      .split('/')
      .filter((char) => char !== '') // 空の要素を除外
      .sort()
      .join('/');
    return iterator.data + '/' + sortedString;
  }

  setContent(fileName, comment) {
    let target = this.currentDir.list.search(fileName);
    if (target !== null) target.content = comment;
    else return 'there is no such file';
  }

  print(fileName) {
    let target = this.currentDir.list.search(fileName);
    if (target != null) return target.content;
    else return 'there is no such file';
  }

  rm(fileOrDir) {
    let target = this.currentDir.list.search(fileOrDir);
    if (target !== null) this.currentDir.list.remove(fileOrDir);
  }
}

class Controller {
  static commandLineParser(val) {
    let arr = val.split(' ');
    if (!config.CommandList.includes(arr[0])) return [];

    return arr;
  }

  static universalValidator(arr) {
    let oneArg = ['touch', 'mkdir', 'print', 'cd', 'rm'];

    if (arr[0] == 'pwd' && arr.length == 1) return true;
    else if (arr[0] == 'setContent' && arr.length == 3) return true;
    else if (arr[0] == 'ls' && (arr.length == 1 || arr.length == 2))
      return true;
    else if (oneArg.includes(arr[0]) && arr.length == 2) return true;
    else return false;
  }

  static runCommand(arr, fs) {
    switch (arr[0]) {
      case 'ls':
        if (arr[1] === undefined) return fs.ls();
        else return fs.ls(arr[1]);
      case 'touch':
        return fs.touch(arr[1]);
      case 'mkdir':
        return fs.mkdir(arr[1]);
      case 'print':
        return fs.print(arr[1]);
      case 'cd':
        fs.cd(arr[1]);
        break;
      case 'pwd':
        return fs.pwd();
      case 'setContent':
        return fs.setContent(arr[1], arr[2]);
      case 'rm':
        return fs.rm(arr[1]);
      default:
        return 'Error. There is no command your inputting';
    }
  }

  static appendErrorParagraphCommandMiss(parentDiv) {
    parentDiv.innerHTML += `<p class="m-0">
                <span style='color:red'>CLIError</span>: invalid input. must take form "commandName [arguments]. CommandNames are 'ls', 'cd','pwd','print','setContent','touch','rm','mkdir'. "
               
            </p>`;

    return;
  }

  static appendErrorParagraphArgumentsMiss(parentDiv) {
    parentDiv.innerHTML += `<p class="m-0">
                <span style='color:red'>CLIError</span>: invalid input. Commands 'cd','print','touch','rm','mkdir' need only one argument.Command 'pwd' doesn't need an argument. Command 'ls' needs nothing or one arguments. "
               
            </p>`;

    return;
  }

  static appendMirrorParagraph(parentDiv) {
    parentDiv.innerHTML += `<p class="m-0">
            <span style='color:green'>student</span>
            <span style='color:magenta'>@</span>
            <span style='color:blue'>recursionist</span>
            : ${CLITextInput.value}
        </p>`;

    return;
  }

  static appendResultParagraph(parentDiv, result) {
    if (result !== undefined) {
      parentDiv.innerHTML += `
      <p class="m-0">
        <span style='color: '></span>: ${result}
      </p>
      `;
      return;
    }
  }
}

let fs = new FileSystem();

CLITextInput.addEventListener('keyup', (event) => submitSearch(event, fs));

function submitSearch(event, fs) {
  if (event.key === 'Enter') {
    let arr = Controller.commandLineParser(CLITextInput.value);

    Controller.appendMirrorParagraph(CLIOutputDiv);
    CLITextInput.value = '';

    if (arr.length == 0) {
      Controller.appendErrorParagraphCommandMiss(CLIOutputDiv);
      CLIOutputDiv.scrollTop = CLIOutputDiv.scrollHeight;
      CLITextInput.value = '';
      console.log('error 妥当な文字列ではないです。');
      return;
    }

    if (!Controller.universalValidator(arr)) {
      Controller.appendErrorParagraphArgumentsMiss(CLIOutputDiv);
      CLITextInput.value = '';
      console.log('error 引数が正しくないです。');
      return;
    }

    let result = Controller.runCommand(arr, fs);
    console.log(result);
    console.log(fs.currentDir);
    Controller.appendResultParagraph(CLIOutputDiv, result);
    CLIOutputDiv.scrollTop = CLIOutputDiv.scrollHeight;
  }
}
