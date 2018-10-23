function selectionRange(el){
  var selection = window.getSelection()
  if (!selection.rangeCount) return;
  var indexes = {};
  var range = selection.getRangeAt(0);
  var clone = range.cloneRange();
  clone.selectNodeContents(el);
  clone.setEnd(range.endContainer, range.endOffset);
  indexes.end = clone.toString().length;
  clone.setStart(range.startContainer, range.startOffset);
  indexes.start = indexes.end - clone.toString().length;
  indexes.atStart = clone.startOffset === 0;
  indexes.commonAncestorContainer = clone.commonAncestorContainer;
  indexes.endContainer = clone.endContainer;
  indexes.startContainer = clone.startContainer;
  return indexes;
}
function getLine(plain, cursorPos){
  const startSlice = plain.slice(0, cursorPos);
  const lastNewline = startSlice.lastIndexOf('\n') + 1;
  const lineSlice = startSlice.slice(lastNewline);
  return lineSlice
}
var indentRe = /^\s+/;
function getIndent(plain, cursorPos){
  const line = getLine(plain, cursorPos);
  const matches = line.match(indentRe);
  if (matches === null) {
    return '';
  }
  return matches[0] || '';
}
function edit(html){
  if (event.keyCode === 9) { // Tab Key
    document.execCommand('insertHTML', false, '  ')
    event.preventDefault()
  }
  if(event.keyCode==13){ // Enter Key
    var ranges = selectionRange(document.getElementById("prism"))
    var indentation = getIndent(document.getElementById("prism").innerHTML, ranges.start)
    indentation = indentation + "  "
    document.execCommand('insertHTML', false, '\n' + indentation)
    event.preventDefault()
  }
}
(function(){
  var mountNode = document.getElementById("root");
  var jsx = `
  class App extends React.Component {
    constructor() {
      super()
      this.state = { count: 0 }
    }
    componentDidMount() {
      this.interval = setInterval(() => {
        this.setState(state => ({ count: state.count + 1 }))
      }, 1000)
    }
    componentWillUnmount() {
      clearInterval(this.interval)
    }
    render() {
      return (
        <center>
          <h3>
            {this.state.count}
          </h3>
        </center>
       )
    }
  }

  ReactDOM.render(
    <App/>
    ,mountNode
  )
    `;
  jsx = window.code !== '' ? window.code.replace(/&gt;/g,'>').replace(/&lt;/g,"<") : jsx
  document.getElementById("prism").innerHTML = Prism.highlight(jsx, Prism.languages.js);
  function createJSX(){
    var obj = null,mountNode = document.getElementById("root");
    obj = document.createElement("script");
    try{
      obj.innerHTML = ['try{',
        "var mountNode = document.getElementById(\"root\");",
        Babel.transform(
          document.getElementById("prism").innerText,
          { presets:
            [ 
              Babel.availablePresets.es2015, 
              Babel.availablePresets.react,
              Babel.availablePresets['stage-0']
            ]
          }
        ).code,
        "mountNode = null;",
      '}catch(err){',
      "mountNode.innerHTML = '",
      "<pre class=\"error\">'+",
      "err",
      "+'</pre>';",
      "mountNode = null;",
      '}'].join('');
      document.body.appendChild(obj);
      obj.remove();      
    }catch(err){
      err = err.codeFrame.replace(/\>/g,'&gt;').replace(/\</g,'&lt;');
      mountNode.innerHTML = '<pre class="error">'+ err +'</pre>';
    }
  }
  createJSX();  
  document.getElementById("react-demo").addEventListener("input", function(event){
    createJSX();
  }, false);
})()

$('.save').click(function () { 
  var code = document.getElementById("prism").innerText
  $.post('/api/code/create', {
    code:code
  }, function (data) {
    console.log(data.status)
    if (data.status === 0) {
      location.href = '/code?id=' + data.data.id      
    }
  })
})