/*
We connect and send a HELLO message with a node number and a session key (from cookies).
We get back a CONNECTED message with a node number, a name and a session key
If the session key has changed then we accept the new values
Now we just wait for PACKET or TASK messages
Messages can only be sent after a TASK has been set.
*/
function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + encodeURIComponent(cvalue) + "; " + expires;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return 0;
}
$(document).ready(function() {
    $('#loggedInButtons').hide();
    $('#main').hide();
    if (! ("WebSocket" in window)) {
        $('#sidebar').hide();
        $('body').append("<strong>Browser does not support Web Socket.</br>Please reload page in a modern Browser.</strong>");
    }

    $('#connectButton').click(function() {
        $('#connectionButtons').hide();
        BYOI.connection = new WebSocket("ws://127.0.0.1:10000/");

        BYOI.connection.onopen = function (e) {
            var message = {
                session: +getCookie("session"),
                node: +getCookie("node"),
                type: "HELLO"
            };
            BYOI.connection.send(JSON.stringify(message));
        };
        
        BYOI.connection.onmessage = function (e) {
            var received = JSON.parse(e.data);
            var type = received.type; // Could be instructions, broadcast, connected or message
            if (type == 'CONNECTED') {
                BYOI.mySession = received.session;

                if (getCookie("session") == BYOI.mySession) {
                    BYOI.myName = getCookie("name");
                    BYOI.myNode = getCookie("node");
                    BYOI.mySession = getCookie("session");
                    $('#systemMessage').html("existing game restored");
                } else {
                    BYOI.myName = received.name;
                    BYOI.myNode = received.node;
                    BYOI.mySession = received.session;
                    setCookie("session", BYOI.mySession);
                    setCookie("node", BYOI.myNode);
                    setCookie("name", BYOI.myName);
                    $('#systemMessage').html("new game join");
                }
                $('#messageList').append("<div class=\"received\"><span class=\"connected\">Node Number:  "+BYOI.myNode+"</span> | Node name: <span class=\"text\">"+BYOI.myName+"</span></div>");
                $('#loggedInButtons').show();
                $('#main').show();
            }

            if (type == 'PACKET') {
                text = received.text;
                from = received.from;
                $('#messageList').append("<div class=\"received\"><span class=\"node\"> "+from+"</span> : <span class=\"text\">"+text+"</span></div>");
            }
            if (type == 'TASK') {
                task = received.task;
                $('#messageList').append("<div class=\"task\">Task: <span class=\"node\"> " +task+ "</span></div>");
            }
        };
        BYOI.connection.onerror = function (e) {
            $('#main').show();
            $('#systemMessage').html("Connection Error - Is the server running?");
        };
        BYOI.connection.onclose = function (event) {
                    var reason;
            // See http://tools.ietf.org/html/rfc6455#section-7.4.1
            if (event.code == 1000)
                reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
            else if(event.code == 1001)
                reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
            else if(event.code == 1002)
                reason = "An endpoint is terminating the connection due to a protocol error";
            else if(event.code == 1003)
                reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
            else if(event.code == 1004)
                reason = "Reserved. The specific meaning might be defined in the future.";
            else if(event.code == 1005)
                reason = "No status code was actually present.";
            else if(event.code == 1006)
               reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
            else if(event.code == 1007)
                reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
            else if(event.code == 1008)
                reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
            else if(event.code == 1009)
               reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
            else if(event.code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
                reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
            else if(event.code == 1011)
                reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
            else if(event.code == 1015)
                reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
            else
                reason = "Unknown reason";

            $('#systemMessage').html('The connection was closed for reason ' + event.code + ': ' + reason );
        };
    });

    $('#closeButton').click(function() {
        BYOI.connection.close();
    });
});

