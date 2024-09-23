// var fs = require("fs");

var userData = {};

axios("https://firm777.com/Phone.json")
  .then((result) => {
    console.log(result);
    userData = result.data.user;
  })
  .catch((err) => {
    console.log(err);
  });

const login = (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
console.log(email == userData.email );
console.log(password == userData.password );

  if (email == userData.email || password == userData.password) {
    alert("login success !")
    window.location.replace("/phone.html");
  }else{
    alert("Invalid credentials!");
  }

  // Perform authentication logic here
  // Example: AJAX request to backend API for user authentication
  //
};

const updatePhone = (event) => {
  event.preventDefault();
  const phone = document.getElementById("phone").value;
  var phoneData;

  axios
    .get("https://api.astropoints.in/auth/getNumber?id=1")
    .then((result) => {
      phoneData = result?.data?.phone;
      axios.post(
        `https://api.astropoints.in/auth/update-ph?oldPhone=${result?.data?.phone}&newPhone=${phone}`
      ).then((result) => {
        alert(result.data.message)
        window.location.replace('./index.html')
      }).catch((err) => {
        alert(err.message)
      });;
    })
    .catch((err) => {
      console.log(error);
    });

  alert(phone);
};
