
Player = function(name){
  this.id = Math.floor(Math.random() * 100);
  this.name = name;
  this.hole = []; //store position, erased at the end of a round
  this.score = 0;
};

//initialize game
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
  }, //initial config

  generateWinMatrix: function(){
    const size = this.config.size;

    for(let i = 0; i < size; i++){
      this.diagonalMatrix(i, size - (i + 1));

      for(let j = 0; j < size; j++){
        this.rowMatrix(i,j);
        this.columnMatrix(i,j);
      }
    }
  }, //generateWinMatrix()

  rowMatrix: function(start, end){
    const matrix = start.toString() + end.toString();
    this.config.winMatrix.row.push(matrix);
  },//rowMatrix()

  columnMatrix: function(end, start){
    const matrix = start.toString() + end.toString();
    this.config.winMatrix.column.push(matrix);
  }, //columnMatrix()

  diagonalMatrix: function(start, end){
    const leftMatrix = start.toString() + start.toString();
    const rightMatrix = start.toString() + end.toString();
    this.config.winMatrix.leftDiag.push(leftMatrix);
    this.config.winMatrix.rightDiag.push(rightMatrix);
  }, //diagonalMatrix()

  createPlayers: function(names){
    const ids = [];
    for(const name of names){
      const newPlayer = new Player(name);
      play.players.push(newPlayer);
      ids.push(newPlayer.id);
    }
    return ids;
  }, //createPlayers()
}

const play = {
  players:[], //holds player data

  ticTacToe: function(player, hole){
    // console.log(player);
    player = this.getPlayer(parseInt(player));
    player.hole.push(hole);

    if(player.hole.length >= init.config.size){
      return this.getWinner(player);
    }
    return { winner: false };
  }, //ticTacToe()

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
  }, //getWinner()

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
  }, //isDraw()

  emptyHoles: function(){
    const players = this.players;
    for(player of players){
      player.hole = [];
    }
  }, //emptyHoles()

  reInitialize: function(rounds){
    init.config.rounds = parseInt(rounds);
    init.config.nextRound = 1;
    const players = this.players;
    for(player of players){
      player.score = 0;
    }
  }, //reInitialize()

  getPlayer: function(player){
    return this.players.find(function(el){
      return el.id === player;
    });
  }, //getPlayer()

  findGameWinner: function(rounds){
    const players = this.players;

    for(let i = 0; i < players.length - 1; i++){
        if(players[i].score > players[i + 1].score){
          return { gameWinner: true, winner: players[i] };

        } else if(players[i].score < players[i + 1].score){
          return { gameWinner: true, winner: players[i + 1] };

        } else {
          return { gameWinner: false };
        }
    }
  }, //findGameWinner()

  isHolesAllFilled: function(players){
    let totalHoles = 0;
    for(const player of players){
      totalHoles += player.hole.length;
    }

    if(totalHoles === init.config.size**2){
      return true;
    }

    return false;
  } //isHolesAllFilled()
}
