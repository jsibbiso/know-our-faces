$( document ).ready(function() {
    $(".container").fadeIn(125);
    
    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Invalid entry"
    );
    
    $("a.fade").click(function(event) {
        event.preventDefault();
        newLocation = this.href;
        $(".container").fadeOut(125, function newpage() {
            window.location = newLocation;
        }); 
    });
    
    //Photo screen
    $("#uploadForm input:submit").click(function() {
        $(".container").fadeOut(2000);
    }); 
    
    //Login screens
    $("#login-form").submit(function(event) {
        event.preventDefault();
    }).validate({
        rules: {
            email : {
                required: true
            }
        },
        submitHandler: function(form) {                        
            $(".container").fadeOut(125, function newpage() {
                form.submit();
            }); 
        }
    });
    
    //profile screens
    $("#profile-form").submit(function(event) {
        event.preventDefault();
    }).validate({
        rules: {
            name : {
                required: true
            }
        },
        submitHandler: function(form) {  
            $(".container").fadeOut(125, function newpage() {
                form.submit();
            }); 
        }
    });
    
    //Learn screens
    $( "a#show_answer" ).click(function( event ) {
        event.preventDefault();
        $("a#show_answer").fadeOut(100, function() {
            $("div#answer").fadeIn(200);
        });
    });
    
    $("div#response a").click(function( event ) {
        var $this = $( this );
        var reviewData = $("div#response")
        var dataResponse = {
            recall:$this.data("response"),
            reviewerId: reviewData.data("reviewer_id"),
            reviewedId: reviewData.data("reviewed_id")
        };
                
        $.post("/learn/recordRecall", dataResponse, 
               function( json ) { 
                   $(".container").fadeOut(125, function newpage() {
                        location.reload(); 
                    }); 
               } 
              ,"json")
            .fail(function( xhr, status ) {
                alert( "Sorry, there was a problem! Refresh!!!" );
            });
    });
});

