//player form behaviour
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

$('.dropdown').on('click', function(){
  const $this = $(this).next();
  $(".menu").not($this).hide();
  $this.toggle();

})

$('.menu li').on('click', function(){
  const token = $(this).html();
  const $selected = $(this).parent().prev();//.closest() not working
  $selected.html(token);

  const tokenKey = token.match(/"(.*?)"/);
  $selected.attr('value', tokenKey[1])
  $(this).parent().toggle();
})

$('#boardSize').on('change', function(){
  if($(this).val() === 'custom'){
    $('#customBoardSize').show();
    $('#customBoardSize input').focus();
  } else {
    $('#customBoardSize').hide();
  }
})


//play game and capture gameboard clicks
$(document).on('click', '.gameboard .open', function(){
  const $players = $('.players .active');
  const $currPlayer = $('.players .current');
  const currPlayer = $currPlayer.attr('id');

  const token = $('.current .token div').html();
  const hole = $(this).attr('id');
  const currRound = 1; //$player.children('.round .current');
  $(this).html(token);
  $(this).removeClass('open');

  const response = play.ticTacToe(currPlayer, hole, currRound);
  $players.toggleClass('current');
  console.log(response);
  updateGame(response);

})

//initialize game
$('#startGame').on('click', function(){
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

  init.config.size = parseInt(boardSize);
  init.config.rounds = parseInt(rounds);
  init.generateWinMatrix();
  const ids = init.createPlayers(nickname);
  const whoStarts = init.config.startPlayer;

  const $wrapperUl = $('<ul>');
  $wrapperUl.addClass('wrapper board');
  $wrapperUl.attr('id', 'gameboard');

  const first = 1;
  const $playerOne = generatePlayer(nickname[0], avatar[0], token[0], ids[0], rounds, first, whoStarts);

  const $gameBoard = generateBoard(boardSize);

  const second = 2;
  const $playerTwo = generatePlayer(nickname[1], avatar[1], token[1], ids[1], rounds, second, whoStarts);

  const $scoreBoard = generateScoreBoard(nickname);
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
    const $scoreLi = $('<li>');

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
  $newgameButton.attr('id', 'newgame');
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

  const nameDiv = '<div><span>Name</span><div>' + nickname + '</div></div>';
  const tokenDiv = '<div class="token"><span>Token</span><div><i class="fas ' + token + '"></i></div></div>'

  const $roundsDiv = $('<div>');
  $roundsDiv.addClass('round');
  // rounds = parseInt(rounds);

  for(let i = 1; i <= rounds; i++){
    const round = '<div><div>R' + i + '</div><div>--</div>';
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
  if(response.winner || response.gameOver){
    $('.gameboard .hole').removeClass('open');

    if(response.winner){
      //display game over message for winning
      renderWinMessage(response);
    } else {
      //display game over message for draws
      renderDrawMessage(response);
    }
  }
}

const renderWinMessage = function(response){

}

const renderDrawMessage = function(response){

}

//start a new game
$(document).on('click', '#newgame', function(){
  location.reload(true);
})
