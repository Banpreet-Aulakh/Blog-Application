function getLocation() {
  const checkbox = document.getElementById("shareLocation");
  const submitButton = document.querySelector("button[type='submit']");

  if (checkbox.checked) {
    if (navigator.geolocation) {
      submitButton.disabled = true;
      submitButton.textContent = "Getting location...";

      navigator.geolocation.getCurrentPosition(
        (position) => {
          document.getElementById("latitude").value = position.coords.latitude;
          document.getElementById("longitude").value =
            position.coords.longitude;
          console.log(
            "Location acquired:",
            position.coords.latitude,
            position.coords.longitude
          );

          submitButton.disabled = false;
          submitButton.textContent = document
            .querySelector("form")
            .action.includes("edit-post")
            ? "Update Post"
            : "Create Post";
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          checkbox.checked = false;

          submitButton.disabled = false;
          submitButton.textContent = document
            .querySelector("form")
            .action.includes("edit-post")
            ? "Update Post"
            : "Create Post";
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      checkbox.checked = false;
    }
  } else {
    document.getElementById("latitude").value = "";
    document.getElementById("longitude").value = "";
  }
}
