# BYOI

Build Your Own Internet was a project I worked on while studying abroad in London.

It's a web app built, primarily with children in mind, to illustrate how communication over the internet works.

The back end (HumanNetworkServer.jar) was built by Dave Cohen - a lecturer at Royal Holloway University of London. I built the front end. 
![alt text](https://github.com/barrymaswan/BYOI/blob/master/byoi-app-screenshot.png "")


### How To Run:
You need java installed on your machine.

To run the server, run the following command from the console:
java -jar HumanNetworkServer.jar

The server will only allow messages to be exchanged by clients AFTER PRESSING the button Start Next Task for the first time.
However, only press that button after all the clients are connected.

If you are running the server with a ip/port that are different from the default, you will need to change
that in the client file index.html by changing the values of the following variables:
var serverAddress = ’127.0.0.1’;
var serverPort = ’10000’;

If you disconnect the client from the server, you won’t be
able to reconnect before the Start Next Task button has
been pressed on the server.
