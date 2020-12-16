const getUsersForm = document.querySelector(".get-users-form");
const getUsersOutput = document.querySelector(".users-output");

getUsersForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearUsers();
  setLoading(true);
  getUsers(
    this.elements.usersAmount.value,
    this.elements.genderCombobox.value,
    this.elements.nationalityCombobox.value
  );
});

function setLoading(condition) {
  const loader = document.querySelector(".loader");

  if (condition) {
    loader.classList.add("loader--active");
  } else {
    loader.classList.remove("loader--active");
  }
}

function getUsers(amount, gender, nationality) {
  const url = `https://randomuser.me/api/?results=${amount}&nat=${
    nationality === "all" ? "" : nationality
  }&gender=${gender === "both" ? "male,female" : gender}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => renderUsers(data.results))
    .catch((err) => {
      setLoading(false);
      getUsersOutput.innerHTML = `
            <div class="users-output__error">
                Opss, something went wrong...<br>
                Failed to fetch
            </div>
        `;
    });
}

const clearUsers = () => {
  getUsersOutput.innerHTML = "";
};

const renderUsers = (data) => {
  data.forEach((item) => {
    const {
      name: { first: firstName, last: lastName },
      dob: { age },
      email,
      phone,
      location: {
        city,
        country,
        postcode,
        street: { number: streetNumber, name: streetName },
      },
      picture: { large: userImage },
    } = item;

    getUsersOutput.innerHTML += `<div class="user">
                <img src="${userImage}" alt="user__image" class="user__image">
                <div class="user__col">
                    <div>
                        ${firstName} ${lastName}, ${age}</br>
                        ${phone}</br>
                        ${email}
                    </div>
                    <hr class="user__horizontal-line">
                    <address class="user__address">
                        ${streetName} ${streetNumber}</br>
                        ${postcode} ${city}</br>
                        ${country}
                    </address>
                </div>
            </div>`;
  });
  setLoading(false);
};
