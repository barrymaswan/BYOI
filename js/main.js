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
            $("#shell-messages").wrapInner( $( "<span class='red'></span>" ) );
            $(this).val("");
        }
    });

    $(document).on('click', 'li.terminal-msg', function() {
        var msgs = document.getElementById("shell-messages");
        var listItem = msgs.getElementsByTagName("li");
        var listLength = listItem.length;
        
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

        for (i = 1; i < listLength; i++) {
            if ($(listItem[i]).hasClass('selected-msg')) {
                msgSelected = true;
                return;
            }
        }

        msgSelected = false;
    });

    // event listeners for sending messages

    // encryption in this fn is a place holder for the actual encryption that
    // will be happening in the backend
    $("#encrypt-btn").on('click', function() {
        if (msgSelected == false) {
            $("#encrypt-btn").notify("Please Select A Message First", { position:"left" });
        } else {
            var msgs = document.getElementById("shell-messages");
            var listItem = msgs.getElementsByTagName("li");
            var listLength = listItem.length;
            for (i = 1; i < listLength; i++) {
                if ($(listItem[i]).hasClass('encrypted')) {
                    $("#encrypt-btn").notify("This Message Is Already Encrypted.", { position:"left" })
                    return;;
                }
                if($(listItem[i]).hasClass('selected-msg')) {
                    //$("#encrypt-btn").notify("Messaged Encrypted!", "success");
                    var coded = encrypt(listItem[i].innerHTML);
                    $(listItem[i]).addClass('encrypted');
                    $(listItem[i]).removeClass('decrypted');
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
        var length1 = $("#textbox-msg").val().length;
        //It always returns 1 greater than the length so I reduce its size by 1.
        length1=length1-1; 
        if(length1>40){
           $("#textbox-msg").notify("Message too long, please split the message.");
        }
        else{
           $("#textbox-msg").notify("Message Sent!");
           $(".selected-msg").addClass('sent-terminal-msg');
        }

       // $("#textbox-msg").notify(length1, { position:"left" });
        //$("#msgModal").modal();
        $(".selected-msg").addClass('sent-terminal-msg');

    });

    /////////////////////////////////////////////////////////////////////////////
    // event listeners for receiving messages

    // encrypting messages for purposes of the demo
    $("#receive-msg-btn").on('click', function() {

        //alert("message has been successfully received");
        var content = 'hello from the other side';
        var coded = encrypt(content);
        $("#shell-messages").append("<li class='terminal-msg received-terminal-msg encrypted'>"+coded+"</li>");

    });

    $("#delete-msg-btn").on('click', function() {
        $(".selected-msg").removeClass("encrypt");
        $(".selected-msg").removeClass("decrypt");
        $(".selected-msg").addClass("hidden");
        $(".selected-msg").removeClass("selected-msg");
        $("#textbox-msg").val("");

    });

    $("#verify-checksum-btn").on('click', function() {
        if (msgSelected == false) {
            $("#verify-checksum-btn").notify("Please Select A Message First.", { position:"right" });
        } else {
            
        }
    });

    

    $("#decrypt-btn").on('click', function() {
        if (msgSelected == false) {
            $("#decrypt-btn").notify("Please Select A Message First.", { position:"right" });
        } else {
            var msgs = document.getElementById("shell-messages");
            var listItem = msgs.getElementsByTagName("li");
            var listLength = listItem.length;
            for (i = 1; i < listLength; i++) {
                // if ($(listItem[i]).hasClass('decrypted')) {
                //     alert("The message is already decrypted");
                //     return;
                // }
                if($(listItem[i]).hasClass('selected-msg')) {
                    var uncoded = decrypt(listItem[i].innerHTML);
                    $(listItem[i]).addClass('decrypted');
                    $(listItem[i]).removeClass('encrypted');
                    listItem[i].innerHTML = uncoded;
                    $("#textbox-msg").val(uncoded);
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


