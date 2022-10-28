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
  
  $('.input-number').on('change', function() {
    apply_delete(this);
  });
}

function apply_delete(elem) {
  if ($(elem).val() == '') {
    let i = $(elem).data('row');
    let j = $(elem).data('col');
    let n = sudoku[i][j];
    update_aux_structures(n-1,i,j,true);
    sudoku[i][j] = 0;
  }
}

function sudoku_digits(event) {
  if (event.key < '1' || event.key > '9') 
    event.preventDefault();
  else {
    let i = $(event.target).data('row');
    let j = $(event.target).data('col');
    let n = event.keyCode - '0'.charCodeAt();
    if (!is_valid_digit(i,j,n)) 
      event.preventDefault();
    else
      $(event.target).val('');
  }
}