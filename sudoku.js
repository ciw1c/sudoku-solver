SIZE = 9

var sudoku = Array(SIZE).fill().map(()=>Array(SIZE).fill(0));
var original_sudoku = Array(SIZE).fill().map(()=>Array(SIZE).fill(0));

var row_possibles_by_number = Array(SIZE).fill().map(()=>Array(SIZE).fill(true));
var col_possibles_by_number = Array(SIZE).fill().map(()=>Array(SIZE).fill(true));
var sqr_possibles_by_number = Array(SIZE).fill().map(()=>Array(SIZE).fill(true));

function print_sudoku() {
  for (var i=0; i<SIZE; i++) {
    for (var j=0; j<SIZE; j++) {
      if (sudoku[i][j] != 0)
        $("#sudoku_table").find("input[data-row='" + i + "'][data-col='" + j + "']").val(sudoku[i][j]);
      else
        $("#sudoku_table").find("input[data-row='" + i + "'][data-col='" + j + "']").val('');
    }
  }
}

function clear_sudoku() {
  $("#sudoku_table input").find.val('');
}

function copy_original_sudoku() {
  for (var i=0; i<SIZE; i++) {
    for (var j=0; j<SIZE; j++) {
      sudoku[i][j] = original_sudoku[i][j]
      if (original_sudoku[i][j] != 0)
        update_aux_structures(original_sudoku[i][j]-1,i,j,false);
    }
  }
}

function reset_aux_structures() {
  sudoku = Array(SIZE).fill().map(()=>Array(SIZE).fill(0));
  row_possibles_by_number = Array(SIZE).fill().map(()=>Array(SIZE).fill(true));
  col_possibles_by_number = Array(SIZE).fill().map(()=>Array(SIZE).fill(true));
  sqr_possibles_by_number = Array(SIZE).fill().map(()=>Array(SIZE).fill(true));
}

function update_aux_structures(n,i,j,possible) {
  row_possibles_by_number[n][i] = possible;
  col_possibles_by_number[n][j] = possible;
  sqr = (Math.trunc(j/3)) + (Math.trunc(i/3)*3);
  sqr_possibles_by_number[n][sqr] = possible;
}

function reset_sudoku() {
  reset_aux_structures();
  copy_original_sudoku();
  print_sudoku();
}

async function read_sudoku(file) {
  original_sudoku = Array(SIZE).fill().map(()=>Array(SIZE).fill(0));
  text = await (new Response(file)).text();
  text_rows = text.split('\n');
  for (i=0; i<SIZE; i++) {
    for (j=0; j<SIZE; j++) {
      if (text_rows[i][j] != '-')
        original_sudoku[i][j] = text_rows[i][j].charCodeAt() - '0'.charCodeAt()
    }
  }
  reset_sudoku();
}

function solve_sudoku() {
  if (solve_sudoku_rec(0,0))
    print_sudoku();
  else
    console.log('JODETE');
}

function is_possible(i,j,n) {
  sqr = (Math.trunc(j/3)) + (Math.trunc(i/3)*3);
  return (row_possibles_by_number[n][i] && col_possibles_by_number[n][j] && sqr_possibles_by_number[n][sqr]);
}

function is_fixed(i,j) {
  return (original_sudoku[i][j] != 0);
}

function solve_sudoku_rec(i,j) {
  // Buscamos la siguiente posicion a rellenar
  let i_next = i;
  let j_next = j + 1;
  if (j_next == SIZE) {
    i_next = i + 1;
    j_next = 0;
  }
  
  // Terminamos el SUUUdoku
  if (i == SIZE)
    return true;
  
  // Si estamos en posicion fija en el sudoku original, devolvemos siguiente pos
  if (is_fixed(i,j))
    return solve_sudoku_rec(i_next,j_next);

  // Probamos los números posibles
  for (let n=0; n<SIZE; n++) {
    if (is_possible(i,j,n)) {
      console.log(i, j, n);
      sudoku[i][j] = (n+1);
      update_aux_structures(n,i,j,false);
      if (solve_sudoku_rec(i_next,j_next))
        return true;
      sudoku[i][j] = 0;
      update_aux_structures(n,i,j,true);
    }
  }
  return false;
}