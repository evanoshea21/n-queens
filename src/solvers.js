/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

/*
instantiate board

declare helper function with row counter parameter:
  access row[rowCount]
  iterate over row:
    toggle index
    if !row, column, diag check:
      recurse helper(rowCount++)
    else:
    toggle index;
    return;

*/


window.findNRooksSolution = function(n) {
  //debugger;
  var board = new Board({n: n});


  var helperFunc = function(currentRow) {
    if(currentRow >= n) {
      return;
    }


    for(var c = 0; c < board.rows().length; c++) {
      board.togglePiece(currentRow, c);
      if(!board.hasRowConflictAt(currentRow) && !board.hasColConflictAt(c) ) {
        helperFunc(currentRow + 1);
      } else {
        board.togglePiece(currentRow, c);
      }
    }
  };
  helperFunc(0);
  return board.rows();

    //create makeEmptyMatrix(n) (helper func)
    // //debugger;
    // var matrix = makeEmptyMatrix(n);
    // //nested forloop to travers matrix rows-cols
    // var c = 0;
    // for(var r = 0; r < matrix.length; r++) {
      //for(var c = 0; c <matrix.length; c++) {
        // matrix[r][c] = 1;
        // if(hasRowConflictAt(r) || hasColConflictAt(c)) {
        //   matrix[r][c] = 0;
        // }
     // }
    //  c++;
    // }
    // //place down a rook on current spot (changing matrix)
    // //check if rowConflict + colConflict, both false
    // //if one^ true remove rook, move on
    // var solution = matrix; //fixed?

    // console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
    //  return matrix;
  };

  // return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
  window.countNRooksSolutions = function(n) {
 // debugger;
    var board = new Board({n: n});
    var solsCount = 0;

   var helperFunc = function(currentBoard, currentRow) {
     var solutions = 0;
    //go through entire row, placing pieces where you can
     for(var c = 0; c <board.attributes[0].length; c++) {
      currentBoard.togglePiece(currentRow, c);
      //if there's no conflict with our current placement...
      if(!currentBoard.hasColConflictAt(c) && !currentBoard.hasRowConflictAt(currentRow)) {
        //..if we places all our pieces, return 1 (which is one solution)
          //can't keep track of current pieces bc of recursion.. another solution:
          //if you're on the last row and you placed a piece
        if(currentRow === n-1) {
          currentBoard.togglePiece(currentRow, c);
          return 1;
        }
        //otherwise, now with our current placement, do recursion with new board on next row
        solutions += helperFunc(currentBoard, currentRow+1);
        //toggle back this piece, so you can iterate for loop down row some more (see if more potential solutions)
      }
      currentBoard.togglePiece(currentRow, c);

     }//end for loop (traversed the entire row)
     return solutions; //aka accumulator

   }; //end recursive FUNC

   solsCount += helperFunc(board, 0);

   return solsCount;





    // var factorialize = function(n) {
    //   if(n === 1) {
    //     return 1;
    //   }
    //   return n * factorialize(n-1);
    // }
    // var solsCount = factorialize(n);

    // // console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
    //  return solsCount;
  };

  // return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
  window.findNQueensSolution = function(n) {
   //debugger;
    var board = new Board({n: n});
    if(n===0) {
      return board.rows();
    }


  var helperFunc = function(currentRow) {
    if(currentRow >= n) {
      return;
    }


    for(var c = 0; c < board.rows().length; c++) {
      board.togglePiece(currentRow, c);
      var noDiagConcflict = !board.hasAnyMajorDiagonalConflicts() && !board.hasAnyMinorDiagonalConflicts();
      if(!board.hasRowConflictAt(currentRow) && !board.hasColConflictAt(c) && noDiagConcflict) {
        helperFunc(currentRow + 1);
      } else {
        board.togglePiece(currentRow, c);
      }
    }
  };
  helperFunc(0);
  return board.rows();

    // var solution = board.row(); //fixme

    // console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
    // return solution;
  };

  // return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
  window.countNQueensSolutions = function(n) {

    if(n === 0) {
      return 0;
    }
    var board = new Board({n: n});
    var solsCount = 0;

   var helperFunc = function(currentBoard, currentRow) {
     var solutions = 0;
    //go through entire row, placing pieces where you can
     for(var c = 0; c <board.attributes[0].length; c++) {
      currentBoard.togglePiece(currentRow, c);
      //if there's no conflict with our current placement...
      var noRowColConflict = !currentBoard.hasColConflictAt(c) && !currentBoard.hasRowConflictAt(currentRow);
      var noDiagConflict = !currentBoard.hasAnyMinorDiagonalConflicts() && !currentBoard.hasAnyMajorDiagonalConflicts();
      if(noRowColConflict && noDiagConflict) {
        //..if we places all our pieces, return 1 (which is one solution)
          //can't keep track of current pieces bc of recursion.. another solution:
          //if you're on the last row and you placed a piece
        if(currentRow === n-1) {
          currentBoard.togglePiece(currentRow, c);
          return 1;
        }
        //otherwise, now with our current placement, do recursion with new board on next row
        solutions += helperFunc(currentBoard, currentRow+1);
        //toggle back this piece, so you can iterate for loop down row some more (see if more potential solutions)
      }
      currentBoard.togglePiece(currentRow, c);

     }//end for loop (traversed the entire row)
     return solutions; //aka accumulator

   }; //end recursive FUNC

   solsCount += helperFunc(board, 0);

   return solsCount;







    var solutionCount = undefined; //fixme

    console.log('Number of solutions for ' + n + ' queens:', solutionCount);
    return solutionCount;
  };
