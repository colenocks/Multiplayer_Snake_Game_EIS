# Snake-JavaScript

The Snake game, created using JavaScript, and The HTML5 canvas.

Download the starter template, and follow the tutorial on youtube step by step.

Tutorial link : https://youtu.be/9TcU2C1AACw

Forked from https://github.com/CodeExplainedRepo/Snake-JavaScript

Multiplayer_Game_EIS

Log: 12/03/2019
Still working on the game UI and the algorithm to transform the snake game into a multiplayer.

also working on understanding the technologies to help achieve the multiplayer feature.

the project at this time is still in the inception stage...

cole, out!

Log: 14/03/2019
Created the second snake, a different object on the same machine, with a different position and different color.
with different key codes for control

Log: 18/03/2019
just waited till i had substantial content before updated the read me file.

removed the second snake object i created before, as i wait to work out the logic to have it automatically created when a second user is connected.

have established a way to send data back and forth from the server to client(s) at any point of need.

have added some UI elements to make it more interactive:
included logic in button that displays the snake canvas when clicked.
i have also included a user login form that serves as an entrance for the game area.

Log: 29/03/2019
have established a complete connection with different users, with each user getting updates from the other users that entered the game.
thanks to user TrojanHorse {asked Dec 9 '15 at 19:25} from stackoverflow.

after a long and frustrating time figuring it out.
next task is to work on movement and food
cole Out!

Log: 29/03/2019
i have a added functionality for the movement of different instances on the canvas.
Currently working on distributing food and constraining snakes within the canvas.

Log: 04/04/2019
food object is broadcasted to all players at the same spot as opposed to different spots for different users before.

both snake eat the same food and adds to its length.
