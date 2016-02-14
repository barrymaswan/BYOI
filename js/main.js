var msgSelected = false;

// en(de)crpyt function got from: http://www.mvjantzen.com/blog/?p=1005

function encrypt(content)
{
    var key = "SXGWLZPDOKFIVUHJYTQBNMACERxswgzldpkoifuvjhtybqmncare";
            content = content.toUpperCase().replace(/^\s+|\s+$/g,"");
            var coded = "";
            var chr;
              for (var i = content.length - 1; i >= 0; i--) {
                chr = content.charCodeAt(i);
                coded += (chr >= 65 && chr <= 90) ? 
                  key.charAt(chr - 65 + 26*Math.floor(Math.random()*2)) :
                  String.fromCharCode(chr); 
            }

            return coded;
}

function decrypt(coded)
{
    var key = "SXGWLZPDOKFIVUHJYTQBNMACERxswgzldpkoifuvjhtybqmncare";
          
          coded = decodeURIComponent(coded);  
          var uncoded = "";
          var chr;
          for (var i = coded.length - 1; i >= 0; i--) {
            chr = coded.charAt(i);
            uncoded += (chr >= "a" && chr <= "z" || chr >= "A" && chr <= "Z") ?
              String.fromCharCode(65 + key.indexOf(chr) % 26) :
              chr; 
            }
        uncoded = uncoded.toLowerCase();
        return uncoded;
}



$(document).ready(function(){
    $("#shell-messages").sortable();
    $("#shell-messages").disableSelection();
    $("#textbox-msg").on('keydown', function(e){
        if(e.which == 13) {
            var content = $(this).val();
            $("#shell-messages").append("<li class='terminal-msg'>" + content + "</li>");
            $(this).val("");
        }
    });

    $(document).on('click', 'li.terminal-msg', function() {
        if($(this).hasClass('selected-msg')){
            $(this).removeClass('selected-msg');
            $("#textbox-msg").val("");
            msgSelected = false;
        } else {
            $(this).addClass('selected-msg');
            msgSelected = true;
            var content = $(this).html();
            $("#textbox-msg").val(content);
        }
    });

    // event listeners for sending messages

    // encryption in this fn is a place holder for the actual encryption that
    // will be happening in the backend
    $("#encrypt-btn").on('click', function() {
        if (msgSelected == false) {
            alert("Select a message first");
        } else {
            var msgs = document.getElementById("shell-messages");
            var listItem = msgs.getElementsByTagName("li");
            var listLength = listItem.length;
            for (i = 1; i < listLength; i++) {
                if ($(listItem[i]).hasClass('encrypted')) {
                    alert("The message is already encrypted");
                    return;
                }
                if($(listItem[i]).hasClass('selected-msg')) {
                    var coded = encrypt(listItem[i].innerHTML);
                    $(listItem[i]).addClass('encrypted');
                    listItem[i].innerHTML = coded;
                }
            }
        }

    });

    // for purposes of the demo, splitting string is into two
    $("#split-btn").on('click', function() {
        var content = $('.selected-msg').html();
        var index = content.length / 2;
        var str1 = content.substring(0, index);
        var str2 = content.substring(index);
        $("#shell-messages").append("<li class='terminal-msg'>" + str1 + "</li>");
        $("#shell-messages").append("<li class='terminal-msg'>" + str2 + "</li>");
    });

    $("#add-checksum-btn").on('click', function() {
        var content = $('.selected-msg').html();
        var checksum = Math.random() * 100;
        $('.selected-msg').html(content + ":" + parseInt(checksum).toString());

    });

    $("#send-btn").on('click', function() {
        $("#msgModal").modal();
        $(".selected-msg").addClass('sent-terminal-msg');

    });

    /////////////////////////////////////////////////////////////////////////////
    // event listeners for receiving messages

    // encrypting messages for purposes of the demo
    $("#receive-msg-btn").on('click', function() {
        alert("message has been successfully received");
        var content = 'hello from the other side';
        var coded = encrypt(content);
        $("#shell-messages").append("<li class='terminal-msg received-terminal-msg'>"+coded+"</li>");

    });

    $("#delete-msg-btn").on('click', function() {
        $(".selected-msg").addClass("hidden");
        $("#textbox-msg").val("");

    });

    $("#verify-checksum-btn").on('click', function() {
        if (msgSelected == false) {
            alert("Select a message first");
        } else {
            alert("checksum valid");
        }
    });

    

    $("#decrypt-btn").on('click', function() {
        if (msgSelected == false) {
            alert("Select a message first");
        } else {
            var msgs = document.getElementById("shell-messages");
            var listItem = msgs.getElementsByTagName("li");
            var listLength = listItem.length;
            for (i = 1; i < listLength; i++) {
                if ($(listItem[i]).hasClass('decrypted')) {
                    alert("The message is already decrypted");
                    return;
                }
                if($(listItem[i]).hasClass('selected-msg')) {
                    var uncoded = decrypt(listItem[i].innerHTML);
                    $(listItem[i]).addClass('decrypted');
                    listItem[i].innerHTML = uncoded;
                }
            }
        }


    });

    $("#combine-btn").on('click', function() {
        var combinedStr = "";
        var msgs = document.getElementById("shell-messages");
        var listItem = msgs.getElementsByTagName("li");
        var listLength = listItem.length;
        for (i = 1; i < listLength; i++) {
            if($(listItem[i]).hasClass('selected-msg')) {
                if (i != 1) 
                    combinedStr += (" " + listItem[i].innerHTML);
                else
                    combinedStr += listItem[i].innerHTML;
            }
        }

        $("#shell-messages").append("<li class='terminal-msg'>" + combinedStr + "</li>");


    });

});


