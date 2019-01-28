function httpGetAsync(method, payload, theUrl, callback)
{
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText)
  }
  xmlHttp.open(method, theUrl, true); // true for asynchronous
  xmlHttp.setRequestHeader("Content-Type", "application/json")
  xmlHttp.send((payload)?(JSON.stringify(payload)):(null))
}

function validateSchema(text, callback) {
  httpGetAsync("POST", {
    input: text
  }, "/validate", (resultText) => {
    const result = JSON.parse(resultText || '{}')
    if(result) {
      if(result.result) {
        callback((result.result || "").replace(/\\n/, "\n"))
      } else {
        callback(("#  "+(result.error || "")).replace(/\\n/, "\n#  "))
      }
    } else {
      callback("")
    }
  })
}

function handleEditorInputChange() {
    var text = editorInput.getSession().getValue()
    validateSchema(text, (result) => {
        editorOutput.getSession().setValue(result)
    })
}

var editorInput = ace.edit("editorInput")
editorInput.setTheme("ace/theme/github")
editorInput.getSession().setMode("ace/mode/graphqlschema")

var editorOutput = ace.edit("editorOutput")
editorOutput.setTheme("ace/theme/github")
editorOutput.getSession().setMode("ace/mode/graphqlschema")

editorInput.getSession().on('change', handleEditorInputChange)
setTimeout(handleEditorInputChange, 250)