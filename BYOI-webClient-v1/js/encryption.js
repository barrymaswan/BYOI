$(document).ready(function() {

    //generates the sum value of the string text with a colon appended to it
    function sumGenerator(text){
        var sum = 0;
        for(var i=0; i < text.length; i++){
            sum += text.charCodeAt(i);
        }
        sum += ':'.charCodeAt(0);
        return sum;
    }

    //appends a checksum to the value in the message box
    BYOI.addChecksum = function(){
        //our implementation of http://stackoverflow.com/a/46486
        var val = $('#msg').val();
        var checksum = (98 - (sumGenerator(val) * 100 % 97)) % 97;
        $('#msg').val(val + ':' + checksum.toString());
    };
    
    //bind the button to function
    $('#checksumButton').click(BYOI.addChecksum);
    
    //verifies the validity of the checksum in the message box
    BYOI.verifyChecksum = function(){
        var val = $('#msg').val();
        var checksum = parseInt(val.substr(val.length - 2));
        val = val.substr(0, val.length-3);
        var msg = (sumGenerator(val) * 100 + checksum) % 97 == 1?
            'Correct!':'Error!';
        $('#systemMessage').html(msg);
    };
    //bind the button to function
    $('#verifyButton').click(BYOI.verifyChecksum);

    //encrypts the message in the message box using the provided key
    //which defaults to your node number
    BYOI.encryptMessage = function(key){
        //if a key is provided, use, otherwise, get the value from the 
        //recipient field, if that field is empty, defaults to node number
        key = typeof key == 'number'? key :
            $('#recipient').val() != '' ? 
            $('#recipient').val() : BYOI.myNode;
        console
        var val = $('#msg').val();
        var encryptedString = '';
        for(var i=0; i < val.length; i++){
            var s = '000' + (val.charCodeAt(i) + key % 100 ).toString();
            encryptedString += s.substring(s.length - 3);
        }
        $('#msg').val(encryptedString);
    };
    BYOI.encryptMessage(1);
    //bind the button to function
    $('#encryptButton').click(BYOI.encryptMessage);

    //encrypts the message in the message box using the provided key
    BYOI.decryptMessage = function(key){
        //if a key is provided, use, otherwise, get the value from the 
        //recipient field, if that field is empty, defaults to node number
        key = typeof key == 'number'? key :
            $('#recipient').val() != '' ? 
            $('#recipient').val() : BYOI.myNode;
        var encryptedString = $('#msg').val();
        var s = '';
        while(encryptedString.length > 0){
            var chunk = parseInt(encryptedString.substr(0,3));
            encryptedString = encryptedString.substr(3);
            chunk -= key % 100;
            s += String.fromCharCode(chunk);
        }
        $('#msg').val(s);
    };
    //bind the button to function
    $('#decryptButton').click(BYOI.decryptMessage);

    //append a random number to the message box
    BYOI.addRandomNumber = function(){
        var val = $('#msg').val();
        $('#msg').val(val + '|' + Math.floor(Math.random() * 10000));
    };
    //bind the button to function
    $('#randomButton').click(BYOI.addRandomNumber);


});
