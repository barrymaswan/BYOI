$(document).ready(function() {
    //move all selected messages one position up in the list
    BYOI.moveMessagesUp = function(){
        $('#messageList div').each(function(){
            if($(this).hasClass('selected')){
                var index = $(this).index();
                if(index > 1){
                    var previous = $('#messageList').children().eq(index-1);
                    if(!previous.hasClass('selected')){
                        $(this).detach().insertBefore(previous);
                    }
                }
            }
        });
    };
    //bind the button to function
    $('#upButton').click(BYOI.moveMessagesUp);

    //move all selected messages one position down in the list
    BYOI.moveMessagesDown = function(){
        $($('#messageList div').get().reverse()).each(function(){
            if($(this).hasClass('selected')){
                var index = $(this).index();
                var length = $(this).parent().children().length;
                if(index < length - 1){
                    var next = $('#messageList').children().eq(index+1);
                    if(!next.hasClass('selected')){
                        $(this).detach().insertAfter(next);
                    }
                }
            }
        });
    };
    //bind the button to function
    $('#downButton').click(BYOI.moveMessagesDown);
});
