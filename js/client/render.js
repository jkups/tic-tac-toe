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

    $playerLi.html(nickname[i]);
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
  return $wrapperDiv.append($scoreBoard, $actionDiv);
}

const generatePlayer = function(nickname, avatar, token, id, rounds, position, start){
  const $playerLi = $('<li>');
  $playerLi.addClass('players');

  const $playerDiv = $('<div>');
  $playerDiv.attr('id', id);
  $playerDiv.addClass('active');
  if(start === position){
    $playerDiv.addClass('current');
  }

  const $headingDiv = $('<div>');
  $headingDiv.addClass('heading');
  avatar = '<div class="">' + avatar + '</div>';
  $headingDiv.html(avatar + ' Player ' + position)

  const $identityDiv = $('<div>');
  $identityDiv.addClass('identity');
  $identityDiv.attr('id', 'P' + position);

  const nameDiv = '<div><span>Name</span><div>' + nickname + '</div></div>';
  const tokenDiv = '<div class="token"><span>Token</span><div><i class="fas ' + token + '"></i></div></div>'

  const $roundsDiv = $('<div>');
  $roundsDiv.addClass('round');

  for(let i = 1; i <= rounds; i++){
    let className = '';
    if(i === 1){
      className = 'current-round ';
    }
    const round = '<div class="' + className + i + '"><div>R' + i + '</div><div>--</div>';
    $roundsDiv.append(round);
  }

  $identityDiv.append(nameDiv, tokenDiv);
  $playerDiv.append($headingDiv, $identityDiv, $roundsDiv);
  return $playerLi.append($playerDiv);
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
    return '<h2>GAME OVER</h2>' +
    '<p>' + winner.winner.name + ' won ' + winner.winner.score + ' of ' + totalRounds + ' rounds.</p>' +
    '<div class="action">' +
      '<button id="restart">Restart Game</button>' +
      '<button class="newgame">New Game</button>' +
    '</div>';
  } else {
    return '<h2>GAME OVER</h2>' +
    '<p>You both played fiercely.</p><p>There is no winner!</p>' +
    '<div class="action">' +
      '<button id="restart">Restart Game</button>' +
      '<button class="newgame">New Game</button>' +
    '</div>';
  }
}

const generateDrawMessage = function(draw, nextRound, name){
  if(draw){
    return '<h2>Nicely Done!</h2>' +
    '<p>It is a draw. No one got this round.</p>' +
    '<div class="action">' +
      '<button id="nextRound">Next Round</button>' +
      '<button class="newgame">New Game</button>' +
    '</div>';

  } else {
    const prevRound = nextRound - 1;
    return '<h2>Congratulations ' + name + '</h2>' +
    '<p>You won round ' + prevRound + '.</p>' +
    '<div class="action">' +
      '<button id="nextRound">Next Round</button>' +
      '<button class="newgame">New Game</button>' +
    '</div>';
  }
}
