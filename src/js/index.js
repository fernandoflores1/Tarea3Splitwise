function displayPage(pageID) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(pageID).classList.add('active');
}

class User {
  name;
  genre;
  icon;
  paid;
  owed;

  constructor(name, genre, icon) {
    this.name = name;
    this.genre = genre;
    this.icon = icon;
    this.paid = 0;
    this.owed = 0;
  }
}

class Payment{
  user;
  title;
  amount;
  date;

  constructor(user, title, amount, date){
    this.user = user;
    this.title = title;
    this.amount = amount;
    this.date = date;
  }
}

let divUsers = document.querySelector("#userList");
let usersArray = [];
const regexUsername = /^[A-Za-z]+\s*$/
const regexAmount = /^(0?\.\d+|[1-9]\d*(\.\d+)?)$/

document.getElementById('myForm').addEventListener('submit', function (event) {
  event.preventDefault();

  let genre = document.querySelector('input[name="genre"]:checked').value;
  let name = document.getElementById('name').value;
  let icon = document.querySelector('input[name="icon"]:checked').value;

  if (name === "") {
    alert("Fill the empty fields");
  } else {
    let repetido = false;
    usersArray.forEach(user => {
      if (user.name == name && user.genre == genre) {
        repetido = true;
      }
    });
    if (repetido) {
      alert("You cant create the same user")
    } else {
      let validate = regexUsername.test(name);
      if (validate) {
        let user = new User(name, genre, icon);
        usersArray.push(user);
        addUserToList();
        document.getElementById('name').value = "";
      } else {
        alert("Username is invalid");
      }
    }
  }
});

function addUserToList() {
  divUsers.innerHTML = "";

  usersArray.forEach((user, index) => {
    let userDivList = document.createElement("div");
    userDivList.classList.add("userDivList");

    let userNameElement = document.createElement("p");
    userNameElement.textContent = user.name;

    let deleteButtonUser = document.createElement("button");
    deleteButtonUser.textContent = "X";

    deleteButtonUser.addEventListener("click", function () {
      usersArray.splice(index, 1);
      addUserToList();
      updatePaymentsDisplay();
    });

    let userImgElement = document.createElement("img");
    switch (user.icon) {
      case "broly":
        userImgElement.setAttribute("src", "./src/images/broly.png");
        break;
      case "gogeta":
        userImgElement.setAttribute("src", "./src/images/gogeta.png");
        break;
      case "goku":
        userImgElement.setAttribute("src", "./src/images/gokuUI.png");
        break;
      case "vegeto":
        userImgElement.setAttribute("src", "./src/images/vegeto.png");
        break;
      case "vados":
        userImgElement.setAttribute("src", "./src/images/vados.png");
        break;
    }

    addUsersOption();

    userDivList.append(userImgElement);
    userDivList.append(userNameElement);
    userDivList.append(deleteButtonUser);

    divUsers.append(userDivList);
  });
}

function addUsersOption() {
  let selectElement = document.querySelector("#usersExpense");
  selectElement.innerHTML = "";

  usersArray.forEach(user => {
    let optionElement = document.createElement("option");
    optionElement.textContent = user.name;
    optionElement.setAttribute("value", user.name);
    selectElement.append(optionElement);
  });
}


document.getElementById("confirm-expense").addEventListener("click", () => {
  let selectedElement = document.querySelector("#usersExpense");
  let selectedName = selectedElement.value;

  let titleElement = document.querySelector("#title-expense");
  let title = titleElement.value;

  let amountElement = document.querySelector("#amount-expense");
  let amount = parseFloat(amountElement.value);

  let validateTitle = regexUsername.test(title);
  let validateAmount = regexAmount.test(amount);

  if (!validateAmount || !validateTitle) {
    alert("Amount or title fields are incorrect");
  } else {
    let userSelected = usersArray.find(user => user.name === selectedName);
    
    if (userSelected) {
      let payment = new Payment(userSelected, title, amount, Date.now());
      addPayment(payment);

      userSelected.paid += amount;
      let eachAmount = amount / usersArray.length;
      userSelected.owed += (usersArray.length - 1) * eachAmount;

      titleElement.value = "";
      amountElement.value = "";
      insertUsersBalances();
    } else {
      alert("User selected does not exist");
    }
  }
});

function addPayment(payment) {
  let date = new Date();
  let day = date.getDate(); 
  let month = date.toLocaleString('default', { month: 'short' });

  insertPayment(payment, day, month);
}

function insertPayment(payment, day, month) {
  let divPayments = document.querySelector(".home-menu");

  
  let paymentDiv = document.createElement("div");
  paymentDiv.classList.add("paymentDiv");

  
  let dateDiv = document.createElement("div");
  dateDiv.classList.add("dateDiv");

  let monthElement = document.createElement("p");
  monthElement.textContent = month;

  let dayElement = document.createElement("p");
  dayElement.textContent = day;

  dateDiv.append(monthElement);
  dateDiv.append(dayElement);


  let contentDiv = document.createElement("div");
  contentDiv.classList.add("contentDiv");
  
  let titleElement = document.createElement("h3");
  titleElement.textContent = payment.title; 
  
  let paymentDetails = document.createElement("p");
  paymentDetails.textContent = `${payment.user.name} paid ${payment.amount}€`; 


  contentDiv.append(titleElement);
  contentDiv.append(paymentDetails);

  paymentDiv.append(dateDiv);
  paymentDiv.append(contentDiv);

  divPayments.insertBefore(paymentDiv, divPayments.firstChild);

}

function updatePaymentsDisplay() {
  let divPayments = document.querySelector(".home-menu");
  divPayments.innerHTML = "";

  paymentsArray.forEach(payment => {
    let date = new Date(payment.date);
    let day = date.getDate();
    let month = date.toLocaleString('default', { month: 'short' });

    insertPayment(payment, day, month);
  });
}

function insertUsersBalances(){

  let usersBalancesDiv = document.querySelector(".usersBalances");
  usersBalancesDiv.innerHTML = "";

  usersArray.forEach(user => {
    let balanceDiv = document.createElement("div");
    balanceDiv.classList.add("userBalance");
    balanceDiv.setAttribute("data-user", user.name);


    let iconDiv = document.createElement("div");
    let infoDiv = document.createElement("div");


    let imgElement = document.createElement("img");
    switch (user.icon) {
      case "broly":
        imgElement.setAttribute("src", "./src/images/broly.png");
        break;
      case "gogeta":
        imgElement.setAttribute("src", "./src/images/gogeta.png");
        break;
      case "goku":
        imgElement.setAttribute("src", "./src/images/gokuUI.png");
        break;
      case "vegeto":
        imgElement.setAttribute("src", "./src/images/vegeto.png");
        break;
      case "vados":
        imgElement.setAttribute("src", "./src/images/vados.png");
        break;
    }
    
    
    let h3Element = document.createElement("h3");
    h3Element.textContent = user.name;


    let paidElement = document.createElement("p");
    let owedElement = document.createElement("p");

    paidElement.classList.add("paid");
    owedElement.classList.add("owed");


    if(user.genre == "male"){
      paidElement.textContent = "He has paid " + user.paid;
      owedElement.textContent = "He is owed " + user.owed;
    }else{
      paidElement.textContent = "She has paid " + user.paid;
      owedElement.textContent = "She is owed " + user.owed;
    }

    iconDiv.append(imgElement);
    infoDiv.append(h3Element);
    infoDiv.append(paidElement);
    infoDiv.append(owedElement);


    balanceDiv.append(iconDiv);
    balanceDiv.append(infoDiv);
    usersBalancesDiv.append(balanceDiv);
  });
}

function settleUp() {
  usersArray.forEach(user => {
    user.paid = 0;
    user.owed = 0;

    const userBalanceDiv = document.querySelector(`.userBalance[data-user="${user.name}"]`);
    if (userBalanceDiv) {
      const paidElement = userBalanceDiv.querySelector(".paid");
      const owedElement = userBalanceDiv.querySelector(".owed");

      paidElement.textContent = user.genre === "male" ? "He has paid 0" : "She has paid 0";
      owedElement.textContent = user.genre === "male" ? "He is owed 0" : "She is owed 0";
    }
  });
}