// var fs = require("fs");

const login = (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

axios
    .get("http://127.0.0.1:5500/Phone.json")
    .then((result) => {
      if (
        email == result.data.user.email ||
        password == result.data.user.password
      ) {
        // alert("login success");
        return window.location.replace("/phone.html");
      } else {
        alert("Invalid email or password");
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // Perform authentication logic here
  // Example: AJAX request to backend API for user authentication
  //
};

const updatePhone = (event) => {
  event.preventDefault();
  const phone = document.getElementById("phone").value;
  var phoneData;

  axios
    .get("https://13.235.115.172:8070/auth/getNumber?id=1")
    .then((result) => {
      console.log("phone update", result?.data?.phone);
      phoneData = result?.data?.phone;
      axios.post(
        `https://13.235.115.172:8070/auth/update-ph?oldPhone=${result?.data?.phone}&newPhone=${phone}`
      );
    })
    .catch((err) => {
      console.log(error);
    });

  alert(phone);
};
