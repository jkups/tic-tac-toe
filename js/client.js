//capture gaboard clicks
$(document).on('click', '.gameboard .open', function(){
  const $players = $('.players .active');
  const $currPlayer = $('.players .current');
  const currPlayer = $currPlayer.attr('id');
  // console.log($player);
  const token = $('.current .token div').html();
  const hole = $(this).attr('id');
  const currRound = 1; //$player.children('.round .current');
  $(this).html(token);
  $(this).removeClass('open');
console.log(currPlayer, hole, currRound);
  const response = play.ticTacToe(currPlayer, hole, currRound);
  $players.toggleClass('current');
  console.log(response);
  // updateResult(response);

  console.log('here');
})

$('#startGame').on('click', function(){
  const rounds = $('#rounds').val();
  const $boardSize = $('#boardSize');
  let boardSize = $boardSize.val();
  if($boardSize.val() === 'custom'){
    boardSize = $('#customSize').val();
  }

  const $nickname = $('.nickname');
  let nickname = [];
  $nickname.each(function(){
    nickname.push($(this).val())
  })

  const $token = $('.token');
  let token = [];
  $token.each(function(){
    token.push($(this).val())
  })

  const $jersey = $('.jersey');
  let jersey = [];
  $jersey.each(function(){
    jersey.push($(this).val())
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
  const $playerOne = generatePlayer(nickname[0], jersey[0], token[0], ids[0], rounds, first, whoStarts);

  const $gameBoard = generateBoard(boardSize);

  const second =2;
  const $playerTwo = generatePlayer(nickname[1], jersey[1], token[1], ids[1], rounds, second, whoStarts);

  const $scoreBoard = generateScoreBoard(nickname);
  $wrapperUl.append($playerOne, $gameBoard, $playerTwo);

  renderGame($scoreBoard, $playerOne, $gameBoard, $playerTwo);
})

const renderGame = function($scoreBoard, $playerOne, $gameBoard, $playerTwo){
  $('#playerSetup').css('display', 'none');
  $('#gameSetup').css('display', 'none');
  $('#navContainer').append($scoreBoard);

  const $wrapperDiv = $('<ul>');
  $wrapperDiv.addClass('wrapper board');
  $wrapperDiv.append($playerOne, $gameBoard, $playerTwo);
  $('#bodyContainer').append($wrapperDiv);
}

const generateScoreBoard = function(nickname){
  const $wrapperDiv = $('<div>');
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

const generatePlayer = function(nickname, jersey, token, id, rounds, position, start){
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
  $headingDiv.html('Player ' + position)

  const $identityDiv = $('<div>');
  $identityDiv.addClass('identity');

  const nameDiv = '<div><span>Name</span><div>' + nickname + '</div></div>';
  const tokenDiv = '<div class="token"><span>Token</span><div><i class="fas ' + token + '"></i></div></div>'

  const $roundsDiv = $('<div>');
  $roundsDiv.addClass('round');
  // rounds = parseInt(rounds);

  for(let i = 0; i <= rounds; i++){
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

const updateResult = function(response){

}
