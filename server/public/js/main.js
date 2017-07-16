console.log("main.js connected!")

var imageUpload;



$("document").ready(function() {
  $('.like').hide();
	//hide profile image button uploader
//$('#profileImage').hide();
	//$('.descriptionEdit_toggle').hide();
	$('#uploadPost').hide();
	//$('.gear_background').hide();

	$('#upload').click(function(e){
		e.preventDefault()
		$('#uploadPost').click();

	});

	$('.profile_image').hover(function(e){

		$('.gear_background').show();
	}, function(e){
			$('.gear_background').hide();

	})

	$('.gear_background').hover(function(e){

		$('.gear_background').show();
	});

	$('.image_post').hover(function(e){

		$('.descriptionEdit_toggle').show();
	}, function(e){

		$('.descriptionEdit_toggle').hide();
	});

	$('.descriptionEdit_toggle').hover(function(e){

		$('.descriptionEdit_toggle').show();
	});

	//default toggled up
	$("nav a").toggle();

	//on click of gear icon click image button uploader
	$('#gear').click(function(e){

		$('#profileImage').click();

	});
//navigation icon button
$(".hamburger").on("click", function(event){
  //event.preventDefault();

  $("nav a").toggle();
});

$("nav a").on("click", function(e){

	$("nav a").toggle();
})

//on double click of image trigger like button click
// $(".image_post").dblclick(function(e){
// 		e.preventDefault()
// 		$('.like').click();
// })


 $(".image_post2").on("touchstart", tapHandler);

var tapedTwice = false;

function tapHandler(event) {
    if(!tapedTwice) {
        tapedTwice = true;
        setTimeout( function() { tapedTwice = false; }, 300 );
        return false;
    }
    event.preventDefault();
    //action on double tap goes below
    $('.like').click();
 }



		//profileimage upload process
  $('#profileImage').on("change", function() {

    var $files = $(this).get(0).files;

    if ($files.length) {

      // Reject big files
      if ($files[0].size > $(this).data("max-size") * 1024) {
        console.log("Please select a smaller file");
        return false;
      }

      // Begin file upload
      console.log("Uploading file to Imgur..");

      // Replace ctrlq with your own API key
      var apiUrl = 'https://api.imgur.com/3/image';
      var apiKey = '87bc75c6b87b4fe';

      var settings = {
        async: false,
        crossDomain: true,
        processData: false,
        contentType: false,
        type: 'POST',
        url: apiUrl,
        headers: {
          Authorization: 'Client-ID ' + apiKey,
          Accept: 'application/json'
        },
        mimeType: 'multipart/form-data'
      };

      var formData = new FormData();
      formData.append("image", $files[0]);
      settings.data = formData;

      // Response contains stringified JSON
      // Image URL available at response.data.link
      $.ajax(settings).done(function(response) {

      	resJson = JSON.parse(response);
        console.log(resJson.data.link);

        imageUpload = resJson.data.link
        var userId = $('#userId').val();

        var upload = {image: imageUpload};

        //post image to users profile when they upload
        //make a post request to /post
        $.ajax({

        	method: "PATCH",
        	url: "../" + userId,
        	data: upload,
        	success: function(response){

        		// window.location.reload();
        	}

        });

      });

    }
  });

	//image upload process
  $('#uploadPost').on("change", function() {

    var $files = $(this).get(0).files;

    if ($files.length) {

      // Reject big files
      if ($files[0].size > $(this).data("max-size") * 1024) {
        console.log("Please select a smaller file");
        return false;
      }

      // Begin file upload
      console.log("Uploading file to Imgur..");

      // Replace ctrlq with your own API key
      var apiUrl = 'https://api.imgur.com/3/image';
      var apiKey = '87bc75c6b87b4fe';

      var settings = {
        async: false,
        crossDomain: true,
        processData: false,
        contentType: false,
        type: 'POST',
        url: apiUrl,
        headers: {
          Authorization: 'Client-ID ' + apiKey,
          Accept: 'application/json'
        },
        mimeType: 'multipart/form-data'
      };

      var formData = new FormData();
      formData.append("image", $files[0]);
      settings.data = formData;

      // Response contains stringified JSON
      // Image URL available at response.data.link
      $.ajax(settings).done(function(response) {

      	resJson = JSON.parse(response);
        console.log(resJson.data.link);

        imageUpload = resJson.data.link
        var userId = $('#userId').val();

        var upload = {link: imageUpload, description: "", userId: userId};

        //post image to users profile when they upload
        //make a post request to /post
        $.ajax({

        	method: "POST",
        	url: "../post",
        	data: upload,
        	success: function(response){

        		window.location.reload();
        	}

        });

      });

    }
  });

  	//description add process
 // $('.descr').hide();
  //$('.descriptionAdd_toggle').hide();
  // $('.descriptionEdit_toggle').click(function(e){
  // 			e.preventDefault();
  // 		$(e.target).parent().find(".descr").toggle()
  // 		  $(e.target).parent().find('.descriptionAdd_toggle').toggle();
  		
  		$('.descriptionAdd_toggle').click(function(e){
          e.preventDefault();
  			 var postId = $(e.target).parent().find('.postId').val();
  			 var description = $(e.target).parent().find('.description').val();

  			 // console.log(postId);
  			 // console.log(description);

  			 var newDescription = {description: description};
  			$.ajax({


  				method: "PATCH",
  				url: "../post/" + postId,
  				data: newDescription,
  				success: function(response){

  					window.location.reload();
  				}
  			});

  		});
  // });

      $('.profileAdd_toggle').click(function(e){
          e.preventDefault();
         var userId = $(e.target).parent().find('#userId').val();
         var name = $(e.target).parent().find('#profileForm_name').val();
          var location = $(e.target).parent().find('#profileForm_location').val();
           var bio = $(e.target).parent().find('#profileForm_bio').val();

         // console.log(postId);
         // console.log(description);

         var newProfile = {name: name, location: location, bio: bio};
        $.ajax({


          method: "PATCH",
          url: "../" + userId,
          data: newProfile,
          success: function(response){

            window.location.reload();
          }
        });

      });


  //still holding postId value from previous click so able to click the other like button and it increases
  //need to fix
  $('.like').click(function(e){
  		 var postId = $(e.target).parent().find('.postId').val();

  		$.ajax({


  			method: "POST",
  			url: "../post/" + postId + "/like",
  			success: function(response){
  				var postId ="";
  				window.location.reload();
  				
  			}

  		})



  })

  //add user to the friends array
  $('#add').click(function(e){

  		var userId = $('#userId').val();

  		$.ajax({


  			method: "POST",
  			url: "../" + userId + "/add",
  			success: function(response){

  				window.location.reload();
  			}
  		})


  })
  //remove user from the friends array
  $('#remove').click(function(e){

  	var userId = $('#userId').val();

  	$.ajax({

  		method: "DELETE",
  		url: "../" + userId + "/remove",
  		success: function(response){

  			window.location.reload();
  		}




  	})

  })

});

jQuery(document).ready(function($) {
  // // auto timer
  // setTimeout(function() {
  //   $('#lab-slide-bottom-popup').modal('show');
  // }, 5000); // optional - automatically opens in xxxx milliseconds

  $(document).ready(function() {
    $('.lab-slide-up').find('a').attr('data-toggle', 'modal');
    $('.lab-slide-up').find('a').attr('data-target', '#lab-slide-bottom-popup');
  });

});




