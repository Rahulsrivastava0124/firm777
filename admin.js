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

axios
  .get("https://api-firm777-com.onrender.com/users")
  .then((result) => {
    console.log(result);
    result.data.map((items, index) => {
      console.log(items);

      var table = document.getElementById("myTable");
      var row = table.insertRow(0);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = items.Name;
      cell2.innerHTML = items.Phone;
      cell3.innerHTML = items.Promocode;
      cell1.classList = "whitespace-nowrap px-4 py-2 text-gray-700";
      cell2.classList = "whitespace-nowrap px-4 py-2 text-gray-700";
      cell3.classList = "whitespace-nowrap px-4 py-2 text-gray-700";
    });
  })
  .catch((err) => {
    console.log(err);
  });

const login = (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(email == userData.email);
  console.log(password == userData.password);

  if (email == userData.email && password == userData.password) {
    alert("login success !");
    window.location.replace("/phone.html");
  } else {
    alert("Invalid credentials!");
  }
};

const updatePhone = (event) => {
  event.preventDefault();
  const phone = document.getElementById("phone").value;
  var phoneData;
  axios
    .post(`https://api-firm777-com.onrender.com/updatePhone`, {
      Phone: phone,
    })
    .then((result) => {
      alert("Change number is :-- ",result.data.Phone);
      window.location.replace("./index.html");
    })
    .catch((err) => {
      alert(err.message);
    });
};

function myFunction() {
  // Get the text field
  var copyText = document.getElementById("myInput");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  alert("Copied the text: " + copyText.value);
}

const CreatePromo = (event) => {
  event.preventDefault();

  let promoCode = document.getElementById("promocode").value;
  let url = `firm777.com?promocode=${promoCode}`;
  document.getElementById("myInput").value = url;

  console.log(promoCode);
};

// Tabs and Carousel preview logic for phone.html
document.addEventListener("DOMContentLoaded", function () {
  const tabMainBtn = document.getElementById("tabMainBtn");
  const tabCarouselBtn = document.getElementById("tabCarouselBtn");
  const tabSubdomainBtn = document.getElementById("tabSubdomainBtn");
  const tabMain = document.getElementById("tab-content-main");
  const tabCarousel = document.getElementById("tab-content-carousel");
  const tabSubdomain = document.getElementById("tab-content-subdomain");
  const carouselInput = document.getElementById("carouselInput");
  const carouselPreview = document.getElementById("carouselPreview");

  if (tabMainBtn && tabCarouselBtn && tabSubdomainBtn && tabMain && tabCarousel && tabSubdomain) {
    // Mobile nav buttons (topbar)
    const mobileTabMainBtn = document.getElementById("mobileTabMainBtn");
    const mobileTabCarouselBtn = document.getElementById("mobileTabCarouselBtn");
    const mobileTabSubdomainBtn = document.getElementById("mobileTabSubdomainBtn");

    const activateMain = () => {
      tabMain.style.display = "block";
      tabCarousel.style.display = "none";
      tabSubdomain.style.display = "none";
      tabMainBtn.classList.add("bg-indigo-600", "text-white");
      tabCarouselBtn.classList.remove("bg-indigo-600", "text-white");
      tabCarouselBtn.classList.add("bg-gray-200", "text-gray-800");
      tabSubdomainBtn.classList.remove("bg-indigo-600", "text-white");
      tabSubdomainBtn.classList.add("bg-gray-200", "text-gray-800");
      // mobile button visual state (best-effort)
      if (mobileTabMainBtn && mobileTabCarouselBtn && mobileTabSubdomainBtn) {
        mobileTabMainBtn.classList.add("bg-indigo-600", "text-white");
        mobileTabCarouselBtn.classList.remove("bg-indigo-600", "text-white");
        mobileTabCarouselBtn.classList.add("bg-gray-200", "text-gray-800");
        mobileTabSubdomainBtn.classList.remove("bg-indigo-600", "text-white");
        mobileTabSubdomainBtn.classList.add("bg-gray-200", "text-gray-800");
      }
    };
    const activateCarousel = () => {
      tabMain.style.display = "none";
      tabCarousel.style.display = "block";
      tabSubdomain.style.display = "none";
      tabCarouselBtn.classList.remove("bg-gray-200", "text-gray-800");
      tabCarouselBtn.classList.add("bg-indigo-600", "text-white");
      tabMainBtn.classList.remove("bg-indigo-600", "text-white");
      tabMainBtn.classList.add("bg-gray-200", "text-gray-800");
      tabSubdomainBtn.classList.remove("bg-indigo-600", "text-white");
      tabSubdomainBtn.classList.add("bg-gray-200", "text-gray-800");
      if (mobileTabMainBtn && mobileTabCarouselBtn && mobileTabSubdomainBtn) {
        mobileTabCarouselBtn.classList.add("bg-indigo-600", "text-white");
        mobileTabMainBtn.classList.remove("bg-indigo-600", "text-white");
        mobileTabMainBtn.classList.add("bg-gray-200", "text-gray-800");
        mobileTabSubdomainBtn.classList.remove("bg-indigo-600", "text-white");
        mobileTabSubdomainBtn.classList.add("bg-gray-200", "text-gray-800");
      }
    };
    const activateSubdomain = () => {
      tabMain.style.display = "none";
      tabCarousel.style.display = "none";
      tabSubdomain.style.display = "block";
      tabSubdomainBtn.classList.remove("bg-gray-200", "text-gray-800");
      tabSubdomainBtn.classList.add("bg-indigo-600", "text-white");
      tabMainBtn.classList.remove("bg-indigo-600", "text-white");
      tabMainBtn.classList.add("bg-gray-200", "text-gray-800");
      tabCarouselBtn.classList.remove("bg-indigo-600", "text-white");
      tabCarouselBtn.classList.add("bg-gray-200", "text-gray-800");
      if (mobileTabMainBtn && mobileTabCarouselBtn && mobileTabSubdomainBtn) {
        mobileTabSubdomainBtn.classList.add("bg-indigo-600", "text-white");
        mobileTabMainBtn.classList.remove("bg-indigo-600", "text-white");
        mobileTabMainBtn.classList.add("bg-gray-200", "text-gray-800");
        mobileTabCarouselBtn.classList.remove("bg-indigo-600", "text-white");
        mobileTabCarouselBtn.classList.add("bg-gray-200", "text-gray-800");
      }
    };

    tabMainBtn.addEventListener("click", function (e) {
      e.preventDefault();
      activateMain();
    });
    tabCarouselBtn.addEventListener("click", function (e) {
      e.preventDefault();
      activateCarousel();
    });
    tabSubdomainBtn.addEventListener("click", function (e) {
      e.preventDefault();
      activateSubdomain();
    });

    // Mobile buttons mirror behavior
    if (mobileTabMainBtn) {
      mobileTabMainBtn.addEventListener("click", function (e) {
        e.preventDefault();
        activateMain();
      });
    }
    if (mobileTabCarouselBtn) {
      mobileTabCarouselBtn.addEventListener("click", function (e) {
        e.preventDefault();
        activateCarousel();
      });
    }
    if (mobileTabSubdomainBtn) {
      mobileTabSubdomainBtn.addEventListener("click", function (e) {
        e.preventDefault();
        activateSubdomain();
      });
    }

    // Set initial state
    activateMain();
  }
  // Subdomain number -> URL generator
  const sdName = document.getElementById("sdName");
  const sdPhone = document.getElementById("sdPhone");
  const sdAddUpdateBtn = document.getElementById("sdAddUpdateBtn");
  const sdClearBtn = document.getElementById("sdClearBtn");
  const sdTableBody = document.getElementById("sdTableBody");
  const sdLookupName = document.getElementById("sdLookupName");
  const sdLookupBtn = document.getElementById("sdLookupBtn");
  const sdLookupPhone = document.getElementById("sdLookupPhone");
  const subdomainUrl = document.getElementById("subdomainUrl");
  const copySubdomainBtn = document.getElementById("copySubdomainBtn");

  function loadMappings() {
    try {
      return JSON.parse(localStorage.getItem("sdMappings") || "{}");
    } catch (e) {
      return {};
    }
  }
  function saveMappings(obj) {
    localStorage.setItem("sdMappings", JSON.stringify(obj));
  }
  function renderTable() {
    if (!sdTableBody) return;
    const data = loadMappings();
    sdTableBody.innerHTML = "";
    Object.keys(data).forEach((name) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="px-3 py-2">${name}</td>
        <td class="px-3 py-2">${data[name]}</td>
        <td class="px-3 py-2">
          <button data-edit="${name}" class="px-2 py-1 text-xs rounded bg-gray-200 text-gray-800">Edit</button>
          <button data-delete="${name}" class="ml-2 px-2 py-1 text-xs rounded bg-red-500 text-white">Delete</button>
        </td>
      `;
      sdTableBody.appendChild(tr);
    });
  }
  renderTable();

  if (sdAddUpdateBtn && sdName && sdPhone) {
    sdAddUpdateBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const name = (sdName.value || "").trim();
      const phone = (sdPhone.value || "").trim();
      if (!name || !phone) return;
      const data = loadMappings();
      data[name] = phone;
      saveMappings(data);
      renderTable();
      sdName.value = "";
      sdPhone.value = "";
    });
  }
  if (sdClearBtn && sdName && sdPhone) {
    sdClearBtn.addEventListener("click", function (e) {
      e.preventDefault();
      sdName.value = "";
      sdPhone.value = "";
    });
  }
  if (sdTableBody) {
    sdTableBody.addEventListener("click", function (e) {
      const target = e.target;
      if (target && target.getAttribute) {
        const editKey = target.getAttribute("data-edit");
        const deleteKey = target.getAttribute("data-delete");
        if (editKey) {
          const data = loadMappings();
          sdName.value = editKey;
          sdPhone.value = data[editKey] || "";
        }
        if (deleteKey) {
          const data = loadMappings();
          delete data[deleteKey];
          saveMappings(data);
          renderTable();
        }
      }
    });
  }
  if (sdLookupBtn && sdLookupName && sdLookupPhone && subdomainUrl) {
    sdLookupBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const name = (sdLookupName.value || "").trim();
      if (!name) return;
      const data = loadMappings();
      const phone = data[name] || "";
      sdLookupPhone.value = phone;
      subdomainUrl.value = name ? `https://${name}.firm777.com` : "";
    });
  }
  if (copySubdomainBtn && subdomainUrl) {
    copySubdomainBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (!subdomainUrl.value) return;
      navigator.clipboard.writeText(subdomainUrl.value);
      alert("Copied subdomain: " + subdomainUrl.value);
    });
  }

  if (carouselInput && carouselPreview) {
    carouselInput.addEventListener("change", function () {
      const files = Array.from(this.files || []);
      carouselPreview.innerHTML = "";
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.className = "w-full h-24 object-cover rounded border";
          carouselPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Per-slide edit/preview handlers
  const slide1EditBtn = document.getElementById("slide1EditBtn");
  const slide1Input = document.getElementById("slide1Input");
  const slide1Preview = document.getElementById("slide1Preview");
  const slide2EditBtn = document.getElementById("slide2EditBtn");
  const slide2Input = document.getElementById("slide2Input");
  const slide2Preview = document.getElementById("slide2Preview");

  if (slide1EditBtn && slide1Input && slide1Preview) {
    slide1EditBtn.addEventListener("click", function (e) {
      e.preventDefault();
      slide1Input.click();
    });
    slide1Input.addEventListener("change", function () {
      const file = this.files && this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        slide1Preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  if (slide2EditBtn && slide2Input && slide2Preview) {
    slide2EditBtn.addEventListener("click", function (e) {
      e.preventDefault();
      slide2Input.click();
    });
    slide2Input.addEventListener("change", function () {
      const file = this.files && this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        slide2Preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Dynamic Add Slide (delegated handlers)
  const addSlideBtn = document.getElementById("addSlideBtn");
  const dynamicSlides = document.getElementById("dynamicSlides");

  function createSlideCard(slideIndex) {
    const card = document.createElement("div");
    card.className = "border rounded p-3";
    const editId = `dynSlide${slideIndex}EditBtn`;
    const uploadId = `dynSlide${slideIndex}UploadBtn`;
    const inputId = `dynSlide${slideIndex}Input`;
    const imgId = `dynSlide${slideIndex}Preview`;
    card.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-medium">Slide ${slideIndex}</h3>
        <div class="flex gap-2">
          <button id="${uploadId}" class="px-2 py-1 text-xs rounded bg-indigo-600 text-white">Upload</button>
          <button id="${editId}" class="px-2 py-1 text-xs rounded bg-gray-200 text-gray-800">Edit</button>
          <button data-remove="true" class="px-2 py-1 text-xs rounded bg-red-500 text-white">Remove</button>
        </div>
      </div>
      <img id="${imgId}" src="./slide1.webp" alt="Slide ${slideIndex}" class="w-full h-40 object-cover rounded border" />
      <input type="file" id="${inputId}" accept="image/*" class="mt-2 text-sm" style="display:none" />
    `;
    return { card, editId, uploadId, inputId, imgId };
  }

  if (addSlideBtn && dynamicSlides) {
    addSlideBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const slideIndex = dynamicSlides.children.length + 1; // start at 1 by default
      const { card, editId, uploadId, inputId, imgId } = createSlideCard(slideIndex);
      dynamicSlides.appendChild(card);

      const editBtn = document.getElementById(editId);
      const uploadBtn = document.getElementById(uploadId);
      const fileInput = document.getElementById(inputId);
      const img = document.getElementById(imgId);

      // auto-open on add
      fileInput.click();

      uploadBtn.addEventListener("click", function (e) {
        e.preventDefault();
        fileInput.click();
      });
      editBtn.addEventListener("click", function (e) {
        e.preventDefault();
        fileInput.click();
      });
      fileInput.addEventListener("change", function () {
        const file = this.files && this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });

      // remove slide
      const removeBtn = card.querySelector('[data-remove="true"]');
      removeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        dynamicSlides.removeChild(card);
      });
    });
  }
});