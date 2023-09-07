'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-06-18T14:11:59.604Z',
    '2023-06-20T17:01:17.194Z',
    '2023-06-21T20:36:17.929Z',
    '2023-06-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Emo Onerhime',
  movements: [6000, 4400, -250, -890, -4210, -2000, 9500, -40],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-05-10T14:43:26.374Z',
    '2023-06-23T18:49:59.371Z',
    '2023-06-24T12:01:20.894Z',
  ],
  currency: 'NGN',
  locale: 'en-NG',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // Add dates to each movement
  return new Intl.DateTimeFormat(locale).format(date);
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();

  // return `${day}/${month}/${year}`;
};

// Currency Formatter
const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    // format account movements
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  // format account balance
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  // total inward movements
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  // total outward movements
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  // total interest earned
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
  // `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOUtTimer = () => {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When timer = 0 sec, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      // Display UI and message
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    // Decrease by 1s
    time--;
  };
  // Set time to 5 minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// Fake alway slogged in
// currentAccount = account3;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    // adding the options object to display date details
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', // numeric, narrow, short, numeric, 2-digit (08)
      year: 'numeric', // 2-digits
      // weekday: 'short', // long, narrow
    };

    // Getting location from user's browser
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now); // a local string: language and country
    // const now = new Date(); // day/ month/ year
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Start logout timer
    if (timer) clearInterval(timer);
    timer = startLogOUtTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOUtTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOUtTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// /*
// In JS, numbers are represented internally as floating point numbers; they are represented in a 64 base 2 format and are always stored in a binary format.
// Base 10: 0 - 9
// Binary Base 2: 0 and 1
// */

// console.log(23 === 23.0); // true

// // Conversion
// console.log(Number('23')); // 23
// console.log(+'23'); // 23 type coercion
// // when JS sees the + with a string, it converts the string (operands) to a number

// // Parsing a number from a string
// // console.log(Number.parseInt('30px', 10));
// /*
// returns 30, but the string must start with a number and then ignors all symbols that are not numbers.

// The parseInt method takes a second argument, the raddix, which is the base of the numeral system in use
// */

// // console.log(Number.parseFloat('2.5rem'));
// /*
// returns 2.5, a decimal value. parseInt will return 2 and ignor the decimal value

// parseInt and parseFloat are global fnx (parseInt('20px')) but still should be called on the Number object, which provides a namespace for the fnx
// */

// // Check if value is NAN
// console.log(Number.isNaN(20)); // false checks if value is a number
// console.log(Number.isNaN(+'20')); // true. isNaN is not the best way to check if a value is a number

// //Check if value is a number
// console.log(Number.isFinite(20)); // true
// console.log(Number.isFinite('20')); // false
// console.log(Number.isFinite(+'20')); // true
// console.log(Number.isFinite(+'20x')); // false
// console.log(Number.isFinite(23 / 0)); // false: infinite values are not numbers
// console.log(Number.isInteger(23)); // true
// console.log(Number.isInteger(23.0)); // true
// console.log(Number.isInteger(23 / 0)); // false

// /// MATH AND ROUNDING

// console.log(Math.sqrt(25)); // 5
// console.log(25 ** (1 / 2)); // 5
// console.log(8 ** (1 / 3)); // 2 cube root

// // Check for maximum value
// console.log(Math.max(5, 18, 23, 11, 2)); // 23
// console.log(Math.max(5, 18, '23', 11, 2)); // 23 type coercion
// console.log(Math.max(5, 18, '23px', 11, 2)); // NaN; does not support parsing

// // Check for minimum value
// console.log(Math.min(5, 18, 23, 11, 2)); // 2

// // Calculate radium
// console.log(Math.PI * Number.parseFloat('10px') ** 2); // 2

// // Random numbers
// console.log(Math.trunc(Math.random() * 6) + 1);

// // Random number funciton generator using min, max values
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20));
// console.log(randomInt(25, 90));

// // Rounding integers: all do type coercion
// console.log(Math.trunc(23.3)); // 23
// console.log(Math.trunc('23.3')); // 23
// console.log(Math.round(23.9)); // 24

// console.log(Math.ceil(23.9)); // 24; rounds up
// console.log(Math.ceil(23.3)); // 24

// console.log(Math.floor(23.9)); // 23; rounds down
// console.log(Math.floor(23.3)); // 23

// // floor and ceil both cutoff decimal places when dealing with positive numbers

// console.log(Math.trunc(-23.3)); // -23
// console.log(Math.floor(-23.3)); // -24: with negative numbers, rounding works the opposite way, so the value is rounded up to -24

// // Rounding decimals/ floating point numbers
// // toFixed returns a string
// console.log((2.7).toFixed(0)); // '2.7'
// console.log((2.7).toFixed(3)); // '2.700'
// console.log((2.345).toFixed(2)); // '2.35'
// console.log(+(2.344).toFixed(2)); // 2.34

// /// REMAINDER OPERATOR
// console.log(5 % 2); // 1: remainder

// // Check if a number is even or odd
// console.log(6 % 2); // 0
// console.log(6 % 2 === 0); // true

// const isEven = n => n % 2 === 0;
// console.log(isEven(24));
// console.log(isEven(45));

// labelBalance.addEventListener('click', () => {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     // 0, 2, 4, 6
//     if (isEven(i)) row.style.backgroundColor = 'orangered';

//     // 3, 6, 9
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

/// NUMERIC SEPARATORS
/*
Numeric separators should only be used on integers, same with parseInt
*/
const diameter = 287_460_000_000; // _ (numeric separators) is ignored by the JSE: 287460000000

// The numberic separator makes numbers in code easy to read

const price = 345_99; // 34599
const price2 = '345_99'; // NaN

// /// WORKING WITH BigInt
// /*
// integers are stored in 64 base 2 format and are always in a binary format. Of the 64 bits available, only 53 bits are available and limits the size of numbers (how big they can be)
// Precision can be lost doing calculations with numbers bigger than the max safe integer value of
// 9007199254740991 (9,007,199,254,740,991)
// */

// console.log(2 ** 53 - 1); // largest number that JS can handle
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 + 5); // largest number that JS can handle

// // In ES2020, a new primitive, BigInt was introduced and is represented by n after the number

// console.log(38470257858452845918083742940); // loses precision
// console.log(38470257858452845918083742940n); // bigInt: returns the number

// // the BigInt fnx can be used to create a BigInt
// console.log(BigInt(38470257858452845918083742940));

// // Operations
// // You can't mix BigInt and other types
// console.log(10000n + 10000n); // 20000n
// const huge = 202898302372283728378237n;
// const num = 23;
// // console.log(huge * num); // script.js:401 Uncaught TypeError: Cannot mix BigInt and other types, use explicit conversions
// console.log(huge * BigInt(num));
// // you can't use Math.sqrt on BigInt
// console.log(Math.sqrt(16n)); // can't convert BigInt to a number

// // Exceptions with logical operators
// console.log(20n > 15); // true
// console.log(20n === 20); // false
// console.log(20n == '20'); // true

// console.log(huge + ' is REALLY big!!!');

// // Divisions
// console.log(10n / 3n); // 3n takes only the whole value
// console.log(10 / 3); // 3.3333333

/// CREATING DATES
/*
There 4 ways for creating dates in JS
*/

// #1
// const now = new Date();
// console.log(now);

// // #2
// console.log(new Date('June 21 2023 18:25:45')); // avoid doing this except string is created by JS
// console.log(new Date(account1.movementsDates[3]));

// // #3
// console.log(new Date(2037, 10, 19, 15, 23, 5));

// // #4
// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));
// console.log(3 * 24 * 60 * 60 * 1000); // timestamp for day number 3

// Dates are objects and have their own methods like array, maps and strings

// Workig with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate()); // not day
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.toISOString());
// console.log(future.getTime()); // 2142253380000: milliseconds passed since Jan 1 1970
// console.log(new Date(2142253380000));

// // timestamp for current time
// console.log(Date.now());

// // set version for Date
// future.setFullYear(2040);
// console.log(future);

/// OPERATIONS WITH DATES
/*
When you subtract dates to get days between the 2 days, the result is a timestamp in milliseconds.
*/

const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const dates1 = new Date(2037, 3, 14),
  dates2 = new Date(2037, 3, 24);

const days1 = calcDaysPassed(dates1, dates2);
// console.log(days1);

/// INTERNATIONALIZING DATES (INTL)

// ISO language code talbe: https://www.lingoes.net

const today = new Date();
const myLocale = navigator.language;
const localeOptions = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric', // numeric, narrow, short, numeric, 2-digit (08)
  year: 'numeric', // 2-digits
  // weekday: 'short', // long, narrow
};

const dateTime = new Intl.DateTimeFormat(localeOptions, myLocale).format(today);

/// INTERNATIONALIZING NUMBERS
const num = 388474.23;

const options2 = {
  style: 'currency', // unit, percent, currency
  unit: 'mile-per-hour',
  currency: 'EUR',
  useGrouping: false, // true adds number separators
};

// console.log('US: ', new Intl.NumberFormat('en-US'.options2).format(num));
// console.log('Germany: ', new Intl.NumberFormat('de-DE', options2).format(num));
// console.log('Syria: ', new Intl.NumberFormat('ar-SY', options2).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, options2).format(num)
// );

/// TIMERS: setTimeout and setInterval
/*
There are 2 types of timers: setTimeout runs just once after a defined time (like a callback fnx), while the setInterval timer keeps running till it is stopped.

timers can be used to execute a function at a later time.
*/

// setTimeout(() => console.log('Here is your pizza 🍕'), 3000);

/*
setTimeout cannot take arguments so the aregument passed after the timer can be used as arguments to the fnx
*/

const ingredients = ['olives', 'spinach'];

const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
  3000,
  ...ingredients
);

console.log('Waiting for the setTimeout fnx');

// the setTimeout can be cancelled before it's run
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer); // timer needs to be named to stop it

// setInterval fnx
/*
To get a fnx to run at set intervals or times, the setInterval fnx is used
*/

setInterval(() => {
  const now = new Date();
  // console.log(now);
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    day: 'numeric',
    month: 'short', // numeric, narrow, short, numeric, 2-digit (08)
    year: 'numeric', // 2-digits
  }).format(now);
  // console.log(formatter);
}, 1000);
