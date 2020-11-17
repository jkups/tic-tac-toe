
Player = function(name){
  this.id = Math.floor(Math.random() * 100);
  this.name = name;
  this.hole = []; //store position, erased at the end of round
  this.score = []; //index is round, value is score
};

const init = {
  config:{
    startPlayer: Math.floor(Math.random() * 2) + 1,
    size: 0,
    rounds: 0,
    type: 'local',
    winMatrix: {
      row: [],
      column: [],
      leftDiag: [],
      rightDiag: []
    }
  },
  generateWinMatrix: function(){
    const size = this.config.size;

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
  createPlayers: function(names){
    const ids = [];
    for(const name of names){
      const newPlayer = new Player(name);
      play.players.push(newPlayer);
      ids.push(newPlayer.id);
    }
    return ids;
  },
}
const play = {

  players:[],

  ticTacToe: function(player, hole, round){
    // console.log(player);
    player = this.getPlayer(parseInt(player));
    player.hole.push(hole);

    if(player.score[round - 1] === undefined){
      player.score[round - 1] = 0;
    }

    // if(this.config.size)
    player.score[round - 1] += 10;//default score to be changed

    return this.getWinner(player);
  },

  getWinner: function(player){
    const size = init.config.size;
    const hole = player.hole;
    const winMatrix = init.config.winMatrix;
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
      return el.id === player;
    });
  },


}
