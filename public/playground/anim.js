
// this jQuery "paints" the html adding content on the skeleton of placeholders (#demo)
// functional assignment


$("#demo").html('<img src="http://i.imgur.com/90Mmdcm.png">')
$("#demo img").hover(function(){ this.src = 'http://i.imgur.com/nTj3Fxx.gif'},
                     function(){ this.src = 'http://i.imgur.com/90Mmdcm.png'
})

$('#demo img').mousedown( function() {
    this.src = 'http://i.imgur.com/Rfj0a80.png'
})

$('#demo img').mousedown(function() {
    $('#demo').append(
    '<img class="demo-ball" src="http://i.imgur.com/oTyQRvX.gif">'
    );
})

$('#demo img').mousedown(function() {
    $('.demo-ball').animate( {
        "margin-left": "600px"
    }, 1000, 'swing', function() {
        this.remove();
    })
})

$('#demo img').mouseup(function() {
    this.src = 'http://i.imgur.com/90Mmdcm.png'
})
