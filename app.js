/*
  DESIGN CHOICES:
      - 入力文字列を空白で分割して文字列の配列に変換します。
      - この文字列の入力配列には、3つの要素 パッケージ名 コマンド 引数が含まれる必要があります。
      - parsedStringInputArrayが有効な場合は、専用ハンドラに渡して適切な組み込みJSを実行し、文字列のレスポンスを生成します。
      - 入力の検証を2つのステップに分けます: すべてのコマンドを対象とした検証と、特定のコマンドを対象とした入力の検証です。
      - 入力が有効でない場合は、エラーメッセージを生成して、ユーザーが別の方法でどうすれば良いかを伝えます。
      - ハンドラから情報を受け取り、CLIOutputDivにDOMparagraphを追加する、専用のビュー関数で生成されるレスポンス 
*/

let CLIText = document.getElementById('CLITextInput');
let CLIOutput = document.getElementById('CLIOutputDiv');

CLIText.addEventListener('keyup', (event) => {
  let ans;
  if (event.key == 'Enter') {
    let obj = MTools.devideArray(CLIText.value);
    if (!obj.isValid) {
      CLIOutput.innerHTML += `
      <p class="m-0">
      <span style="color: red">${obj.err}</span>
      </p>
      `;
      CLIText.value = '';
      return;
    } else {
      let calcVal = obj.arr[1].split(',');
      if (calcVal.length > 1) {
        obj.arr[1] = calcVal;
        ans = MTools.doubleCalc(obj.arr);
        console.log(ans);
      } else ans = MTools.singleCalc(obj.arr);
    }
    CLIOutput.innerHTML += `
    <p class="m-0">
    <span style="color: green">student</span>
    <span style="color: magenta">@</span>
    <span style="color: blue">recursionist</span>: ${CLIText.value}
  </p>
    <p class="m-0">
    <span style="color: blue">MTools</span>
    <span>: your result is: ${ans}</span>
  </p>
    `;
    CLIText.value = '';
  }
});

class MTools {
  static devideArray(val) {
    let arr = val.split(' ');
    if (arr[0] !== 'MTools') {
      return { isValid: false, err: 'something went happend' };
    }
    arr = arr.splice(1, 2);
    return { isValid: true, arr };
  }

  static doubleCalc(val) {
    let doubleArgumentCommands = [
      'add',
      'subtract',
      'divide',
      'multiply',
      'exp',
      'log',
    ];
    if (doubleArgumentCommands.indexOf(val[0]) > -1) {
      let argA = Number(val[1][0]);
      let argB = Number(val[1][1]);

      switch (val[0]) {
        case 'add':
          return argA + argB;
        case 'subtract':
          return argA - argB;
        case 'divide':
          return argA / argB;
        case 'exp':
          return Math.pow(argA, argB);
        case 'log':
          return Math.log(argA) / Math.log(argB);
      }
    }
  }

  static singleCalc(val) {
    let singleArgumentCommands = ['abs', 'sqrt', 'ceil', 'round', 'floor'];
    if (singleArgumentCommands.indexOf(val[0]) > -1) {
      switch (val[0]) {
        case 'abs':
          return Math.abs(val[1]);
        case 'sqrt':
          return Math.sqrt(val[1]);
        case 'ceil':
          return Math.ceil(val[1]);
        case 'round':
          return Math.round(val[1]);
        case 'floor':
          return Math.floor(val[1]);
      }
    }
  }
}
