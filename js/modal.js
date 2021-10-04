var modal = document.getElementById("video-modal");
var btn = document.getElementById("btn-video");
var span = document.getElementsByClassName("close")[0];

// Open modal
btn.onclick = function() {
  modal.style.display = "flex";
}

// X to close
span.onclick = function() {
  modal.style.display = "none";
}

// Click outside to close
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}