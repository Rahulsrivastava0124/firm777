console.log("hello fire777");
var phoneData;
axios
  .get("http://13.235.115.172:8070/auth/getNumber?id=1")
  .then((result) => {
    console.log("phone", result?.data?.phone);
    phoneData = result?.data?.phone;
    let anchors = document.querySelectorAll("a");
    anchors.forEach(function (anchor) {
      anchor.href = `https://api.whatsapp.com/send?phone=${result?.data?.phone}&text=Continue%20to%20Chat%0AHi%2C%20I%20Need%20!D%20%EF%BF%BD%20Promo%20Code%20-%20%5B%20KLP190%20%5D`;
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

  let url = `https://api.whatsapp.com/send?phone=${phoneData}&text=${name}%3A-%20rahul%0Aphone%3A-${phone}%2C%0Apromocode%3A-${PromoCode}`;

  //   console.log(url);

  console.log(name, phone, PromoCode, phoneData);
};
