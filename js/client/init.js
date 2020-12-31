//game intialization

//gametype selection
$('#gameType input').on('click', function(){
  $('#gameType div').removeClass('selected');
  $(this).parent().addClass('selected');
})

//display player setup
$('#continue').on('click', function(){
    const $gameType = $('input:checked');
    const gameType = $gameType.attr('id');
    init.config.type = gameType;

    $('#gameType').hide();
    $('#' + gameType + 'Players').show();
})

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

//validate game input parameters
const validateInput = function(gameType){
  let enableGameStart = true;
  $('#' + gameType + 'Players .dropdown').each(function(){
    if($(this).html() === 'Choose an Avatar' || $(this).html() === 'Choose a token'){
      enableGameStart = false;
    }
  })

  return enableGameStart;
}


//---------------local gametype----------------//
//validate nickname (initials only -- default is P1 & P2)
$('input.nickname').on('blur', function(){
  const nickname = $(this).val();
  const defaultValue = $(this).attr('value');
  if(nickname === ''){
    $(this).val(defaultValue);

  } else if(nickname.length > 2){
    const truncated = nickname.substring(0, 2).toUpperCase();
    $(this).val(truncated);
  }
});


//---------------remote gametype----------------//
//toogle game room
$('#joinRoom input').on('click', function(){
  $('.form.gameroom').toggle();
  $('#gameSetup span, #gameSetup ul').toggle();

  if($(this).prop('checked') === true){
    $('#remotePlayers .nickname').val('P2');
    $('#remotePlayers #startRemoteGame').html('Join a Game');

  } else {
    $('#remotePlayers #startRemoteGame').html('Start New Game');
    $('#remotePlayers .nickname').val('P1');
  }
})


//get player data
const getPlayerData = function(gameType){
  const $nickname = $('#' + gameType + 'Players .nickname');
  let nickname = [];
  $nickname.each(function(){
    nickname.push($(this).val())
  })

  const $token = $('#' + gameType + 'Players .token');
  let token = [];
  $token.each(function(){
    token.push($(this).attr('value'));
  })

  const $avatar = $('#' + gameType + 'Players .dropdown.avatar');
  let avatar = [];
  $avatar.each(function(){
    avatar.push($(this).html())
  })

  return { nickname: nickname, token: token, avatar: avatar };
}

//initialize the game
$('#startLocalGame, #startRemoteGame').on('click', function(){
  //validate user input
  const gameType = init.config.type
  const validInput = validateInput(gameType);
  if(!validInput){
    alert('Please choose a token and avatar.');
    return;
  }

  if(gameType === 'remote' && $('#joinRoom input:checked').length > 0){
    //remember which player you are (player 2)
    init.whoAmI = 2;

    const gameId = $('#gameId').val();
    initiateRender(gameType, true);
    fireBase.onRemoteGameChange(gameId);
    // beginRender();

  } else if(gameType === 'remote'){
    //remember which player you are (player 1)
    init.whoAmI = 1;

    initiateRender(gameType);
    fireBase.setupAndUpdateRemoteGame();
    fireBase.onRemoteGameChange(init.config.gameId);
    // beginRender();

  } else {
    initiateRender(gameType);
    beginRender();
  }
})

const initiateRender = async function(gameType, joinGame = false){
  const { nickname, token, avatar } = getPlayerData(gameType);
  init.createPlayers(nickname, avatar, token);

  //get player data
  const rounds = $('#rounds').val();
  const $boardSize = $('#boardSize');
  const boardSize = $boardSize.val() === 'custom' ?
    $('#customBoardSize input').val(): $boardSize.val();

  if(joinGame){
    //join remote game
    const gameId = $('#gameId').val();
    await fireBase.getRemoteConfig(gameId);
    await fireBase.addRemotePlayer(gameId, nickname[0], token[0], avatar[0]);

  } else {
    //initialize new game
    init.config.size = parseInt(boardSize);
    init.config.rounds = parseInt(rounds);
    init.generateWinMatrix();
  }
}

const beginRender = function(){
  //generate game components
  const size = init.config.size;
  const currentPlayer = init.config.currentPlayer;
  const rounds = init.config.rounds;
  const nextRound = init.config.nextRound;
  const nickname = init.players.map( el => el.name );
  const avatar = init.players.map( el => el.avatar );
  const token = init.players.map( el => el.token );
  const id = init.players.map( el => el.id );
  const holes = init.players.map( el => el.hole );
  const whoami = init.whoAmI;

  const $gameBoard = generateBoard(size, token, holes, whoami);
  const $scoreBoard = generateScoreBoard(nickname);

  let { $playerOne, $playerTwo } = generatePlayers(
    nickname, avatar, token, id, rounds, nextRound, currentPlayer
  )

  if(!$playerTwo){
    $playerTwo = `<div id="playerPlaceholder" style="width:150.53px">Waiting for player two to join the game.<br><br>Your game id is ${init.config.gameId} </div>`
  };

  //render game
  renderGame($scoreBoard, $playerOne, $gameBoard, $playerTwo);
}
