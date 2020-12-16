const weatherClass = new Weather();

const handleTime = () => {
    const timeInfo = new Date();
    const time = document.querySelector('.header__time');
    const date = document.querySelector('.header__date');
    const day = document.querySelector('.header__day');

    time.textContent = `${timeInfo.getHours() < 10 ? `0${timeInfo.getHours()}` : timeInfo.getHours()}:${timeInfo.getMinutes() < 10 ? `0${timeInfo.getMinutes()}` : timeInfo.getMinutes()}`;

    date.textContent = `${timeInfo.getDate() < 10 ? `0${timeInfo.getDate()}` : timeInfo.getDate()}.${timeInfo.getMonth()+1 < 10 ? `0${timeInfo.getMonth()+1}` : timeInfo.getMonth()+1}.${timeInfo.getFullYear()}`;

    switch(timeInfo.getDay()) {
        case 0:
            day.textContent = "Sunday";
            break;
        case 1:
            day.textContent = "Monday";
            break;
        case 2:
            day.textContent = "Tuesday";
            break;
        case 3:
            day.textContent = "Wednesday";
            break;
        case 4:
            day.textContent = "Thursday";
            break;
        case 5:
            day.textContent = "Friday";
            break;
        case 6:
            day.textContent = "Saturday";
            break;
    }

    setTimeout(handleTime, 30000)
}

handleTime();