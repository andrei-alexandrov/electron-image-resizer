const form = document.getElementById("img-form");
const img = document.getElementById("img");
const outputPath = document.getElementById("output-path");
const filename = document.getElementById("filename");
const heightInput = document.getElementById("height");
const widthInput = document.getElementById("width");

const loadImage = (e) => {
  const file = e.target.files[0]; //Can i do also img.files[0]; ?

  if (!isFileImage(file)) {
    callAlertMessage(
      "Please select an image. Acceptable formats are: gif, png, jpeg"
    );
    return;
  }
  console.log("Success");

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
    callAlertMessage("Please, upload an image.");
  }

  if (!width || !height) {
    callAlertMessage("Please fill in a width and height.");
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
  callSuccessMessage(
    `Images is resized to ${widthInput.value} x ${heightInput.value}`
  );
});

//I am making sure that the file is an image
const isFileImage = (file) => {
  const acceptedImageTypes = [
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];
  return file && acceptedImageTypes.includes(file["type"]);
};

const callAlertMessage = (message) => {
  Toastify.toast({
    text: message,
    duration: 5001,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center",
    },
  });
};

const callSuccessMessage = (message) => {
  Toastify.toast({
    text: message,
    duration: 4501,
    close: false,
    style: {
      background: "green",
      color: "white",
      textAlign: "center",
    },
  });
};

img.addEventListener("change", loadImage);
form.addEventListener("submit", sendImage);
