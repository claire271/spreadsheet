var spreadsheets = Array();

function Spreadsheet(textarea) {
  spreadsheets.push(this);
  var instance = this;

  var table;
  var n_rows;
  var n_cols;

  var iframe = document.createElement("iframe");
  iframe.style.width = textarea.getBoundingClientRect().width;
  iframe.style.height = textarea.getBoundingClientRect().height;
  iframe.innerHTML = "<html><body>HI</body></html>";
  textarea.parentNode.insertBefore(iframe,textarea);
  textarea.style.display = "none";

  setTimeout(function() {
    //Getting the iframe document
    //**********
    //Code taken from http://thomas.bindzus.me/2007/12/24/adding-dynamic-contents-to-iframes/
    // Initiate the iframe's document to null
    iframe.doc = null;
    
    // Depending on browser platform get the iframe's document, this is only
    // available if the iframe has already been appended to an element which
    // has been added to the document
    if(iframe.contentDocument)
      // Firefox, Opera
      iframe.doc = iframe.contentDocument;
    else if(iframe.contentWindow)
      // Internet Explorer
      iframe.doc = iframe.contentWindow.document;
    else if(iframe.document)
      // Others?
      iframe.doc = iframe.document;
    //**********

    table = iframe.doc.createElement("table");
    iframe.doc.body.appendChild(table);

    rows = textarea.value.split(/\r\n|\r|\n/);
    n_rows = rows.length;
    n_cols = 0;
    rows.forEach(function(row,i,arr) {
      var cols = row.split(/\t/);
      if(cols.length > n_cols) n_cols = cols.length;
      arr[i] = cols;
    });
    
    var header = iframe.doc.createElement("tr");
    var topLeft = iframe.doc.createElement("th");
    header.appendChild(topLeft);
    topLeft.style.minWidth = "4em";
    for(var i = 0;i < n_cols;i++) {
      var head = iframe.doc.createElement("th");
      header.appendChild(head);
      head.appendChild(iframe.doc.createTextNode(String.fromCharCode(65 + i)));
      var button = iframe.doc.createElement("button");
      button.appendChild(iframe.doc.createTextNode("x"));
      (function() {
        var index = i;
        button.onclick = function() { instance.delColumn(index); };
      })();
      head.appendChild(button);
    }
    var addCol = iframe.doc.createElement("th");
    var addColB = iframe.doc.createElement("button");
    addColB.appendChild(iframe.doc.createTextNode("+"));
    addColB.onclick = function() { instance.addColumn(); };
    addCol.appendChild(addColB);
    header.appendChild(addCol);
    table.appendChild(header);

    rows.forEach(function(row,i) {
      var row_e = iframe.doc.createElement("tr");
      table.appendChild(row_e);
      var label = iframe.doc.createElement("th");
      label.appendChild(iframe.doc.createTextNode(i + 1));
      var button = iframe.doc.createElement("button");
      button.appendChild(iframe.doc.createTextNode("x"));
      (function() {
        var index = i;
        button.onclick = function() { instance.delRow(index); };
      })();
      label.appendChild(button);
      row_e.appendChild(label);

      for(var i = 0;i < n_cols;i++) {
        var cell = iframe.doc.createElement("td");
        row_e.appendChild(cell);
        var textfield = iframe.doc.createElement("input");
        textfield.type = "text";
        textfield.value = (i < rows.length) ? row[i] : "";
        cell.appendChild(textfield);
      };
    });

    var footer = iframe.doc.createElement("tr");
    var addRow = iframe.doc.createElement("th");
    var addRowB = iframe.doc.createElement("button");
    addRowB.appendChild(iframe.doc.createTextNode("+"));
    addRowB.onclick = function() { instance.addRow(); };
    addRow.appendChild(addRowB);
    footer.appendChild(addRow);
    table.appendChild(footer);
  },1);

  this.addRow = function() {
    var row_e = iframe.doc.createElement("tr");
    table.insertBefore(row_e,table.children[n_rows + 1]);
    var label = iframe.doc.createElement("th");
    label.appendChild(iframe.doc.createTextNode(1 + n_rows));
    var button = iframe.doc.createElement("button");
    button.appendChild(iframe.doc.createTextNode("x"));
    (function() {
      var index = n_rows;
      button.onclick = function() { instance.delRow(index); };
    })();
    label.appendChild(button);
    row_e.appendChild(label);
    
    for(var i = 0;i < n_cols;i++) {
      var cell = iframe.doc.createElement("td");
      row_e.appendChild(cell);
      var textfield = iframe.doc.createElement("input");
      textfield.type = "text";
      cell.appendChild(textfield);
    }

    n_rows++;
  }
  
  this.addColumn = function() {
    var header = table.children[0];
    var head = iframe.doc.createElement("th");
    head.appendChild(iframe.doc.createTextNode(String.fromCharCode(65 + n_cols)));
    var button = iframe.doc.createElement("button");
    button.appendChild(iframe.doc.createTextNode("x"));
    (function() {
      var index = n_cols;
      button.onclick = function() { instance.delColumn(index); };
    })();
    head.appendChild(button);
    header.insertBefore(head,header.children[n_cols + 1]);

    for(var i = 0;i < n_rows;i++) {
      var row_e = table.children[i + 1];
      var cell = iframe.doc.createElement("td");
      row_e.appendChild(cell);
      var textfield = iframe.doc.createElement("input");
      textfield.type = "text";
      cell.appendChild(textfield);
    }

    n_cols++;
  }

  this.delRow = function(index) {
    table.children[index + 1].remove();
    for(var i = 0;i < n_rows - 1;i++) {
      var label = table.children[i + 1].children[0];
      label.innerHTML = "";
      label.appendChild(iframe.doc.createTextNode(1 + i));
      var button = iframe.doc.createElement("button");
      button.appendChild(iframe.doc.createTextNode("x"));
      (function() {
        var ind = i;
        button.onclick = function() { instance.delRow(ind); };
      })();
      label.appendChild(button);
    }

    n_rows--;
  }

  this.delColumn = function(index) {
    for(var i = 0;i < n_rows + 1;i++) {
      table.children[i].children[index + 1].remove();
    }

    for(var i = 0;i < n_cols - 1;i++) {
      var head = table.children[0].children[i + 1];
      head.innerHTML = "";
      head.appendChild(iframe.doc.createTextNode(String.fromCharCode(65 + i)));
      var button = iframe.doc.createElement("button");
      button.appendChild(iframe.doc.createTextNode("x"));
      (function() {
        var ind = i;
        button.onclick = function() { instance.delColumn(ind); };
      })();
      head.appendChild(button);
    }

    n_cols--;
  }

  this.export = function() {
    var output = "";
    for(var i = 0;i < n_rows;i++) {
      var row = table.children[i + 1];
      for(var j = 0;j < n_cols;j++) {
        output += row.children[j + 1].children[0].value;
        output += (j < n_cols - 1) ? "\t" : (i < n_rows - 1) ? "\n" : "";
      }
    }
    return output;
  }
}
