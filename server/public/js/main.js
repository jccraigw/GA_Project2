console.log("main.js connected!")

var imageUpload;

$("document").ready(function() {

  $('input[type=file]').on("change", function() {

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
        	url: "http://localhost:3000/post",
        	data: upload,
        	success: function(response){

        		window.location.reload();
        	}

        });

      });

    }
  });

  $('.descr').hide();
  $('.descriptionAdd_toggle').hide();
  $('.descriptionEdit_toggle').click(function(e){
  		$(e.target).parent().find(".descr").toggle()
  		  $(e.target).parent().find('.descriptionAdd_toggle').toggle();
  		
  		$('.descriptionAdd_toggle').click(function(){

  			 var postId = $(e.target).parent().find('.postId').val();
  			 var description = $(e.target).parent().find('.description').val();

  			 console.log(postId);
  			 console.log(description);

  			 var newDescription = {description: description};
  			$.ajax({


  				method: "PATCH",
  				url: "http://localhost:3000/post/" + postId,
  				data: newDescription,
  				success: function(response){

  					window.location.reload();
  				}
  			});

  		})
  });


  //still holding postId value from previous click so able to click the other like button and it increases
  //need to fix
  $('.like').click(function(e){
  		 var postId = $(e.target).parent().find('.postId').val();

  		$.ajax({


  			method: "POST",
  			url: "http://localhost:3000/post/" + postId + "/like",
  			success: function(response){

  				window.location.reload();
  			}

  		})



  })

});

