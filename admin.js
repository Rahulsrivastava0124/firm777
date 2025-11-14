// var fs = require("fs");

var userData = {};
var users = JSON.parse(localStorage.getItem("users") || "[]");
var editingUserId = null;

// User Management Functions
function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function addUser(name, phone, domain, profileImage, promoCode = "") {
  const user = {
    id: Date.now().toString(),
    name: name,
    phone: phone,
    domain: domain,
    profileImage: profileImage,
    promoCode: promoCode,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  saveUsers();
  renderUsersTable();
  return user;
}

function updateUser(id, name, phone, domain, profileImage, promoCode = "") {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      name: name,
      phone: phone,
      domain: domain,
      profileImage: profileImage,
      promoCode: promoCode,
      updatedAt: new Date().toISOString()
    };
    saveUsers();
    renderUsersTable();
    return users[userIndex];
  }
  return null;
}

function deleteUser(id) {
  users = users.filter(user => user.id !== id);
  saveUsers();
  renderUsersTable();
}

function renderUsersTable() {
  const tableBody = document.getElementById("myTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";
  
  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="px-4 py-2">
        <img src="${user.profileImage || 'https://via.placeholder.com/40x40?text=No+Image'}" 
             alt="Profile" class="w-10 h-10 rounded-full object-cover">
      </td>
      <td class="px-4 py-2 font-medium text-gray-900">${user.name}</td>
      <td class="px-4 py-2 text-gray-600">${user.phone}</td>
      <td class="px-4 py-2 text-gray-600">${user.domain}</td>
      <td class="px-4 py-2 text-gray-600">${user.promoCode}</td>
      <td class="px-4 py-2">
        <button onclick="editUser('${user.id}')" class="px-2 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700 mr-1">Edit</button>
        <button onclick="deleteUser('${user.id}')" class="px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function editUser(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;

  editingUserId = id;
  document.getElementById("userPhone").value = user.phone;
  document.getElementById("userDomain").value = user.domain;
  document.getElementById("profileImagePreview").src = user.profileImage || 'https://via.placeholder.com/100x100?text=No+Image';
  
  document.getElementById("addUserBtn").style.display = "none";
  document.getElementById("updateUserBtn").style.display = "inline-block";
}

function clearUserForm() {
  editingUserId = null;
  document.getElementById("userPhone").value = "";
  document.getElementById("userDomain").value = "";
  document.getElementById("profileImagePreview").src = 'https://via.placeholder.com/100x100?text=No+Image';
  document.getElementById("profileImageInput").value = "";
  
  document.getElementById("addUserBtn").style.display = "inline-block";
  document.getElementById("updateUserBtn").style.display = "none";
}

// Load previously uploaded images from localStorage
function loadUploadedImages() {
  const uploadedImages = JSON.parse(
    localStorage.getItem("uploadedImages") || "[]"
  );
  console.log("Loaded uploaded images:", uploadedImages);
  return uploadedImages;
}

// Clear uploaded images from localStorage
function clearUploadedImages() {
  localStorage.removeItem("uploadedImages");
  console.log("Cleared uploaded images");
}

// Fetch all images from server
function fetchAllImages() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch("https://api.playbucks7official.com/api/images", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      console.log("Fetched images from server:", result);

      if (result.success && result.data) {
        // Sync server data with localStorage
        const serverImages = result.data.map((img) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          uploadDate: img.upload_date,
          slideIndex: "server", // Mark as server image
        }));

        // Store server images in localStorage
        localStorage.setItem("serverImages", JSON.stringify(serverImages));

        return serverImages;
      }
      return [];
    })
    .catch((error) => {
      console.error("Error fetching images:", error);
      return [];
    });
}

// Display server images in the carousel
function displayServerImages(images) {
  const dynamicSlides = document.getElementById("dynamicSlides");
  if (!dynamicSlides || !images.length) return;

  // Clear existing slides first
  dynamicSlides.innerHTML = "";

  images.forEach((img, index) => {
    const slideIndex = index + 1;
    const card = document.createElement("div");
    card.className = "border rounded p-3 bg-blue-50";

    card.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-medium">Image ${slideIndex}</h3>
        <div class="flex gap-2">
          <button data-edit="${img.id}" class="px-2 py-1 text-xs rounded bg-indigo-600 text-white">Edit</button>
          <button data-delete="${img.id}" class="px-2 py-1 text-xs rounded bg-red-500 text-white">Delete</button>
        </div>
      </div>
      <img src="${img.imageUrl}" alt="Image ${slideIndex}" class="w-full h-40 object-cover rounded border" />
    `;

    dynamicSlides.appendChild(card);
  });
}

// Handle edit image
function handleEditImage(imageId) {
  // Create a file input for editing
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".png,.gif";

  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      updateImage(imageId, file);
    }
  });

  fileInput.click();
}

// Update image function
function updateImage(imageId, file) {
  const formdata = new FormData();
  formdata.append("image", file, file.name);

  const requestOptions = {
    method: "PUT",
    body: formdata,
    redirect: "follow",
  };

  console.log("Updating image:", imageId, "with file:", file.name);

  // Find and update the edit button to show loading state
  const editButton = document.querySelector(`[data-edit="${imageId}"]`);
  if (editButton) {
    editButton.textContent = "Updating...";
    editButton.disabled = true;
    editButton.classList.remove("bg-indigo-600");
    editButton.classList.add("bg-gray-400");
  }

  fetch(`https://api.playbucks7official.com/api/images/${imageId}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      console.log("Update successful:", result);

      // Reset button state
      if (editButton) {
        editButton.textContent = "Edit";
        editButton.disabled = false;
        editButton.classList.remove("bg-gray-400");
        editButton.classList.add("bg-indigo-600");
      }

      // Refresh the server images display after successful update
      fetchAllImages().then((images) => {
        if (images.length > 0) {
          displayServerImages(images);
        } else {
          document.getElementById("dynamicSlides").innerHTML =
            "<p class='text-gray-500 text-center'>No images found on server.</p>";
        }
      });
    })
    .catch((error) => {
      console.error("Update error:", error);
      alert(`Failed to update image: ${error.message}`);

      // Reset button state on error
      if (editButton) {
        editButton.textContent = "Edit";
        editButton.disabled = false;
        editButton.classList.remove("bg-gray-400");
        editButton.classList.add("bg-indigo-600");
      }
    });
}

// Handle delete image
function handleDeleteImage(imageId) {
  if (confirm(`Are you sure you want to delete image ${imageId}?`)) {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    // Show loading state (you could add a loading indicator here)
    console.log("Deleting image:", imageId);

    fetch(`https://api.playbucks7official.com/api/images/${imageId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((result) => {
        console.log("Delete successful:", result);

        // Refresh the server images display after successful deletion
        fetchAllImages().then((images) => {
          if (images.length > 0) {
            displayServerImages(images);
          } else {
            document.getElementById("dynamicSlides").innerHTML =
              "<p class='text-gray-500 text-center'>No images found on server.</p>";
          }
        });
      })
      .catch((error) => {
        console.error("Delete error:", error);
        alert(`Failed to delete image: ${error.message}`);
      });
  }
}

// Image upload function
function uploadImage(file, slideIndex) {
  if (!file) {
    console.error("No file selected");
    return;
  }

  const formdata = new FormData();
  formdata.append("image", file, file.name);

  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  // Show loading state
  const uploadBtn = document.getElementById(`dynSlide${slideIndex}UploadBtn`);
  if (uploadBtn) {
    uploadBtn.textContent = "Uploading...";
    uploadBtn.disabled = true;
  }

  fetch("https://api.playbucks7official.com/api/upload-image", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Changed from .text() to .json()
    })
    .then((result) => {
      console.log("Upload successful:", result);

      // Store the uploaded image data
      if (result.success && result.data) {
        const imageData = {
          id: result.data.id,
          imageUrl: result.data.imageUrl,
          uploadDate: result.data.uploadDate,
          slideIndex: slideIndex,
        };

        // Save to localStorage for persistence
        let uploadedImages = JSON.parse(
          localStorage.getItem("uploadedImages") || "[]"
        );
        uploadedImages.push(imageData);
        localStorage.setItem("uploadedImages", JSON.stringify(uploadedImages));

        alert(
          `Image uploaded successfully for Slide ${slideIndex}!\nURL: ${result.data.imageUrl}`
        );
      } else {
        alert(`Image uploaded successfully for Slide ${slideIndex}`);
      }

      // Reset button state
      if (uploadBtn) {
        uploadBtn.textContent = "Upload";
        uploadBtn.disabled = false;
      }
    })
    .catch((error) => {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);

      // Reset button state
      if (uploadBtn) {
        uploadBtn.textContent = "Upload";
        uploadBtn.disabled = false;
      }
    });
}

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
      alert("Change number is :-- ", result.data.Phone);
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

  if (
    tabMainBtn &&
    tabCarouselBtn &&
    tabSubdomainBtn &&
    tabMain &&
    tabCarousel &&
    tabSubdomain
  ) {
    // Mobile nav buttons (topbar)
    const mobileTabMainBtn = document.getElementById("mobileTabMainBtn");
    const mobileTabCarouselBtn = document.getElementById(
      "mobileTabCarouselBtn"
    );
    const mobileTabSubdomainBtn = document.getElementById(
      "mobileTabSubdomainBtn"
    );

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

      // Load and render all data into home view table (read-only)
      fetchSubdomains().then((subdomains) => {
        const tableBody = document.getElementById("myTable");
        if (!tableBody) return;
        tableBody.innerHTML = "";
        (subdomains || []).forEach((sub) => {
          const tr = document.createElement("tr");
          const imgUrl = sub.profile_img || "https://via.placeholder.com/40x40?text=IMG";
          const domainStr = sub.subdomain_name ? `${sub.subdomain_name}.firm777.com` : "";
          tr.innerHTML = `
            <td class="px-4 py-2">
              <img src="${imgUrl}" alt="Profile" class="w-10 h-10 rounded-full object-cover" />
            </td>
            <td class="px-4 py-2 font-medium text-gray-900">${sub.subdomain_name || ""}</td>
            <td class="px-4 py-2 text-gray-600">${sub.phone_number || ""}</td>
            <td class="px-4 py-2 text-gray-600">${domainStr}</td>
            <td class="px-4 py-2 text-gray-600"></td>
            <td class="px-4 py-2"></td>
          `;
          tableBody.appendChild(tr);
        });
      }).catch(() => {
        // best-effort: leave table empty on error
      });
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

      // Auto-load server images when carousel tab is activated
      fetchAllImages().then((images) => {
        if (images.length > 0) {
          displayServerImages(images);
        }
      });
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

      // Auto-load subdomains when subdomain tab is activated
      fetchSubdomains()
        .then((subdomains) => {
          if (subdomains.length > 0) {
            renderTable(subdomains);
          } else {
            renderTable(); // Fallback to localStorage
          }
        })
        .catch(() => {
          renderTable(); // Fallback to localStorage on error
        });
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
  const sdAddBtn = document.getElementById("sdAddBtn");
  const sdUpdateBtn = document.getElementById("sdUpdateBtn");
  const sdClearBtn = document.getElementById("sdClearBtn");
  const sdProfile = document.getElementById("sdProfile");
  const sdProfilePreview = document.getElementById("sdProfilePreview");
  const sdThumbnail = document.getElementById("sdThumbnail");
  const sdThumbnailPreview = document.getElementById("sdThumbnailPreview");
  const sdProfileName = document.getElementById("sdProfileName");
  const sdThumbnailName = document.getElementById("sdThumbnailName");
  const sdSubmitPhoneBtn = document.getElementById("sdSubmitPhoneBtn");
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

  // Helper functions for button state management
  function setAddMode() {
    sdAddBtn.style.display = "inline-block";
    sdUpdateBtn.style.display = "none";
    sdAddBtn.textContent = "Add New";
    sdUpdateBtn.removeAttribute("data-editing-id");
    if (sdProfileName) sdProfileName.textContent = "No file chosen";
    if (sdThumbnailName) sdThumbnailName.textContent = "No file chosen";
  }

  function setEditMode(subdomainId, subdomainName, phoneNumber, profileImgUrl, thumbnailUrl) {
    sdAddBtn.style.display = "none";
    sdUpdateBtn.style.display = "inline-block";
    sdUpdateBtn.textContent = "Update";
    sdUpdateBtn.setAttribute("data-editing-id", subdomainId);
    sdName.value = subdomainName;
    sdPhone.value = phoneNumber;
    if (sdProfilePreview) {
      sdProfilePreview.src = profileImgUrl || "https://via.placeholder.com/64x64?text=IMG";
    }
    if (sdThumbnailPreview) {
      sdThumbnailPreview.src = thumbnailUrl || "https://via.placeholder.com/64x64?text=TH";
    }
    if (sdProfile) {
      sdProfile.value = "";
    }
    if (sdThumbnail) {
      sdThumbnail.value = "";
    }
    if (sdProfileName) sdProfileName.textContent = "No file chosen";
    if (sdThumbnailName) sdThumbnailName.textContent = "No file chosen";
  }

  // Subdomain API functions
  function fetchSubdomains() {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    return fetch("https://api.playbucks7official.com/api/subdomains", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log("Fetched subdomains:", result);
        return result.data || [];
      })
      .catch((error) => {
        console.error("Error fetching subdomains:", error);
        return [];
      });
  }

  function createSubdomain(subdomainName, phoneNumber, profileFile, thumbnailFile) {
    const formData = new FormData();
    formData.append("subdomain_name", subdomainName);
    formData.append("phone_number", phoneNumber);
    if (profileFile) {
      formData.append("profile_img", profileFile);
    }
    if (thumbnailFile) {
      formData.append("profile_thumbnail", thumbnailFile);
    }

    const requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };

    return fetch("https://api.playbucks7official.com/api/subdomains", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log("Subdomain created:", result);
        return result;
      })
      .catch((error) => {
        console.error("Error creating subdomain:", error);
        throw error;
      });
  }

  function updateSubdomain(subdomainId, subdomainName, phoneNumber, profileFile, thumbnailFile) {
    const formData = new FormData();
    formData.append("subdomain_name", subdomainName);
    formData.append("phone_number", phoneNumber);
    if (profileFile) {
      formData.append("profile_img", profileFile);
    }
    if (thumbnailFile) {
      formData.append("profile_thumbnail", thumbnailFile);
    }

    const requestOptions = {
      method: "PUT",
      body: formData,
      redirect: "follow",
    };

    return fetch(
      `https://api.playbucks7official.com/api/subdomains/${subdomainId}`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log("Subdomain updated:", result);
        return result;
      })
      .catch((error) => {
        console.error("Error updating subdomain:", error);
        throw error;
      });
  }

  function deleteSubdomain(subdomainId) {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    return fetch(
      `https://api.playbucks7official.com/api/subdomains/${subdomainId}`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((result) => {
        console.log("Subdomain deleted:", result);
        return result;
      })
      .catch((error) => {
        console.error("Error deleting subdomain:", error);
        throw error;
      });
  }

  function submitPhoneToSubdomain(subdomainId, phoneNumber) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      phone_number: phoneNumber,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return fetch(
      `https://api.playbucks7official.com/api/subdomains/${subdomainId}`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log("Phone submitted to subdomain:", result);
        return result;
      })
      .catch((error) => {
        console.error("Error submitting phone to subdomain:", error);
        throw error;
      });
  }
  function renderTable(subdomains = null) {
    if (!sdTableBody) return;

    if (subdomains) {
      // Render server data
      sdTableBody.innerHTML = "";
      subdomains.forEach((subdomain) => {
        const tr = document.createElement("tr");
        const imgUrl = subdomain.profile_img || "https://via.placeholder.com/40x40?text=IMG";
        const thumbUrl = subdomain.profile_thumbnail || "https://via.placeholder.com/40x40?text=TH";
        tr.innerHTML = `
          <td class=\"px-3 py-2\">
            <img src=\"${imgUrl}\" alt=\"Profile\" class=\"w-10 h-10 rounded-full object-cover border\" />
          </td>
          <td class=\"px-3 py-2\">
            <img src=\"${thumbUrl}\" alt=\"Thumbnail\" class=\"w-16 h-16 rounded object-cover border\" />
          </td>
          <td class=\"px-3 py-2\">${subdomain.subdomain_name}</td>
          <td class=\"px-3 py-2\">${subdomain.phone_number}</td>
          <td class=\"px-3 py-2\">
            <button data-edit-id=\"${subdomain._id || subdomain.id}\" data-edit-name=\"${subdomain.subdomain_name}\" data-edit-phone=\"${subdomain.phone_number}\" data-edit-img=\"${imgUrl}\" data-edit-thumb=\"${thumbUrl}\" class=\"px-2 py-1 text-xs rounded bg-gray-200 text-gray-800\">Edit</button>
            <button data-delete-id=\"${subdomain._id || subdomain.id}\" class=\"ml-2 px-2 py-1 text-xs rounded bg-red-500 text-white\">Delete</button>
          </td>
        `;
        sdTableBody.appendChild(tr);
      });
    } else {
      // Fallback to localStorage data
      const data = loadMappings();
      sdTableBody.innerHTML = "";
      Object.keys(data).forEach((name) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="px-3 py-2">
            <img src="https://via.placeholder.com/40x40?text=IMG" alt="Profile" class="w-10 h-10 rounded-full object-cover border" />
          </td>
          <td class="px-3 py-2">
            <img src="https://via.placeholder.com/64x64?text=TH" alt="Thumbnail" class="w-16 h-16 rounded object-cover border" />
          </td>
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
  }

  // Add button event listener
  if (sdProfile) {
    sdProfile.addEventListener("change", function (e) {
      const file = e.target.files && e.target.files[0];
      if (!file) {
        if (sdProfileName) sdProfileName.textContent = "No file chosen";
        return;
      }
      const validTypes = ["image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a PNG or GIF image file.");
        sdProfile.value = "";
        if (sdProfileName) sdProfileName.textContent = "No file chosen";
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        alert("File size must be less than 50MB.");
        sdProfile.value = "";
        if (sdProfileName) sdProfileName.textContent = "No file chosen";
        return;
      }
      if (sdProfileName) sdProfileName.textContent = file.name;
      if (sdProfilePreview) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          sdProfilePreview.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Thumbnail change handler (PNG/GIF)
  if (sdThumbnail) {
    sdThumbnail.addEventListener("change", function (e) {
      const file = e.target.files && e.target.files[0];
      if (!file) {
        if (sdThumbnailName) sdThumbnailName.textContent = "No file chosen";
        return;
      }
      const validTypes = ["image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a PNG or GIF image file for thumbnail.");
        sdThumbnail.value = "";
        if (sdThumbnailName) sdThumbnailName.textContent = "No file chosen";
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        alert("Thumbnail size must be less than 50MB.");
        sdThumbnail.value = "";
        if (sdThumbnailName) sdThumbnailName.textContent = "No file chosen";
        return;
      }
      if (sdThumbnailName) sdThumbnailName.textContent = file.name;
      if (sdThumbnailPreview) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          sdThumbnailPreview.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (sdAddBtn && sdName && sdPhone) {
    sdAddBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const name = (sdName.value || "").trim();
      const phone = (sdPhone.value || "").trim();
      const profileFile = sdProfile && sdProfile.files && sdProfile.files[0] ? sdProfile.files[0] : null;
      const thumbnailFile = sdThumbnail && sdThumbnail.files && sdThumbnail.files[0] ? sdThumbnail.files[0] : null;
      
      if (!name || !phone) {
        alert("Please enter both subdomain name and phone number");
        return;
      }

      // Show loading state
      const originalText = sdAddBtn.textContent;
      sdAddBtn.textContent = "Creating...";
      sdAddBtn.disabled = true;

      createSubdomain(name, phone, profileFile, thumbnailFile)
        .then((result) => {
          console.log("Subdomain created successfully:", result);
          alert(`Subdomain ${name} created successfully with phone ${phone}`);
          
          // Refresh the table from server
          return fetchSubdomains();
        })
        .then((subdomains) => {
          renderTable(subdomains);
          sdName.value = "";
          sdPhone.value = "";
          if (sdProfile) sdProfile.value = "";
          if (sdProfilePreview) sdProfilePreview.src = "https://via.placeholder.com/64x64?text=IMG";
          if (sdThumbnail) sdThumbnail.value = "";
          if (sdThumbnailPreview) sdThumbnailPreview.src = "https://via.placeholder.com/64x64?text=TH";
          setAddMode(); // Reset to add mode
        })
        .catch((error) => {
          console.error("Subdomain creation failed:", error);
          alert(`Failed to create subdomain: ${error.message}`);
        })
        .finally(() => {
          // Reset button state
          sdAddBtn.textContent = originalText;
          sdAddBtn.disabled = false;
        });
    });
  }

  // Update button event listener
  if (sdUpdateBtn && sdName && sdPhone) {
    sdUpdateBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const name = (sdName.value || "").trim();
      const phone = (sdPhone.value || "").trim();
      const editingId = sdUpdateBtn.getAttribute("data-editing-id");
      const profileFile = sdProfile && sdProfile.files && sdProfile.files[0] ? sdProfile.files[0] : null;
      const thumbnailFile = sdThumbnail && sdThumbnail.files && sdThumbnail.files[0] ? sdThumbnail.files[0] : null;
      
      if (!name || !phone || !editingId) {
        alert("Please enter both subdomain name and phone number");
        return;
      }

      // Show loading state
      const originalText = sdUpdateBtn.textContent;
      sdUpdateBtn.textContent = "Updating...";
      sdUpdateBtn.disabled = true;

      updateSubdomain(editingId, name, phone, profileFile, thumbnailFile)
        .then((result) => {
          console.log("Subdomain updated successfully:", result);
          alert(`Subdomain ${name} updated successfully with phone ${phone}`);
          
          // Refresh the table from server
          return fetchSubdomains();
        })
        .then((subdomains) => {
          renderTable(subdomains);
          sdName.value = "";
          sdPhone.value = "";
          if (sdProfile) sdProfile.value = "";
          if (sdProfilePreview) sdProfilePreview.src = "https://via.placeholder.com/64x64?text=IMG";
          if (sdThumbnail) sdThumbnail.value = "";
          if (sdThumbnailPreview) sdThumbnailPreview.src = "https://via.placeholder.com/64x64?text=TH";
          setAddMode(); // Reset to add mode
        })
        .catch((error) => {
          console.error("Subdomain update failed:", error);
          alert(`Failed to update subdomain: ${error.message}`);
        })
        .finally(() => {
          // Reset button state
          sdUpdateBtn.textContent = originalText;
          sdUpdateBtn.disabled = false;
        });
    });
  }
  if (sdClearBtn && sdName && sdPhone) {
    sdClearBtn.addEventListener("click", function (e) {
      e.preventDefault();
      sdName.value = "";
      sdPhone.value = "";
      if (sdProfile) sdProfile.value = "";
      if (sdProfilePreview) sdProfilePreview.src = "https://via.placeholder.com/64x64?text=IMG";
      if (sdThumbnail) sdThumbnail.value = "";
      if (sdThumbnailPreview) sdThumbnailPreview.src = "https://via.placeholder.com/64x64?text=TH";
      setAddMode(); // Reset to add mode when clearing
    });
  }

  if (sdSubmitPhoneBtn && sdName && sdPhone) {
    sdSubmitPhoneBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const name = (sdName.value || "").trim();
      const phone = (sdPhone.value || "").trim();

      if (!name || !phone) {
        alert("Please enter both subdomain name and phone number");
        return;
      }

      // Show loading state
      const originalText = sdSubmitPhoneBtn.textContent;
      sdSubmitPhoneBtn.textContent = "Submitting...";
      sdSubmitPhoneBtn.disabled = true;

      // First, try to find the subdomain by name
      fetchSubdomains()
        .then((subdomains) => {
          const foundSubdomain = subdomains.find(
            (sub) => sub.subdomain_name === name
          );
          if (foundSubdomain) {
            // Submit phone to existing subdomain
            return submitPhoneToSubdomain(foundSubdomain._id, phone);
          } else {
            // If subdomain doesn't exist, create it first
            return createSubdomain(name, phone);
          }
        })
        .then((result) => {
          console.log("Phone submission successful:", result);
          alert(
            `Phone number ${phone} successfully submitted to subdomain ${name}`
          );

          // Refresh the table
          return fetchSubdomains();
        })
        .then((subdomains) => {
          renderTable(subdomains);
          sdName.value = "";
          sdPhone.value = "";
        })
        .catch((error) => {
          console.error("Phone submission failed:", error);
          alert(`Failed to submit phone: ${error.message}`);
        })
        .finally(() => {
          // Reset button state
          sdSubmitPhoneBtn.textContent = originalText;
          sdSubmitPhoneBtn.disabled = false;
        });
    });
  }
  if (sdTableBody) {
    sdTableBody.addEventListener("click", function (e) {
      const target = e.target;
      if (target && target.getAttribute) {
        // Handle server data edit
        const editId = target.getAttribute("data-edit-id");
        const editName = target.getAttribute("data-edit-name");
        const editPhone = target.getAttribute("data-edit-phone");
        const editImg = target.getAttribute("data-edit-img");
        const editThumb = target.getAttribute("data-edit-thumb");

        // Handle server data delete
        const deleteId = target.getAttribute("data-delete-id");

        // Handle localStorage data (fallback)
        const editKey = target.getAttribute("data-edit");
        const deleteKey = target.getAttribute("data-delete");

        if (editId && editName && editPhone) {
          // Edit server data
          setEditMode(editId, editName, editPhone, editImg, editThumb);
        } else if (editKey) {
          // Edit localStorage data (fallback)
          const data = loadMappings();
          setEditMode(editKey, editKey, data[editKey] || "", null, null);
        }

        if (deleteId) {
          // Delete server data using DELETE API
          if (confirm(`Are you sure you want to delete this subdomain?`)) {
            deleteSubdomain(deleteId)
              .then(() => {
                // Refresh the table from server after successful deletion
                return fetchSubdomains();
              })
              .then((subdomains) => {
                renderTable(subdomains);
              })
              .catch((error) => {
                console.error("Delete failed:", error);
                alert(`Failed to delete subdomain: ${error.message}`);
              });
          }
        } else if (deleteKey) {
          // Delete localStorage data (fallback)
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

      // Try to find in server data first
      fetchSubdomains()
        .then((subdomains) => {
          const foundSubdomain = subdomains.find(
            (sub) => sub.subdomain_name === name
          );
          if (foundSubdomain) {
            sdLookupPhone.value = foundSubdomain.phone_number;
            subdomainUrl.value = `https://${name}.firm777.com`;
          } else {
            // Fallback to localStorage
            const data = loadMappings();
            const phone = data[name] || "";
            sdLookupPhone.value = phone;
            subdomainUrl.value = name ? `https://${name}.firm777.com` : "";
          }
        })
        .catch(() => {
          // Fallback to localStorage on error
          const data = loadMappings();
          const phone = data[name] || "";
          sdLookupPhone.value = phone;
          subdomainUrl.value = name ? `https://${name}.firm777.com` : "";
        });
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

      // Show preview first
      const reader = new FileReader();
      reader.onload = function (e) {
        slide1Preview.src = e.target.result;
      };
      reader.readAsDataURL(file);

      // Upload the file to server
      uploadImage(file, 1);
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
      <input type="file" id="${inputId}" accept=".png,.gif" class="mt-2 text-sm" style="display:none" />
    `;
    return { card, editId, uploadId, inputId, imgId };
  }

  if (addSlideBtn && dynamicSlides) {
    addSlideBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const slideIndex = dynamicSlides.children.length + 1; // start at 1 by default
      const { card, editId, uploadId, inputId, imgId } =
        createSlideCard(slideIndex);
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

        // Show preview first
        const reader = new FileReader();
        reader.onload = function (e) {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Upload the file to server
        uploadImage(file, slideIndex);
      });

      // remove slide
      const removeBtn = card.querySelector('[data-remove="true"]');
      removeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        dynamicSlides.removeChild(card);
      });
    });
  }

  // Event delegation for edit and delete buttons
  if (dynamicSlides) {
    dynamicSlides.addEventListener("click", function (e) {
      if (e.target && e.target.getAttribute) {
        const editId = e.target.getAttribute("data-edit");
        const deleteId = e.target.getAttribute("data-delete");

        if (editId) {
          handleEditImage(editId);
        }

        if (deleteId) {
          handleDeleteImage(deleteId);
        }
      }
    });
  }

  // Load uploaded images on page load
  loadUploadedImages();

  // Initial render of subdomain table (will show localStorage data initially)
  renderTable();
  
  // Initialize button states
  setAddMode();

  // User Management Event Listeners
  const profileImageInput = document.getElementById("profileImageInput");
  const profileImagePreview = document.getElementById("profileImagePreview");
  const uploadProfileBtn = document.getElementById("uploadProfileBtn");
  const addUserBtn = document.getElementById("addUserBtn");
  const updateUserBtn = document.getElementById("updateUserBtn");
  const clearUserBtn = document.getElementById("clearUserBtn");
  const userPhone = document.getElementById("userPhone");
  const userDomain = document.getElementById("userDomain");

  let currentProfileImage = null;

  // Profile image upload handling
  if (profileImageInput && profileImagePreview) {
    profileImageInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        const validTypes = ['image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          alert("Please select a PNG or GIF image file.");
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("File size must be less than 5MB.");
          return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
          profileImagePreview.src = e.target.result;
          currentProfileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (uploadProfileBtn && profileImageInput) {
    uploadProfileBtn.addEventListener("click", function(e) {
      e.preventDefault();
      profileImageInput.click();
    });
  }

  // Add user functionality
  if (addUserBtn) {
    addUserBtn.addEventListener("click", function(e) {
      e.preventDefault();
      const phone = userPhone.value.trim();
      const domain = userDomain.value.trim();
      
      if (!phone || !domain) {
        alert("Please fill in both phone number and domain.");
        return;
      }

      // Generate a simple name from domain
      const name = domain.split('.')[0] || "User";
      
      addUser(name, phone, domain, currentProfileImage || 'https://via.placeholder.com/100x100?text=No+Image');
      clearUserForm();
      currentProfileImage = null;
    });
  }

  // Update user functionality
  if (updateUserBtn) {
    updateUserBtn.addEventListener("click", function(e) {
      e.preventDefault();
      const phone = userPhone.value.trim();
      const domain = userDomain.value.trim();
      
      if (!phone || !domain) {
        alert("Please fill in both phone number and domain.");
        return;
      }

      if (!editingUserId) {
        alert("No user selected for editing.");
        return;
      }

      const user = users.find(u => u.id === editingUserId);
      if (user) {
        updateUser(editingUserId, user.name, phone, domain, currentProfileImage || user.profileImage, user.promoCode);
        clearUserForm();
        currentProfileImage = null;
      }
    });
  }

  // Clear form functionality
  if (clearUserBtn) {
    clearUserBtn.addEventListener("click", function(e) {
      e.preventDefault();
      clearUserForm();
      currentProfileImage = null;
    });
  }

  // Initial render of users table
  renderUsersTable();
});
