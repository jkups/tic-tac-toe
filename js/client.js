//capture gaboard clicks
$('.gameboard .hole').on('click', function(){
  const $player = $('.players .current');
  const player = $player.attr('id');
  const token = $('.current .token div').html();
  const hole = $(this).attr('id');
  const round = 1;
  $(this).html(token);
  $(this).removeClass('open');

  const response = play.ticTacToe(player, hole, round);
  console.log(response);
  // updateResult(response);

  console.log('here');
})

const updateResult = function(response){

}


play.generateWinMatrix();
