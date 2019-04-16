(function () {

  const button = document.querySelector('button.btn');

  var keys = localStorage.getItem('mapped-keys') ? JSON.parse(localStorage.getItem('mapped-keys')) : {
    pad1: 'a',
    pad2: 's',
    pad3: 'd',
    pad4: 'f',
    pad5: 'g',
    pad6: 'h'
  };

  window.onkeyup = function (event) {
    let key = event.key.toLowerCase();
    let indexOfKey = Object.values(keys).indexOf(key);
    if (indexOfKey !== -1 && document.activeElement.toString().indexOf('HTMLInputElement') === -1 && !button.classList.contains('show')) {
      document.querySelector('.pad' + (indexOfKey + 1)).click();
    }
  }

  window.addEventListener("load", () => {
    const sounds = document.querySelectorAll("audio");
    const pads = document.querySelectorAll(".pads div");
    const visual = document.querySelector(".visual");
    const colors = Array.from(document.querySelectorAll('.pads div')).map(function (pad) {
      return window.getComputedStyle(pad, null).getPropertyValue("background-color");
    });
    const settings = document.querySelector('.settings');

    var keyConfigurations = [];

    var configuring = false;



    pads.forEach((pad, index) => {
      pad.addEventListener("click", function () {
        sounds[index].currentTime = 0;
        sounds[index].play();
        createBubble(index);
      });
    });

    button.addEventListener('click', function () {
      if(!this.classList.contains('show')) {
       return;
      }
      localStorage.setItem('mapped-keys', JSON.stringify(keys));
      settings.click();
    });

    settings.addEventListener('click', function () {
      showOrHideButton();
      configuring = !configuring;
      const mappedKeys = JSON.parse(localStorage.getItem('mapped-keys'));
     
      keyConfigurations.forEach(function (keyConfiguration, index) {
        const value = mappedKeys['pad' + (index + 1)].toUpperCase();
        keyConfiguration[0].innerText = value;
        keyConfiguration[1].children[0].value = value;
        keyConfiguration[0].style.display = configuring ? 'none' : 'flex';
        keyConfiguration[1].style.display = !configuring ? 'none' : 'flex';
      });
    });

    function showOrHideButton() { 
      var state = JSON.parse(JSON.stringify(configuring));
      if (state) {
        button.classList.remove('show');
        button.classList.add('hide'); 
      } else {
        button.classList.remove('hide');
        button.classList.add('show');
      }
    }

    function createBubble(index) {
      const bubble = document.createElement("div");
      visual.appendChild(bubble);
      bubble.style.backgroundColor = colors[index];
      bubble.style.animation = `jump 1s ease`;
      bubble.addEventListener("animationend", function () {
        visual.removeChild(this);
      });
    };


    (function (array) {
      for (var i = 0; i < array.length; i += 2) {
        keyConfigurations.push(array.slice(i, i + 2));
      }

      keyConfigurations.forEach(function (keyConfiguration, index) {
        const currentKeyValue = Object.values(keys)[index].toUpperCase();
        keyConfiguration[0].innerText = currentKeyValue;
        keyConfiguration[1].children[0].value = currentKeyValue;
        keyConfiguration[1].children[0].addEventListener('keydown', function (ev) {
          const oldLetter = Object.values(keys)[index];
          const lowerCasedKey = ev.key.toLowerCase();
          if (Object.values(keys).indexOf(lowerCasedKey) > -1 && lowerCasedKey !== oldLetter) {
            ev.preventDefault();
          }
        });
        keyConfiguration[1].children[0].oninput = function (ev) {
          if (ev.data) {
            const lowerCasedLetter = ev.data.toLowerCase();
            const indexOfKey = Object.values(keys).indexOf(lowerCasedLetter);
            const oldLetter = Object.values(keys)[index];
            if (indexOfKey === -1 || oldLetter === lowerCasedLetter) {
              ev.currentTarget.value = ev.currentTarget.value.toUpperCase();
              keyConfiguration[0].innerText = ev.currentTarget.value;
              keys['pad' + (index + 1)] = lowerCasedLetter;
            } else {
              ev.currentTarget.value = oldLetter.toUpperCase();
            }
          }

        };
      })
    })(Array.from(document.querySelectorAll('.keys ul li div')));
  });

})();

(function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: '/' }).then(function(reg) { 
      if(reg.installing) {
        console.log('Service worker installing');
      } else if(reg.waiting) {
        console.log('Service worker installed');
      } else if(reg.active) {
        console.log('Service worker active');
      }
  
    }).catch(function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
  }
})();