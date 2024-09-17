if ($('#revese-timer').length) {

    const FULL_DASH_ARRAY = 283;

    var Minute = $('#revese-timer').data('minute');
    var Seconds = 60;
    const TIME_LIMIT = Seconds;
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;
    let remainingPathColor = "green";

    document.getElementById("revese-timer").innerHTML = `
      <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
              id="base-timer-path-remaining"
              stroke-dasharray="283"
              class="base-timer__path-remaining ${remainingPathColor}"
              d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
              "
            ></path>
          </g>
        </svg>
        <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
    )}</span>
      </div>
    `;

    startTimer();

    function startTimer() {
        timerInterval = setInterval(() => {
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed;
            document.getElementById("base-timer-label").innerHTML = formatTime(
                timeLeft
            );
            setCircleDasharray();
            setRemainingPathColor(timeLeft);

            if (timeLeft === 0) {
                // Reset the timer and progress bar
                timePassed = 0;
                timeLeft = TIME_LIMIT;
                setCircleDasharray();
                document.getElementById("base-timer-label").innerHTML = formatTime(
                    timeLeft
                );
            }
        }, 1000);
    }

    function formatTime(time) {
        let seconds = time % 60;

        if (seconds < 10) {
            seconds = `0${seconds}`;
        }

        return `${seconds}`;
    }

    function calculateTimeFraction() {
        const rawTimeFraction = timeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }

    function setCircleDasharray() {
        const circleDasharray = `${(
            calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        document
            .getElementById("base-timer-path-remaining")
            .setAttribute("stroke-dasharray", circleDasharray);
    }

    function setRemainingPathColor(timeLeft) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove("green");
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(remainingPathColor);
    }
}


//   theme toggler 
const toggleSwitch = document.getElementById("switch");
const container = document.getElementById("background-theme");
const btnGroupButton = document.querySelectorAll(".header-button");
const middle = document.getElementById("middle");
const numbers = document.getElementById("numbers");
// Check if the user has a saved preference
const savedPreference = localStorage.getItem('theme');

// If the user has a saved preference, apply it
if (savedPreference === 'dark') {
    container.classList.add('theme-dark');
    middle.classList.add("middle-dark");
    numbers.classList.add("numbers-dark");
    btnGroupButton.forEach(button => {
        button.classList.add('btn-dark-theme');
    })
    toggleSwitch.checked = true;
} else if (savedPreference === 'light') {
    container.classList.add('theme-light');
    middle.classList.add('middle-light');
    numbers.classList.add("numbers-light");
    btnGroupButton.forEach(button => {
        button.classList.add('btn-light-theme');
    })
    toggleSwitch.checked = false;
}


// Add an event listener to the toggle switch
toggleSwitch.addEventListener('change', () => {
    // Toggle the class of the container element
    container.classList.toggle('theme-dark');
    container.classList.toggle('theme-light');
    middle.classList.toggle('middle-dark');
    middle.classList.toggle('middle-light');
    numbers.classList.toggle('numbers-dark');
    numbers.classList.toggle('numbers-light');
    btnGroupButton.forEach(button => {
        button.classList.toggle('btn-dark-theme');
        button.classList.toggle('btn-light-theme');
    })
    // Save the user's preference in local storage
    if (container.classList.contains('theme-dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});


// fetch data
fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('tickers-data');
    let count = 1;
    data.forEach((ticker) => {
      const row = document.createElement('tr');
      console.log(row);
      row.classList.add("header-button");
      row.style.backgroundColor = "rgb(46, 40, 65)";
      row.style.backgroundColor = "rgb(255, 255, 255)";
      row.style.transition = 0.5;
      row.innerHTML = `
        <td>${count++}</td>
        <td class="platform">${ticker.name}</td>
        <td><h4>${ticker.last}</h4></td>
        <td><h4><span>${ticker.buy}</span> / <span>${ticker.sell}</span></h4></td>
        <td><h4>${ticker.volume}</h4></td>
        <td><h4>${ticker.base_unit}<h4></td>
      `;
      tableBody.appendChild(row);
    });
});
