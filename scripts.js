function init_js() {
  init_sudoku();
}

function init_sudoku() {
  sudoku_tbody = $('#sudoku_table > tbody');
  rows = 0;
  for (var i=0; i<9; i++) {
    tr = document.createElement('tr');
    cols = 0;
    for (var j=0; j<9; j++) {
      number = "<td><input type='text' class='input-number' data-row='" + i + "' data-col='" + j + "' maxlength=1 onkeypress='sudoku_digits(event)'></td>"
      $(tr).append(number);
      if (cols % 3 == 0) {
        $(tr).find('td').last().addClass('left-border-strong');
      }
      cols++;
    }
    if (rows % 3 == 0) 
      $(tr).addClass('top-border-strong');
    rows++;
    sudoku_tbody.append(tr);
  }

  $('.input-number').on('input', function() {
    validate_sudoku_digits(this);
  });
}

function sudoku_digits(event) {
  if (event.key < '1' || event.key > '9') 
    event.preventDefault();
  else
    $(event.target).val('');
}

function validate_sudoku_digits(elem) {
  if ($(elem).val() < '1' || $(elem).val() > '9')
    $(elem).val('');
}