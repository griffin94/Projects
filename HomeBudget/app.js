const popup = document.querySelector('.popup');
const popupCloseBtn = document.querySelector('.popup__close-btn');
const incomeList = document.getElementById('income-list');
const expensesList = document.getElementById('expenses-list');
const incomeSum = document.getElementById('income-sum');
const expensesSum = document.getElementById('expenses-sum');
const balance = document.getElementById('balance');
const forms = document.querySelectorAll('.form');

popupCloseBtn.addEventListener('click', hidePopup);
forms.forEach(form => form.addEventListener('submit', handleForm));

let incomeArray = [];
let expensesArray = [];
let recordIDToEdit = "";
let listIDToEdit = "";

init();

function init() {
    if(window.localStorage.getItem("income")) {
        incomeArray = JSON.parse(window.localStorage.getItem("income"));
        renderList(incomeArray, incomeList);
    }

    if(window.localStorage.getItem("expenses")) {
        expensesArray = JSON.parse(window.localStorage.getItem("expenses"));
        renderList(expensesArray, expensesList); 
    }

    updateGlobalSum();
}

function handleForm(event) {
    event.preventDefault();
    const [input1, input2] = this.elements;
    const dataObj = {
        name: input1.value,
        value: input2.value.replace(/,/, "."),
    }

    if(areInputsNotEmpty(input1, input2) && isValuePositiveNumber(input2)) {
        if(this.id == "income-form") {
            addRecord("income", incomeArray, dataObj);
            renderList(incomeArray, incomeList);
        } else if (this.id == "expenses-form") {
            addRecord("expenses", expensesArray, dataObj);
            renderList(expensesArray, expensesList);
        } else {
            hidePopup();
            editRecord(recordIDToEdit, listIDToEdit, dataObj);
        }
        clearInputs(input1, input2);
        updateGlobalSum();
        input1.focus();
    }
}

function areInputsNotEmpty(...inputs){
    const result = inputs.map(input => {
        if(input.value) {
            input.classList.remove('text-field__input--error');
            input.nextElementSibling.textContent = "";
            return true;
        } else {
            input.classList.add('text-field__input--error');
            input.nextElementSibling.textContent = "Niepoprawna wartość";
            return false;
        }
    });

    return result.includes(false) ? false : true;
}

function isValuePositiveNumber(input) {
    const value = input.value.replace(/,/, ".");
    const re = /(^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)/;
    const result = re.test(value);

    if(result) {
        input.classList.remove('text-field__input--error');
        input.nextElementSibling.textContent = "";
    } else {
        input.classList.add('text-field__input--error');
        input.nextElementSibling.textContent = "Kwota musi być liczbą dodatnią";
    }
    
    return result;
}

function clearInputs(...inputs){
    inputs.forEach(input => input.value = "");
}

function addRecord(name, array, dataObj) {
    array.push(dataObj);
    window.localStorage.setItem(name, JSON.stringify(array));
}

function removeRecord() {
    if(this.name == "income-remove-btn") {
        incomeArray.splice(this.id.slice(-1), 1);
        window.localStorage.setItem("income", JSON.stringify(incomeArray));
        renderList(incomeArray, incomeList);
    } else {
        expensesArray.splice(this.id.slice(-1), 1);
        window.localStorage.setItem("expenses", JSON.stringify(expensesArray));
        renderList(expensesArray, expensesList);
    }
    updateGlobalSum();
}

function editRecord(recordID, listID, data) {
    if(listID == "income-list") {
        incomeArray.splice(recordID, 1, data);
        window.localStorage.setItem("income", JSON.stringify(incomeArray));
        renderList(incomeArray, incomeList);
    } else {
        expensesArray.splice(recordID, 1, data);
        window.localStorage.setItem("expenses", JSON.stringify(expensesArray));
        renderList(expensesArray, expensesList);
    }
    updateGlobalSum();
}

function showPopup() {
    popup.classList.add('popup--visible');
    document.getElementById('edit-name').focus();
    recordIDToEdit = this.id.slice(-1);
    listIDToEdit = this.name == 'income-edit-btn' ? 'income-list' : 'expenses-list';
}

function hidePopup() {
    popup.classList.remove('popup--visible');
}

function renderList(array, list) {
    const removeBtnName = list.id == 'income-list' ? 'income-remove-btn' : 'expenses-remove-btn';
    const editBtnName = list.id == 'income-list' ? 'income-edit-btn' : 'expenses-edit-btn';
    const listImgClass = list.id == 'income-list' ? 'fa-plus' : 'fa-minus';
    list.innerHTML = "";
    array.forEach((element, index) => {
        const li = document.createElement('li');
        li.classList.add('list__item');
        
        const textSpan = document.createElement('span');
        textSpan.innerHTML = `${element.name} - <b>${element.value}zł</b>`;

        const listImg = document.createElement('span');
        listImg.classList.add('fa', listImgClass);

        const textWrapper = document.createElement('div');
        textWrapper.classList.add('text-wrapper');

        textWrapper.appendChild(listImg);
        textWrapper.appendChild(textSpan);

        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.classList.add('buttons-wrapper');

        const editBtn = document.createElement('button');
        editBtn.classList.add('button', 'list__button');
        editBtn.setAttribute('id', `edit-${index}`);
        editBtn.setAttribute('name', editBtnName);
        const pencilIcon = document.createElement('span');
        pencilIcon.classList.add('fa', 'fa-pencil');
        editBtn.appendChild(pencilIcon);
        buttonsWrapper.appendChild(editBtn);

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('button', 'list__button', 'list__button--remove');
        removeBtn.setAttribute('id', `remove-${index}`);
        removeBtn.setAttribute('name', removeBtnName);
        const trashIcon = document.createElement('span');
        trashIcon.classList.add('fa', 'fa-trash');
        removeBtn.appendChild(trashIcon);
        buttonsWrapper.appendChild(removeBtn);

        li.appendChild(textWrapper);
        li.appendChild(buttonsWrapper);
        list.appendChild(li);

        removeBtn.addEventListener('click', removeRecord);
        editBtn.addEventListener('click', showPopup);
    })
}

function updateLocalSum(array, sumElement) {
    const sum = array.reduce((acc, curr) => acc + Number(curr.value), 0).toFixed(2);
    sumElement.textContent = `Suma ${sumElement.id == 'income-sum' ? 'przychodów' : 'wydatków'}: ${sum}zł`;
    return sum;
}

function updateGlobalSum() {
    const sum = Math.floor((updateLocalSum(incomeArray, incomeSum) - updateLocalSum(expensesArray, expensesSum))*100)/100;
    if(sum > 0) {
        balance.textContent = `Możesz jeszcze wydać ${sum} złotych`;
    } else if(sum == 0) {
        balance.textContent = `Bilans wynosi zero`;
    } else {
        balance.textContent = `Bilans jest ujemny. Jesteś na minusie ${sum} złotych`;
    }
}