$(document).ready(function() {
   BYOI.connect();
   $(".shell-top-bar").val(BYOI.myName);

    function populateBar() {
        alert("populate bar is called");
    }

    $("#msg").on('keydown', function(e){
        if (e.which == 13) {
            $('#messageList').getSelectedMessages().toggleSelectMessage();
            var msg = $('<div class="added"><span class="text">' + $('#msg').val() + '</span>&nbsp;</div>').BYOIMessage();
            msg.relayMessage()
            .css('background', 'green')
            .animate(
                {'background-color':'transparent'}, 
                'slow', 
                'swing', 
                function(){$(this).removeAttr('style');
            });

            e.preventDefault();
            $("#msg").val('');
            $("#msg").html('');
        }
    });

    // check for exceeded char length
    $("#msg").on('keydown', function(e) {
        var length1 = $("#msg").val().length;
            //It always returns 1 greater than the length so I reduce its size by 1.
            length1=length1-1; 
            if(length1>40){
               $("#msg").notify("Message over 40 chars!");
        }
    });


    //bind elements of the DOM to BYOI methods    
    $('#connectButton').click(function(){
        // attempt connection to the server
        
    });


    $('.delete-msg-btn').click(function(){
        // delete all selected messages from the main Message Handler
        $('#messageList').getSelectedMessages().remove();
        $('#msg').val('');
    });    


    // enable click selection of messages
    $(document).on('click', '.BYOI-message', function(){// bind to every BYOI message, regardless of their Message Handler
        // toggle selection
        $(this).toggleSelectMessage();
        // set the input value to the selected message's text 
        $('#msg').val($(this).data('text'));
        if($(this).hasClass('selected-msg')){
                $(this).removeClass('selected-msg');
                $("#textbox-msg").val("");
                // msgSelected = false;
            } else {
                $(this).addClass('selected-msg');
                // msgSelected = true;
                var content = $(this).html();
                $("#textbox-msg").val(content);
        }
    });

    // bind combine method to the message handler
    $('.combine-btn').click(function(){
        $('#messageList').combineMessages(); 
        $('#messageList').getSelectedMessages().toggleSelectMessage();
    });

    // bind split method to the message handler
    $('.split-btn').click(function(){
        $('<div><span class="text">' + $('#msg').val() +'</span></div>').BYOIMessage()
        .splitMessage().relayMessage();
        $('#messageList').getSelectedMessages().toggleSelectMessage();
    });

    // bind checksum method to the message
    $('.add-checksum-btn').click(function(){
        // get the text
        var input = $('#msg');
        // create a new message from the input text and add a checksum to it
        var msg = $('<div><span class="text">' + input.val() +'</span></div>').BYOIMessage()
        .addChecksum().relayMessage();
        // add the message to the input (update field value)
        BYOI.addMessageToContainer(msg, input);
        $('#messageList').getSelectedMessages().toggleSelectMessage();
    });
    
    // bind verify checksum method to the message handler
    $('.verify-checksum-btn').click(function(){
        // create a new message and verify the checksum
        var verify = $('<div><span class="text">' + $('#msg').val() +'</span></div>').BYOIMessage().verifyChecksum();
        $('#messageList').getSelectedMessages().toggleSelectMessage();
    });

    // bind encryption method to the message handler
    $('.encrypt-btn').click(function(){
        // encrypt the last select
        var msg = $('<div><span class="text">' + $('#msg').val() +'</span></div>').BYOIMessage().encryptMessage(
            parseInt(+$('#recipient').val()) // encryption key is the recipient node
        ).relayMessage(); // send to every message handler
        // add the message to the input (update field value)
        BYOI.addMessageToContainer(msg, $('#msg'));
        $('#messageList').getSelectedMessages().toggleSelectMessage();
    });

    // bind decryption method to the message handler
    $('.decrypt-btn').click(function(){
        var msg = $('<div><span class="text">' + $('#msg').val() +'</span></div>').BYOIMessage().decryptMessage(
            parseInt(+$('#recipient').val()) // decryption key is the recipient node
        ).relayMessage(); // send to every message handler
        // add the message to the input (update field value)
        BYOI.addMessageToContainer(msg, $('#msg'));
        $('#messageList').getSelectedMessages().toggleSelectMessage();
    });

    // bind random number method to the message handler
    $('.add-random-btn').click(function(){
        // add a random number to the last selected element of the message handler
        var msg = $('<div><span class="text">' + $('#msg').val() +'</span></div>').BYOIMessage()
        .addRandomNumber().relayMessage();
        // add the message to the input (update field value)
        BYOI.addMessageToContainer(msg, $('#msg'));
    });

    // bind send method to the message handler
    $('.send-btn').click(function(){
        // create a new message 
        // NOTE at least one tag with class "text" should be inside the 
        // html of a message, otherwise the content sent will be an 
        // empty string
        //
        // also, notice that because of this, the message is not inserted with 
        // all the html tags provided, but only those that were inside the 
        // tag with the "text" class.
        var html = '<div><span class="text">'+$('#msg').val()+'</span></div>';
        // sent message to the server
        var nodeToSendTo = $('#recipient').val()
        if (!nodeToSendTo)
            nodeToSendTo = 0;
        $(html).BYOIMessage().send(nodeToSendTo);
        $('#messageList').getSelectedMessages().toggleSelectMessage();
    });


    // bind close connection method to the message handler
    $('#closeButton').click(function() {
        BYOI.connection.close();
    });


    // create a System Alert
    //$('#systemMessage').BYOISystemAlert();
    $('#systemMessage').BYOISystemAlert({
        //this is the default behaviour if the onAlert property is not provided
        onAlert:function(alert){ 
            $('#systemMessage').html(alert); 
        }
    });
    
    // create a Message Handler
    $('#messageList').BYOIMessageHandler({
        accept:function(message){ 
            return true; 
        }, 
        onError:function(msg){console.log(msg);}
    });

    // create a Message Handler with a filter
    encrypted = $('<div id="encryptedList">encrypted messages</div>');
    encrypted.BYOIMessageHandler({
        accept: function(msg){
            return msg.hasClass('encrypted');
        }
    });
    // add the second message handler to the DOM
    $('#sidebar').append(encrypted);
});
