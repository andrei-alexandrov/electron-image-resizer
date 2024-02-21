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
    duration: 4001,
    close: false,
    style: {
      background: "green",
      color: "white",
      textAling: "center",
    },
  });
};

img.addEventListener("change", loadImage);
