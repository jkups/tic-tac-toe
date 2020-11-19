
Player = function(name){
  this.id = Math.floor(Math.random() * 100);
  this.name = name;
  this.hole = []; //store position, erased at the end of round
  this.score = 0;
};

const init = {
  config:{
    startPlayer: Math.floor(Math.random() * 2) + 1,
    size: 0,
    rounds: 0,
    nextRound: 1,
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

    // if(player.score[round - 1] === undefined){
    //   console.log('round: here');
    //   player.score[round - 1] = 0;
    // }
    //
    // // if(this.config.size)
    // player.score[round - 1] += 10;//default score to be changed
    if(player.hole.length >= init.config.size){
      return this.getWinner(player);
    }
    return { winner: false };
  },

  getWinner: function(player){
    const size = init.config.size;
    const hole = player.hole;
    const winMatrix = init.config.winMatrix;
    let gameOver = true;
    let count = 0;

    for(key in winMatrix){
      let group = 0;
      //compare winMatrix[key] values with hole values
      for(let i = 0; i < winMatrix[key].length; i++){
        if(hole.includes(winMatrix[key][i])){
          count++;
        }

        if(count === size){
          player.score++;
          init.config.rounds--;
          if(init.config.rounds > 0){
            gameOver = false;
          }
          init.config.nextRound++;
          return {
            gameOver: gameOver,
            winner: true,
            name: player.name,
            player: player.id,
            side: key,
            group: group,
            score: player.score,
            rounds: init.config.rounds,
            nextRound: init.config.nextRound
          };
        }

        if((i + 1) % size === 0){
          group++;
          count = 0;
        };
      }
    }

    return this.isDraw();
  },

  isDraw: function(){
    const holesAllFilled = this.isHolesAllFilled(this.players);
    let gameOver = true;

    if(holesAllFilled){
      init.config.rounds--;
      if(init.config.rounds > 0){
        gameOver = false;
      }
      init.config.nextRound++;
      return {
        gameOver: gameOver,
        winner: false,
        draw: true,
        rounds: init.config.rounds,
        nextRound: init.config.nextRound
      };
    }

    return { winner: false };
  },

  emptyHoles: function(){
    const players = this.players;
    for(player of players){
      player.hole = [];
    }
  },

  reInitialize: function(rounds){
    init.config.rounds = parseInt(rounds);
    init.config.nextRound = 1;
    const players = this.players;
    for(player of players){
      player.score = 0;
    }
  },
  getPlayer: function(player){
    return this.players.find(function(el){
      return el.id === player;
    });
  },

  findGameWinner: function(rounds){
    const winner = this.players.filter(function(el){
      if((rounds % el.score !== 0 || rounds === el.score || el.score === 1)
      && el.score !== 0){
        return true;
      } else {
        return false;
      }
    });

    if(winner.length > 0){
      return { gameWinner: true, winner: winner };
    }
    return { gameWinner: false };
  },
  isHolesAllFilled: function(players){
    let totalHoles = 0;
    for(const player of players){
      totalHoles += player.hole.length;
    }

    if(totalHoles === init.config.size**2){
      return true;
    }

    return false;
  }


}
