let UserProme = document.location.href?.split("?");
let Promocode = UserProme[1]?.split("=");

var phoneData;
axios
  .get("https://api.astropoints.in/auth/getNumber?id=1")
  .then((result) => {
    phoneData = result?.data?.phone;
    let anchors = document.querySelectorAll("a");
    anchors.forEach(function (anchor) {
      if (Promocode!=undefined) {
        console.log(Promocode[1]);
        anchor.href = `https://api.whatsapp.com/send?phone=${result?.data?.phone}&text=Hi%2C%20I%20Need%20ID%20,CODE%20-${Promocode[1]}`;
        document.getElementById("PromoCode").value=Promocode[1];
        document.getElementById("PromoCode").disabled = true;

      } else {
        anchor.href = `https://api.whatsapp.com/send?phone=${result?.data?.phone}&text=Hi%2C%20I%20Need%20ID%20,CODE%20-FREE50`;
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });

const submitForm = (event) => {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let PromoCode = document.getElementById("PromoCode").value;

  let url = `https://api.whatsapp.com/send?phone=${phoneData}&text=Name-%20${name}%0APhone-${phone}%2C%0APromocode-${PromoCode}`;

  return window.location.replace(url);
};
