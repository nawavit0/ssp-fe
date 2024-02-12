function handleChangeLanguage(lang, location, pageName) {
  var url = '';
  if (location) {
    url = '/' + lang + location.url.slice(3);
  } else {
    var switchLang = lang === 'th' ? 'en' : 'th';
    url = window.location.href;
    if (window.location.pathname === '/' + lang) {
      url = window.location.protocol + "//" + window.location.host + "/" + switchLang + window.location.search;
    } else {
      url = url.replace('/'+ lang +'/', '/'+ switchLang +'/');
    }
  }

  if ((pageName === 'category' || pageName === 'brand' || pageName === 'search')) {
    const customUrl = url.substring(0, url.indexOf('?'));
    if (customUrl.length > 0) {
      url = customUrl;
    }
  }
  window.location.href = url;
};

function countDownDate({ endDate, endMonth, endYear, endHour, endMinutes, dateBox, hourBox, minuteBox, secondBox, detailText, textDays, textHours, textMinutes, textSecond }) {
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var formatMonth = months[(endMonth || 1) - 1];
  var formatDate = endDate || '01';
  var formatYear = endYear || '2020';
  var formatHour = endHour || '00';
  var formatMinutes = endMinutes || '00';
  var formatGetTime = (`${formatMonth} ${formatDate}, ${formatYear} ${formatHour}:${formatMinutes} GMT+07:00`);
  var endTime = new Date(formatGetTime);
  var countDownDate = endTime.getTime();
  if (dateBox && detailText === true && textDays) {
    dateBox.querySelector('.js-count-down-detail').innerHTML = textDays;
  }
  if (hourBox && detailText === true && textHours) {
    hourBox.querySelector('.js-count-down-detail').innerHTML = textHours;
  }
  if (minuteBox && detailText === true && textMinutes) {
    minuteBox.querySelector('.js-count-down-detail').innerHTML = textMinutes;
  }
  if (secondBox && detailText === true && textSecond) {
    secondBox.querySelector('.js-count-down-detail').innerHTML = textSecond;
  }
  var x = setInterval(() => {
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 1) {
      days = '00';
      hours = '00';
      minutes = '00';
      seconds = '00';
    }

    if (dateBox) {
      if ((days + '').length > 2) {
        dateBox.querySelector('.js-count-down-number').innerHTML = days;
      } else {
        dateBox.querySelector('.js-count-down-number').innerHTML = (`0${days}`).slice(-2);
      }
    }
    if (hourBox) {
      hourBox.querySelector('.js-count-down-number').innerHTML = (`0${hours}`).slice(-2);
    }
    if (minuteBox) {
      minuteBox.querySelector('.js-count-down-number').innerHTML = (`0${minutes}`).slice(-2);
    }
    if (secondBox) {
      secondBox.querySelector('.js-count-down-number').innerHTML = (`0${seconds}`).slice(-2);
    }

    if (distance < 1) {
      clearInterval(x);
    }
  }, 1000);
}
