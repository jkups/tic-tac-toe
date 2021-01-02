# TicTacToe

This is an attempt to build the popular tic-tac-toe game loved by many. This implementation is very simplistic and was built with the following tech.

* HTML
* CSS
* JavaScript
* jQuery
* Firebase

> Note: App was built for Desktop ONLY

## App Features

The app comes with the following features:

1. A setup page where players can choose an avatar and token to use in the game. The players can also choose the size of game board from a defined list or enter a custom value.

![Image of Player Setup](https://drive.google.com/uc?export=view&id=1K7msBuNtdaCJIhss9y6sfLlmKgwW3KkI)


2. The app dynamically generates the game board and sets it up based on players preferences including number of rounds.

![Image of Game Board](https://drive.google.com/uc?export=view&id=1Q7Pmp6ZpkrJc0gNgK3PJVyWcqzhcsMnO)

3. The game board is interactive and gives visual cues indicating who's turn it is to play while keeping a record of game score.

4. The players can choose to refresh the game at any time or start a new game with new preferences.


## Playing over the internet
While the app is quite simplistic, you are still able to play the game with a remote opponent over the internet. Thanks to [firebase realtime database](https://firebase.google.com/products/realtime-database), the app can keep track of play states and update each instance of a game.

To participate in an online game, you will either need to start a new game and invite an opponent of your choosen, or you can join an existing game using a game room id provided by your opponent.

This is a two player, turn based game. And as such game rooms are restricted to two participants at a time. But you can start multiple games and play with multiple opponents in self-contained 2 participant rooms if you like.

## Bugs and Known Issues
Still looking for the bug... not found any. Let me know when you do 'cos am sure there must be some.

Also the app has not been optimized for performance nor paid any attention to network distruptions that could hamper smooth playing over the internet. Suffice to say a good internet speed will make all the difference.

## Features in the works

- Support for an AI player
