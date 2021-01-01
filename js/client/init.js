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
$('#startLocalGame, #startRemoteGame').on('click', async function(){
  //validate user input
  const gameType = init.config.type
  const validInput = validateInput(gameType);
  if(!validInput){
    alert('Please choose a token and avatar.');
    return;
  }

  //get player data
  const rounds = $('#rounds').val();
  const $boardSize = $('#boardSize');
  const boardSize = $boardSize.val() === 'custom' ?
    $('#customBoardSize input').val() : $boardSize.val();

  if(gameType === 'remote' && $('#joinRoom input:checked').length > 0){
    //remember which player you are (player 2)
    init.whoAmI = 2;

    const gameId = $('#gameId').val();

    await initiateRender(gameType, boardSize, rounds, gameId, true) ?
      fireBase.onRemoteGameChange(gameId) :
      alert('No game exists with that room id.');

  } else if(gameType === 'remote'){
    //remember which player you are (player 1)
    init.whoAmI = 1;

    initiateRender(gameType, boardSize, rounds);
    fireBase.setupAndUpdateRemoteGame();
    fireBase.onRemoteGameChange(init.config.gameId);

  } else {
    initiateRender(gameType, boardSize, rounds);
    beginRender();
  }
})

const initiateRender = async function(gameType, boardSize, rounds, gameId = false, joinGame = false){
  const { nickname, token, avatar } = getPlayerData(gameType);
  init.createPlayers(nickname, avatar, token);

  if(joinGame){
    //join remote game
    if(await fireBase.getRemoteConfig(gameId)){
      fireBase.addRemotePlayer(gameId, nickname[0], token[0], avatar[0]);
      return true;
    }
    return false;

  } else {
    //initialize new game
    init.config.size = parseInt(boardSize);
    init.config.remainingRounds = parseInt(rounds);
    init.config.totalRounds = parseInt(rounds);
    init.generateWinMatrix();
  }
}

const beginRender = function(){
  //generate game components
  const size = init.config.size;
  const currentPlayer = init.config.currentPlayer;
  const rounds = init.config.totalRounds;
  const nextRound = init.config.nextRound;
  const nickname = init.players.map( el => el.name );
  const avatar = init.players.map( el => el.avatar );
  const token = init.players.map( el => el.token );
  const id = init.players.map( el => el.id );
  const roundScore = init.players.map( el => el.roundScore );
  const gameScore = init.players.map( el => el.gameScore );
  const holes = init.players.map( el => el.hole );
  const whoami = init.whoAmI;

  const $gameBoard = generateBoard(size, token, holes, whoami);
  const $scoreBoard = generateScoreBoard(nickname, gameScore);

  let { $playerOne, $playerTwo } = generatePlayers(
    nickname, avatar, token, id, roundScore, rounds, nextRound, currentPlayer
  )

  if(!$playerTwo){
    $playerTwo = `<div id="playerPlaceholder" style="width:150.53px">Waiting for the second player to join the game.<br><br>You will need to send them the game room id below before they can join the game.<br><br> <span id="roomId">${init.config.gameId}<span> </div>`
  };

  //render game
  renderGame($scoreBoard, $playerOne, $gameBoard, $playerTwo);
}
