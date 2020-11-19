//rendering engine collection
const renderGame = function($scoreBoard, $playerOne, $gameBoard, $playerTwo){
  $('#playerSetup').css('display', 'none');
  $('#gameSetup').css('display', 'none');
  $('#navContainer').append($scoreBoard);

  const $wrapperUl = $('<ul id="gameboard">');
  $wrapperUl.addClass('wrapper board');
  $wrapperUl.append($playerOne, $gameBoard, $playerTwo);
  $('#bodyContainer').append($wrapperUl);
}

const generateScoreBoard = function(nickname){
  const $wrapperDiv = $('<div id="scoreboard">');
  const $scoreBoard = $('<div>');
  $scoreBoard.addClass('scoreboard');
  $scoreBoard.append('<span>Score<br>Board</span>');

  for(let i = 0; i < nickname.length; i++){
    const $ul = $('<ul>');
    const $playerLi = $('<li>');
    const $scoreLi = $('<li class="P' + (i + 1) + '">');

    $playerLi.html(nickname[i].toUpperCase());
    $scoreLi.html(0);
    $ul.append($playerLi, $scoreLi);
    $scoreBoard.append($ul);
  }

  const $actionDiv = $('<div>');
  $actionDiv.addClass('action');

  const $restartButton = $('<button>');
  $restartButton.attr('id', 'restart');
  $restartButton.text('Restart Game');

  const $newgameButton = $('<button>');
  $newgameButton.addClass('newgame');
  $newgameButton.text('New Game');

  $actionDiv.append($restartButton, $newgameButton);
  $scoreBoard.append($actionDiv);
  return $wrapperDiv.append($scoreBoard);
}

const generatePlayers = function(nickname, avatar, token, id, rounds, start){
  const players = {};

  for(let i = 0; i < nickname.length; i++){
    const suffix = i === 0 ? 'One' : 'Two';

    const $playerLi = $('<li>');
    $playerLi.addClass('players');

    const $playerDiv = $('<div>');
    $playerDiv.attr('id', id[i]);
    $playerDiv.addClass('active');
    if(start === i + 1){
      $playerDiv.addClass('current');
    }

    const $headingDiv = $('<div>');
    $headingDiv.addClass('heading');
    avatarImg = '<div class="">' + avatar[i] + '</div>';
    $headingDiv.html(avatarImg + ' Player ' + (i + 1));

    const $identityDiv = $('<div>');
    $identityDiv.addClass('identity');
    $identityDiv.attr('id', 'P' + (i + 1));

    const nameDiv = '<div><span>Name</span><div>' + nickname[i].toUpperCase() + '</div></div>';
    const tokenDiv = '<div class="token"><span>Token</span><div><i class="fas ' + token[i] + '"></i></div></div>'

    const $roundsDiv = $('<div>');
    $roundsDiv.addClass('round');

    for(let j = 1; j <= rounds; j++){
      let className = '';
      if(j === 1){
        className = 'current-round ';
      }
      const round = '<div class="' + className + j + '"><div>R' + j + '</div><div>-</div>';
      $roundsDiv.append(round);
    }

    $identityDiv.append(nameDiv, tokenDiv);
    $playerDiv.append($headingDiv, $identityDiv, $roundsDiv);
    $playerLi.append($playerDiv);

    players['$player' + suffix] = $playerLi;
  }

  return players;
}

const generateBoard =  function(size){
  const $gameBoardLi = $('<li>');
  $gameBoardLi.addClass('gameboard');

  const $gameBoardState = $('<div style="display:none">');
  $gameBoardState.addClass('gamestate');

  const $gameStateBack = $('<div>');
  $gameStateBack.addClass('background');
  $gameBoardState.append($gameStateBack);
  $gameBoardLi.append($gameBoardState);

  //calculate hole size
  const containerWidth = 960;
  const playerWidth = 150.53;
  const margins = 60;
  const boardWidth = containerWidth - (playerWidth * 2) - margins - (size * 2);
  const holeWidth = boardWidth/size;

  for(let i = 0; i < size; i++){
    const $ul = $('<ul>');
    for(let j = 0; j < size; j++){
      const $li = $('<li>');
      const $hole = $('<div>')
      $hole.addClass('hole open').css({ width: holeWidth, height: holeWidth, fontSize: holeWidth/2 + 'px' });
      $hole.attr('id', i.toString() + j.toString())
      $li.append($hole);
      $ul.append($li);
    }
    $gameBoardLi.append($ul);
  }
  return $gameBoardLi;
}

const updateGame = function(response){
  if(response.winner){
    $('.gameboard .hole').removeClass('open');

    //update round won
    const id = response.player;
    const $currRound = $('#' + id + ' .current-round div:eq(1)');
    $currRound.html('1');

    //update scoreboard
    const $winningPlayer = $('#' + id + ' .identity');
    winningId = $winningPlayer.attr('id');

    const $currScore = $('.' + winningId);
    currScore = parseInt($currScore.html()) + 1;
    $currScore.html(currScore);

    //display appropriate message for winning
    renderWinMessage(
      response.gameOver,
      response.rounds,
      response.nextRound,
      response.name,
      response.score,
      response.draw
    );

  } else if(response.draw){
    //display game over message for draws
    renderWinMessage(
      response.gameOver,
      response.rounds,
      response.nextRound,
      response.name,
      response.score,
      response.draw
    );

  }
}

const renderWinMessage = function(gameOver, rounds, nextRound, name, score, draw){
  let message;
  const $gameMessage = $('<div>');
  $gameMessage.addClass('message');

  if(gameOver){
    //generate win message
    const totalRounds = rounds + nextRound - 1;
    const winner = play.findGameWinner(totalRounds);
    message = generateWinMessage(winner, totalRounds);

  } else {
    //generate draw message
    message = generateDrawMessage(draw, nextRound, name);
  }

  $gameMessage.append(message);
  $('.gamestate').append($gameMessage).show();
}

const generateWinMessage = function(winner, totalRounds){
  if(winner.gameWinner){
    return '<div id="won"><h2>GAME OVER</h2>' +
    '<p>' + winner.winner.name.toUpperCase() + ' won ' + winner.winner.score + ' of ' + totalRounds + ' rounds.</p>' +
    '<div class="action">' +
      '<button id="restart">Restart Game</button>' +
      '<button class="newgame">New Game</button>' +
    '</div></div>';

  } else {
    return '<div id="draw"><h2>GAME OVER</h2>' +
    '<p>You both played fiercely.</p><p>There is no winner!</p>' +
    '<div class="action">' +
      '<button id="restart">Restart Game</button>' +
      '<button class="newgame">New Game</button>' +
    '</div></div>';
  }
}

const generateDrawMessage = function(draw, nextRound, name){
  if(draw){
    return '<div id="draw"><h2>Nicely Done!</h2>' +
    '<p>It is a draw. No one got this round.</p>' +
    '<div class="action">' +
      '<button id="nextRound">Next Round</button>' +
      '<button class="newgame">New Game</button>' +
    '</div></div>';

  } else {
    const prevRound = nextRound - 1;
    return '<div id="won"><h2>Congratulations ' + name.toUpperCase() + '</h2>' +
    '<p>You won round ' + prevRound + '.</p>' +
    '<div class="action">' +
      '<button id="nextRound">Next Round</button>' +
      '<button class="newgame">New Game</button>' +
    '</div></div>';
  }
}
