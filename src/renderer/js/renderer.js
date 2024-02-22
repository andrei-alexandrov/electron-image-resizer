const form = document.getElementById("img-form");
const img = document.getElementById("img");
const outputPath = document.getElementById("output-path");
const filename = document.getElementById("filename");
const heightInput = document.getElementById("height");
const widthInput = document.getElementById("width");

const loadImage = (e) => {
  const file = e.target.files[0]; //Can i do also img.files[0]; ?

  if (!isFileImage(file)) {
    displayToastMessage(
      "Please select an image. Acceptable formats are: gif, png, jpeg, jpg", "alert"
    );
    return;
  }
  // console.log("Success");

  //Here i get the orignal dimensions
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = "block";
  filename.innerText = file.name;
  outputPath.innerText = path.join(os.homedir(), "imageresizer");
};

//I am sending the image data to the main process
const sendImage = (e) => {
  e.preventDefault();

  const width = widthInput.value;
  const height = heightInput.value;
  const imagePath = img.files[0].path;

  if (!img.files[0]) {
    displayToastMessage("Please, upload an image.", "alert");
  }

  if (!width || !height) {
    displayToastMessage("Please fill in a width and height.", "alert");
  }

  //I am sending to the main process using ipcRenderer
  ipcRenderer.send("image:resize", {
    imagePath,
    width,
    height,
  });
};

//Catching the "image:done"
ipcRenderer.on("image:done", () => {
  displayToastMessage(
    `Image is resized to ${widthInput.value} x ${heightInput.value}`, "success"
  );
});

//I am making sure that the file is an image
const isFileImage = (file) => {
  const acceptedImageTypes = [
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];
  return file && acceptedImageTypes.includes(file["type"]);
};

const displayToastMessage = (message, messageType) => {
  let backgroundColor;
  switch (messageType) {
    case 'success':
      backgroundColor = "green";
      break;
    case 'alert':
      backgroundColor = "red";
      break;
    default:
      backgroundColor = "orange";
  }

  Toastify.toast({
    text: message,
    duration: 5501,
    close: false,
    style: {
      background: backgroundColor,
      color: "white",
      textAlign: "center",
      fontSize: "18px",
      padding: "6px",
    },
  });
};



// const callAlertMessage = (message) => {
//   Toastify.toast({
//     text: message,
//     duration: 5001,
//     close: false,
//     style: {
//       background: "red",
//       color: "white",
//       textAlign: "center",
//       fontSize: "18px",
//       padding: "6px",
//     },
//   });
// };

// const callSuccessMessage = (message) => {
//   Toastify.toast({
//     text: message,
//     duration: 5501,
//     close: false,
//     style: {
//       background: "green",
//       color: "white",
//       textAlign: "center",
//       fontSize: "18px",
//       padding: "6px",
//     },
//   });
// };

img.addEventListener("change", loadImage);
form.addEventListener("submit", sendImage);
