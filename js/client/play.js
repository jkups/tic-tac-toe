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

//clear the board
const clearGameBoard = function(){
  //clear the $gameBoard amd add .open to the holes
  $('.hole').html('').addClass('open');

  //destroy .message div and hide .gamestate div
  $('.gamestate').hide();
  $('.message').remove();
}
