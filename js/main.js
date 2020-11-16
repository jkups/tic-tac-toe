
const play = {
  config:{
    size: 3,
    type: 'local',
    winMatrix: {
      row: [],
      column: [],
      leftDiag: [],
      rightDiag: []
    }
  },
  generateWinMatrix: function(){
    const size = 3;

    for(let i = 0; i < size; i++){
      this.diagonalMatrix(i, size - (i + 1));

      for(let j = 0; j < size; j++){
        this.rowMatrix(i,j);
        this.columnMatrix(i,j);
      }
    }
  },
  rowMatrix: function(start, end){
    const matrix = start.toString() + end.toString();
    this.config.winMatrix.row.push(matrix);
  },
  columnMatrix: function(end, start){
    const matrix = start.toString() + end.toString();
    this.config.winMatrix.column.push(matrix);
  },
  diagonalMatrix: function(start, end){
    const leftMatrix = start.toString() + start.toString();
    const rightMatrix = start.toString() + end.toString();
    this.config.winMatrix.leftDiag.push(leftMatrix);
    this.config.winMatrix.rightDiag.push(rightMatrix);
  },
  players:[
    {
      id: '342342342',
      name:'John',
      hole: [],//store position, erased at the end of round
      score: [],//index is round, value is score
    },
    {
      id: '2q3r252134',
      name:'Jane',
      hole: [],
      score: []
    }
  ],

  generateBoard: function(){

  },

  createPlayer: function(){

  },

  ticTacToe: function(player, hole, round){
    player = this.getPlayer(player);
    player.hole.push(hole);

    if(player.score[round - 1] === undefined){
      player.score[round - 1] = 0;
    }

    // if(this.config.size)
    player.score[round - 1] += 10;//default score to be changed

    return this.getWinner(player);
  },

  getWinner: function(player){
    const size = this.config.size;
    const hole = player.hole;
    const winMatrix = this.config.winMatrix;
    let count = 0;

    for(key in winMatrix){
      let group = 0;
      //compare winMatrix[key] values with hole values
      for(let i = 0; i < winMatrix[key].length; i++){
        if(hole.includes(winMatrix[key][i])){
          count++;
        }

        if(count === size){
          return { winner: true, player: player.id, side: key, group: group };
        }

        if((i + 1) % size === 0){
          group++;
          count = 0;
        };
      }
    }
    return { winner: false };
    // const isDraw = this.isDraw();
  },

  isDraw: function(){

  },

  getPlayer: function(player){
    return this.players.find(function(el){
      return el.id;
    });
  },


}
