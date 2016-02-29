$(document).ready(function() {
    //combines the selected messages into one message and add it to the list
    //then, unselect all selected messages
    BYOI.combineMessages = function(){
        var val = '';
        $('#messageList div.selected .text').each(function(){
            val += $(this).html();
        });
        $('#messageList').append(
            '<div class="added"><span class="text">' + 
            val +'</span>&nbsp;</div>'
        );
        $('#messageList div').removeClass('selected');
    };
    //bind button to function
    $('#combineButton').click(BYOI.combineMessages);

    //split text in several chunks of length len
    //and return them in reversed order 
    function chunker(text, len){
        var chunks = [];
        while(text.length > len){
            chunks.unshift(text.substr(0,len))
            text = text.substr(len);   
        }
        chunks.unshift(text);
        return chunks;
    }

    //splits each selected message into chunks of length len
    //and then add each piece underneath the original 'long' message
    //then, unselect all selected messages
    BYOI.splitMessages = function(len){
        len = typeof len !== 'undefined' ? len : 30;
        $('#messageList div.selected').each(function(){
            var val = $(this).find('.text').html();
            if(val.length > len){
                var chunks = chunker(val, len);
                for(var i=0; i < chunks.length; i++){
                    $('<div class="added"><span class="text">' + 
                        chunks[i] +'</span>&nbsp;</div>')
                        .insertAfter($(this));
                }
            }
        });
        $('#messageList div').removeClass('selected');
    };
    //bind button to function
    $('#splitButton').click(BYOI.splitMessages);
});
