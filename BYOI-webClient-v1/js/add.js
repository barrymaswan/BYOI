$(document).ready(function() {
    //add message in the message box to the list
    BYOI.addMessage = function(){
        var val = $('#msg').val();
        //if the content of the field is empty, generate a random string of 
        //length 10 

        /*if(val == '') 
            val = Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 10);*/

        if(val != ''){//only add message to the list if it's not empty
            $('#messageList').append(
                '<div class="added"><span class="text">' + 
                val +'</span>&nbsp;</div>'
            );
        }
    };
    //bind the button to function
    $('#addButton').click(BYOI.addMessage);
});
