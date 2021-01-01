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

//start a new game
$(document).on('click', '.newgame', function(){
  init.config.type === 'remote' ?
    fireBase.destroyGame(init.config.gameId) :
    location.reload(true);
})

//begin next round
$(document).on('click', '#nextRound', function(){
  init.config.nextRound++;
  init.message = '';
  play.emptyHolesAndRoundScore('hole');

  init.config.type === 'remote' ?
    fireBase.setupAndUpdateRemoteGame() :
    beginRender();
})

//restart the game
$(document).on('click', '#restart', function(){
  play.reInitialize();
  play.emptyHolesAndRoundScore('hole');
  play.emptyHolesAndRoundScore('roundScore');

  init.config.type === 'remote' ?
    fireBase.setupAndUpdateRemoteGame() :
    beginRender();
})

//temporary draw token on open holes
$(document).on('mouseenter mouseleave', '.open', function(event){
  const token = $('.current .token div').html();
  const hole = $(this).attr('id');
  if( event.type === 'mouseenter' ){
    $(this).html(token);
  } else {
    $(this).html('');
  }
})
