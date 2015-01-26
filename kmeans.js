var dropbox;

dropbox = document.getElementById("dropbox");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  console.log("got here");

  var dt = e.dataTransfer;
  var files = dt.files;

  handleFiles(files);
}

function handleFiles(files) {
  var preview = document.getElementById("preview");

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var imageType = /image.*/;

    if (!file.type.match(imageType)) {
      continue;
    }

    var img = document.createElement("img");
    var reader = new FileReader();
    reader.onload = function(e) {
      img.src = e.target.result

      var MAX_WIDTH = 100;
      var MAX_HEIGHT = 100;
      var width = img.width;
      var height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }



      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
    }
    reader.readAsDataURL(file);


  }
}
