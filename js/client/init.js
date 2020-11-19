//game intialization

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

//validate game input parameters
const validateInput = function(){
  let enableGameStart = true;
  $('.dropdown').each(function(){
    if($(this).html() === 'Choose an Avatar' || $(this).html() === 'Choose a token'){
      enableGameStart = false;
    }
  })

  return enableGameStart;
}

//initialize the game
$('#startGame').on('click', function(){
  //validate user input
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
  renderGame($scoreBoard, $playerOne, $gameBoard, $playerTwo);
})
