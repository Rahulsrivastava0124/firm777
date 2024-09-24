console.log("hello fire777");
var phoneData;
axios
  .get("https://api.astropoints.in/auth/getNumber?id=1")
  .then((result) => {
    console.log("phone", result?.data?.phone);
    phoneData = result?.data?.phone;
    let anchors = document.querySelectorAll("a");
    anchors.forEach(function (anchor) {
      anchor.href = `https://api.whatsapp.com/send?phone=${result?.data?.phone}&text=Continue%20to%20Chat%0AHi%2C%20I%20Need%20!D%20%EF%BF%BD%20CODE%20-%20%5B%FREE50%20%5D`;
    });
  })
  .catch((err) => {
    console.log(error);
  });

const submitForm = (event) => {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let PromoCode = document.getElementById("PromoCode").value;

  let url = `https://api.whatsapp.com/send?phone=${phoneData}&text=Name-%20${name}%0APhone-${phone}%2C%0APromocode-${PromoCode}`;

 return window.location.replace(url)

  //   console.log(url);

  console.log(name, phone, PromoCode, phoneData);
};
