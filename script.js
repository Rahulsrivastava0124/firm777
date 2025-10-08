let UserProme = document.location.href?.split("?");
let Promocode = UserProme[1]?.split("=");

var phoneData;
axios
  .get("https://api-firm777-com.onrender.com/getPhone")
  .then((result) => {
    console.log("result data:--",result.data?.Phone);
    
    phoneData = result?.data?.phone;
    let anchors = document.querySelectorAll("a");
    anchors.forEach(function (anchor) {
      if (Promocode != undefined) {
        console.log(Promocode[1]);
        anchor.href = `https://api.whatsapp.com/send?phone=${result?.data?.Phone}&text=Hi%2C%20I%20Need%20ID%20,CODE%20-${Promocode[1]}`;
        if (document.getElementById("PromoCode")) {
          document.getElementById("PromoCode").value = Promocode[1];
          document.getElementById("PromoCode").disabled = true;
        }
      } else {
        anchor.href = `https://api.whatsapp.com/send?phone=${result?.data?.Phone}&text=Hi%2C%20I%20Need%20ID%20,CODE%20-FREE50`;
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

  // fetch(`https://script.google.com/macros/s/AKfycbwAgpXTcCE4hlWPn349bUPNYwelfjLYsTVmyf8nh8oaJZdO388dpnYmZdmM0xWI_0Tzug/exec`,{
  //   redirect: "follow",
  //   method: "POST",
  //   body: JSON.stringify({
  //     Name: name,
  //     Phone: phone,
  //     Promocode: PromoCode,
  //   }),
  //   headers: {
  //     "Content-Type": "text/plain;charset=utf-8",
  //   },
  // })

  const formatDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  };

  const data = {
    Name: name,
    Phone: phone,
    Promocode: PromoCode,
    Date: formatDate()

};

const formData = new FormData();

for (const key in data) {
    if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
    }
}

  fetch(
    "https://script.google.com/macros/s/AKfycbzAQnNKAKiUEjnK-smHTx1crstgvetlvv5sDnAMoybCZ7Ydl8M9x7hEUlJY6zKUOx_5xw/exec",
    {
      method: "POST",
      mode: "no-cors",
      body: formData,
      headers: {
        "Content-Type": "application/json", // <--- Correct Content-Type
      },
    }
  )
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("SubmitIndex").innerHTML = "Loding...";
      return window.location.replace(url);
    })
    .catch((err) => {
      document.getElementById("SubmitIndex").innerHTML = "Loding...";
      return window.location.replace(url);
      console.log(err.message);
      
    });

  // axios.post("https://api-firm777-com.onrender.com/createUser",{
  //   name,
  //   phone,
  //   promocode:PromoCode,
  // }).then(result => {

  //   console.log(result);
  //   document.getElementById('SubmitIndex').innerHTML="Loding...";
  //   return window.location.replace(url);
  // }).catch((err) => {
  //   console.log(err)
  // })
};

function GoLanding() {
  window.location.href = "./form777.html";
}

// Initialize Swiper for step images
document.addEventListener('DOMContentLoaded', function() {
  const stepSwiper = new Swiper('.stepSwiper', {
    // Optional parameters
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    effect: 'slide',
    speed: 600,
    
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    
    // Pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    
    // Responsive breakpoints
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
    },
    
    // Additional options
    grabCursor: true,
    keyboard: {
      enabled: true,
    },
    mousewheel: {
      invert: false,
    },
  });
});