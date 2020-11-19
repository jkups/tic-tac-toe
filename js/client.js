//game setup form behaviour

//validate nickname (initials only -- default is P1 & P2)
$('input.nickname').on('blur', function(){
  const nickname = $(this).val();
  const defaultValue = $(this).attr('id');
  if(nickname === ''){
    $(this).val(defaultValue);
  } else if(nickname.length > 2){
    const truncated = nickname.substring(0, 2);
    $(this).val(truncated);
  }
});

//dropdown control flow
$('.dropdown').on('click', function(){
  const $this = $(this).next();
  $(".menu").not($this).hide();
  $this.toggle();
})

//setting dropdown values with token or avatar
$('.menu li').on('click', function(){
  const tokenAvatar = $(this).html();
  const $selected = $(this).parent().prev();//.closest() not working
  $selected.html(tokenAvatar);

  const selected = tokenAvatar.match(/"(.*?)"/);
  $selected.attr('value', selected[1])
  $(this).parent().toggle();
})

//toggle custom board-size input field
$('#boardSize').on('change', function(){
  if($(this).val() === 'custom'){
    $('#customBoardSize').show();
    $('#customBoardSize input').focus();
  } else {
    $('#customBoardSize').hide();
  }
})

const validateInput = function(){
  let enableGameStart = true;
  $('.dropdown').each(function(){
    console.log('here');
    if($(this).html() === 'Choose an Avatar' || $(this).html() === 'Choose a token'){
      enableGameStart = false;
    }
  })

  return enableGameStart;
}

//play game and capture gameboard clicks
$(document).on('click', '.gameboard .open', function(){
  const $players = $('.players .active');
  const $currPlayer = $('.players .current');
  const currPlayer = $currPlayer.attr('id');
  const token = $('.current .token div').html();
  const hole = $(this).attr('id');

  $(this).html(token);
  $(this).removeClass('open');

  const response = play.ticTacToe(currPlayer, hole);
  $players.toggleClass('current');
  updateGame(response);

})

//start game
$('#startGame').on('click', function(){
  const validInput = validateInput();
  if(!validInput){
    alert('Please choose a token and avatar.');
    return;
  }

  //get and set player data
  const rounds = $('#rounds').val();
  const $boardSize = $('#boardSize');
  let boardSize = $boardSize.val();
  if($boardSize.val() === 'custom'){
    boardSize = $('#customBoardSize input').val();
  }

  const $nickname = $('.nickname');
  let nickname = [];
  $nickname.each(function(){
    nickname.push($(this).val())
  })

  const $token = $('.token');
  let token = [];
  $token.each(function(){
    token.push($(this).attr('value'));
  })

  const $avatar = $('.dropdown.avatar');
  let avatar = [];
  $avatar.each(function(){
    avatar.push($(this).html())
  })

  //initialize game
  init.config.size = parseInt(boardSize);
  init.config.rounds = parseInt(rounds);
  init.generateWinMatrix();
  const ids = init.createPlayers(nickname);
  const whoStarts = init.config.startPlayer;

  //generate game components
  const $scoreBoard = generateScoreBoard(nickname);

  const first = 1;
  const $playerOne = generatePlayer(
    nickname[0],
    avatar[0],
    token[0],
    ids[0],
    rounds,
    first,
    whoStarts
  );

  const $gameBoard = generateBoard(boardSize);

  const second = 2;
  const $playerTwo = generatePlayer(
    nickname[1],
    avatar[1],
    token[1],
    ids[1],
    rounds,
    second,
    whoStarts
  );

  //render game
  const $wrapperUl = $('<ul>');
  $wrapperUl.addClass('wrapper board');
  $wrapperUl.attr('id', 'gameboard');

  $wrapperUl.append($playerOne, $gameBoard, $playerTwo);
  renderGame($scoreBoard, $playerOne, $gameBoard, $playerTwo);
})

const renderGame = function($scoreBoard, $playerOne, $gameBoard, $playerTwo){
  $('#playerSetup').css('display', 'none');
  $('#gameSetup').css('display', 'none');
  $('#navContainer').append($scoreBoard);

  const $wrapperDiv = $('<ul id="gameboard">');
  $wrapperDiv.addClass('wrapper board');
  $wrapperDiv.append($playerOne, $gameBoard, $playerTwo);
  $('#bodyContainer').append($wrapperDiv);
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
  // rounds = parseInt(rounds);

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

  for(let i = 0; i < size; i++){
    const $ul = $('<ul>');
    for(let j = 0; j < size; j++){
      const $li = $('<li>');
      const $hole = $('<div>')
      $hole.addClass('hole open');
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
  const totalRounds = rounds + nextRound - 1;
  console.log(rounds, nextRound, totalRounds);

  if(gameOver){
    //generate gameover message
    // const totalRounds = rounds + nextRound - 1;
    // console.log(totalRounds);
    const winner = play.findGameWinner(totalRounds);
    console.log(winner);
    if(winner.gameWinner){
      message = '<h2>GAME OVER</h2>' +
      '<p>' + winner.winner[0].name + ' won ' + winner.winner[0].score + ' of ' + totalRounds + ' rounds.</p>' +
      '<div class="action">' +
        '<button id="restart">Restart Game</button>' +
        '<button class="newgame">New Game</button>' +
      '</div>';
    } else {
      message = '<h2>GAME OVER</h2>' +
      '<p>You both played fiercely.</p><p>There is no winner!</p>' +
      '<div class="action">' +
        '<button id="restart">Restart Game</button>' +
        '<button class="newgame">New Game</button>' +
      '</div>';
    }

  } else {
    //generate win message
    if(draw){
      message = '<h2>Nicely Done!</h2>' +
      '<p>It is a draw. No one got this round.</p>' +
      '<div class="action">' +
        '<button id="nextRound">Next Round</button>' +
        '<button class="newgame">New Game</button>' +
      '</div>';
    } else {
      const prevRound = nextRound - 1;
      message = '<h2>Congratulations ' + name + '</h2>' +
      '<p>You won round ' + prevRound + '.</p>' +
      '<div class="action">' +
        '<button id="nextRound">Next Round</button>' +
        '<button class="newgame">New Game</button>' +
      '</div>';
    }
  }

  $gameMessage.append(message);
  $('.gamestate').append($gameMessage).show();
}

const renderDrawMessage = function(gameOver){
  let message;
  const $gameMessage = $('<div>');
  $gameMessage.addClass('message');

  if(gameOver){
    const totalRounds = rounds + nextRound - 1;
    const winner = play.findGameWinner(totalRounds);

    if(winner.gameWinner){
      message = '<h2>GAME OVER</h2>' +
      '<p>' + winner.winner.name + ' won ' + winner.winner.score + ' of ' + totalRounds + ' rounds.</p>' +
      '<div class="action">' +
        '<button id="restart">Restart Game</button>' +
        '<button class="newgame">New Game</button>' +
      '</div>';
    } else {
    message = '<h2>GAME OVER</h2>' +
    '<p>You both played fiercely.</p><p>There is no winner!</p>' +
    '<div class="action">' +
      '<button id="restart">Restart Game</button>' +
      '<button class="newgame">New Game</button>' +
    '</div>';
    }

  } else {
    message = '<h2>Nicely Done!</h2>' +
    '<p>It is a draw. No one got this round.</p>' +
    '<div class="action">' +
      '<button id="nextRound">Next Round</button>' +
      '<button class="newgame">New Game</button>' +
    '</div>';
  }

  $gameMessage.append(message);
  $('.gamestate').append($gameMessage).show();
}

//start a new game
$(document).on('click', '.newgame', function(){
  location.reload(true);
})

//begin next round
$(document).on('click', '#nextRound', function(){
  //move .current-round class to next rounds
  const $currRound = $('.current-round');
  const currPosition = $currRound.removeClass('current-round').attr('class');
  const newPosition = parseInt(currPosition) + 1;

  const $nextRound = $('.round .' + newPosition);
  $nextRound.addClass('current-round');

  //empty the holes array for each player
  play.emptyHoles();
  clearGameBoard();
})

//restart the game
$(document).on('click', '#restart', function(){
  //same as above with the following modifications/additions
  // move current class to first round
  const $currRound = $('.current-round');
  const currPosition = $currRound.removeClass('current-round');
  $('.1').addClass('current-round');

  //clear round score and scoreboard
  $('.round div div:nth-child(2)').html('--');
  $('.scoreboard ul li:nth-child(2)').html('0');


  //reset player.score to zero for each player
  const totalRound = $('.round > div').last().attr('class');
  play.reInitialize(totalRound);
  play.emptyHoles();
  clearGameBoard();
})

const clearGameBoard = function(){
  //clear the $gameBoard amd add .open to the holes
  $('.hole').html('').addClass('open');

  //destroy .message div and hide .gamestate div
  $('.gamestate').hide();
  $('.message').remove();
}
