var spreadsheets = Array();

function Spreadsheet(textarea) {
  var iframe = document.createElement("iframe");
  iframe.style.width = textarea.getBoundingClientRect().width;
  iframe.style.height = textarea.getBoundingClientRect().height;
  iframe.innerHTML = "<html><body>HI</body></html>";
  textarea.parentNode.insertBefore(iframe,textarea);
  textarea.style.display = "none";

  setTimeout(function() {
    //Getting the iframe document
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

    var table = iframe.doc.createElement("table");
    iframe.doc.body.appendChild(table);

    rows = textarea.value.split(/\r\n|\r|\n/);
    var n_rows = rows.length;
    var n_cols = 0;
    rows.forEach(function(row,i,arr) {
      var cols = row.split(/\t|,/);
      if(cols.length > n_cols) n_cols = cols.length;
      arr[i] = cols;
    });
    
    var header = iframe.doc.createElement("tr");
    header.appendChild(iframe.doc.createElement("th"));
    for(var i = 0;i < n_cols;i++) {
      var head = iframe.doc.createElement("th");
      head.appendChild(iframe.doc.createTextNode(String.fromCharCode(65 + i)));
      header.appendChild(head);
    }
    var addCol = iframe.doc.createElement("th");
    addCol.appendChild(iframe.doc.createTextNode("+"));
    header.appendChild(addCol);
    table.appendChild(header);

    rows.forEach(function(row,i) {
      var row_e = iframe.doc.createElement("tr");
      table.appendChild(row_e);
      var label = iframe.doc.createElement("th");
      label.appendChild(iframe.doc.createTextNode(i + 1));
      row_e.appendChild(label);

      row.forEach(function(col) {
        var cell = iframe.doc.createElement("td");
        row_e.appendChild(cell);
        var textfield = iframe.doc.createElement("input");
        textfield.type = "text";
        textfield.value = col;
        cell.appendChild(textfield);
      });
    });

    var footer = iframe.doc.createElement("tr");
    var addRow = iframe.doc.createElement("th");
    addRow.appendChild(iframe.doc.createTextNode("+"));
    footer.appendChild(addRow);
    table.appendChild(footer);

  },1);
}
