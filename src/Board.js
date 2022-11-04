// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        //debugger;
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      if(this.rows().length === 0) {
        return false;
      }
      //debugger;
      var matrix = this.attributes;

        var piecesInRow = 0;

        for(var c = 0; c < matrix[rowIndex].length; c++) {
          if(matrix[rowIndex][c] !== 0) {
            piecesInRow++;
          }
        }//allColsChecked
        if(piecesInRow > 1) {
          return true;
        }
      return false; //fixed?
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      if(this.rows().length === 0) {
        return false;
      }
     // debugger;
      //matrix is object
      var matrix = this.attributes;
      for(var row in this.attributes) {
        if (!Array.isArray(this.attributes[row])) { //gets to end 'n'
          return false;
        }
        var isConflict = this.hasRowConflictAt(row);
        if(isConflict) {
          return true;
        }
      }
        return false;//fixed?
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      if(this.rows().length === 0) {
        return false;
      }
      var numRows = Object.keys(this.attributes).length - 1;
      var colCount = 0;
      for(var r = 0; r < numRows; r++) {
        if(this.attributes[r][colIndex] !== 0) {
          colCount++;
        }
      }
      return colCount > 1 ? true : false;
      //fixed?
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      if(this.rows().length === 0) {
        return false;
      }
      var numCols = this.attributes[0].length;

      for(var c = 0; c < numCols; c++) {
        var check = this.hasColConflictAt(c);
        if(check === true) {
          return true;
        }
      }
      return false; // fixed?
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(thisRow, majorDiagonalColumnIndexAtRow) {
      if(this.rows().length === 0) {
        return false;
      }
      var row = thisRow;
      var col = majorDiagonalColumnIndexAtRow;
      var length = this.attributes[0].length;
      var count = 0;
      while (row  < length && col < length) {
        if(this.attributes[row][col] !== 0) {
          count++;
          if(count > 1) {
            return true;
          }
        }
        row++;
        col++;
      }//while...

      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      if(this.rows().length === 0) {
        return false;
      }
      var length = this.attributes[0].length;
      //for loop through first row, all columns (0, cols)

      for(var cols = 0 ; cols < length; cols++) {
        var check = this.hasMajorDiagonalConflictAt(0, cols);
        if(check === true) {
          return true;
        }
      }//forFirstRow.. DONE

      //for loop through all rows, (rows, 0)
      for(var row = 0; row < length; row++) {
        var isConflict = this.hasMajorDiagonalConflictAt(row, 0);
        if(isConflict) {
          return true;
        }
      }

      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(startRow, minorDiagonalColumnIndexAtRow) {
      if(this.rows().length === 0) {
        return false;
      }

      var row = startRow;
      var col = minorDiagonalColumnIndexAtRow;
      var length = this.attributes[0].length;
      var count = 0;

      while(row < length && col >= 0) {

        if(this.attributes[row][col] !== 0) {
          count++;
          if(count > 1) {
            return true;
          }
        }//if NOT 0..
        row++;
        col--;
      }//while...

      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      if(this.rows().length === 0) {
        return false;
      }
      var length = this.attributes[0].length;

      //for loop all row 0 cols (0, cols)
      for(var cols = length-1; cols >= 0; cols--) {
        var isConflict = this.hasMinorDiagonalConflictAt(0, cols);
        if (isConflict) {
          return true;
        }
      }
      //for loop all rows at col end (rows, .length)
      for(var row = 1; row < length; row++) {
        var isConflict = this.hasMinorDiagonalConflictAt(row, length-1);
        if(isConflict) {
          return true;
        }
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
