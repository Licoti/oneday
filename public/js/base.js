const debug = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'none';
const moment = require('moment');
moment.locale('fr');

const curentDay = Date.now();
let timeout = true;
let user = localStorage.getItem('user');

export function initHome () {
  const Base = {
    init: function () {
      if (debug) console.log('Base-init !');

      // Initialize deferredPrompt for use later to show browser install prompt.
      let deferredPrompt;

      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        Base._showInstallPromotion();
        // Optionally, send analytics event that PWA install promo was shown.
        console.log(`'beforeinstallprompt' event was fired.`);
      });

      window.addEventListener('appinstalled', () => {
        // Hide the app-provided install promotion
        Base._hideInstallPromotion();
        // Clear the deferredPrompt so it can be garbage collected
        deferredPrompt = null;
        // Optionally, send analytics event to indicate successful install
        console.log('PWA was installed');
      });

      $('.notinstall').on('click', function (e) {
        Base._hideInstallPromotion();
      });

      $('.install').on('click', async function () {
        // Hide the app provided install promotion
        Base._hideInstallPromotion();
        // Show the install prompt
        deferredPrompt.prompt();

        if (!deferredPrompt) {
          console.log("The deferred prompt isn't available.");
          return;
        }

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        // Optionally, send analytics event with outcome of user choice
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt = null;
      });

      const _getElement = document.getElementById('view') || false;
      const _getElementDetail = document.getElementById('viewDetail') || false;
      const _getElementAdmin = document.getElementById('formElement') || false;
      const _index = document.getElementById('createAccount') || false;

      if (_index && localStorage.getItem('user')) {
        window.location.replace('/home');
        return;
      }

      if (_getElementAdmin) {
        this._getElementAdmin(user);
      }

      if (_getElement) {
        this._getElement(user, 'week');
      }

      if (_getElementDetail) {
        this._getElementDetail(user);
      }

      $('#formElement button').on('click', this._addElement);
      $('#preview').on('click', 'button', this._deleteElement);
      $('#view').on('click', 'button', this._count);
      $('#createAccount button').on('click', this._login);
      $('.tabTime-button').on('click', function () {
        $('.tabTime-button').removeClass('active');
        $(this).addClass('active');

        if ($(this).data('time') === "week") {
          $('#view').empty();
          Base._getElement(user, 'week');
        }
        if ($(this).data('time') === "month") {
          $('#view').empty();
          Base._getElement(user, 'month');
        }
      });
    },

    _showInstallPromotion: function (e) {
      $('#installApp').show();
    },

    _hideInstallPromotion: function (e) {
      $('#installApp').hide();
    },

    _login: function (e) {
      e.preventDefault();
      if (debug) console.log('_login');

      const userVal = $(this).closest('form').find('input').val();
      const userValObject = {};

      if (userVal === '') {
        return;
      }

      userValObject.name = userVal;

      localStorage.setItem('user', userVal);

      $.ajax({
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data:JSON.stringify(userValObject),
        url: `api/user`,
      }).done(function(response){
        if (debug) console.log("Response of update: ",response);
        window.location.href="/home";
      }).fail(function(xhr, textStatus, errorThrown){
        console.log("ERROR: ",xhr.responseText)
        return xhr.responseText;
      });
    },

    _count: function (e) {
      if (timeout) {
        e.preventDefault();
        if (debug) console.log('_count');

        let user = localStorage.getItem('user');

        if (user === '' || user === null) {
          window.location.replace('/');
          return;
        }

        let thiss = $(this);

        const idMainElement = $(this).closest('ul').data("id");
        const idMainElementObject = {};
        const ElementNumber = {};
        let add = null;
        let dataIdNumber = null;
        const numberReference = $(this).closest('li').find('.number').text();
        const idElement = $(this).closest('li').attr("id");
        const idNumber = (Date.now()).toString();
        let numberReferenceParsed = parseInt(numberReference, 10);

        if($(this).hasClass('add')) {
          ++numberReferenceParsed;
          $(this).closest('li').find('.number').text(numberReferenceParsed);
          $(this).closest('li').find('.number').attr('data-id', idNumber);
          add = true;
          ElementNumber.id = idNumber;
        }
        if($(this).hasClass('minus')) {
          --numberReferenceParsed;
          if(numberReferenceParsed < 0) {
            return
          }
          $(this).closest('li').find('.number').text(numberReferenceParsed);
          dataIdNumber = $(this).closest('li').find('.number').attr('data-id');
          add = false;

          ElementNumber.id = dataIdNumber;

          $.ajax({
            method: "GET",
            url: `api/elements/${user}?time=${daysParam}`,
          }).done(function(data){
            for (const element of data.names) {
              if (element.id === idElement) {
                let lengthNumber = element.numbers.length - 1;
                if (lengthNumber === -1) {
                  lengthNumber = 0
                }

                let idNumber;
                if (element.numbers[lengthNumber]) {
                  idNumber = element.numbers[lengthNumber].id;
                }

                thiss.closest('li').find('.number').attr('data-id', idNumber);
              }
            }
          })
        }

        ElementNumber.date = new Date();

        idMainElementObject.nameId = idElement;
        idMainElementObject.numbers = ElementNumber;
        idMainElementObject.add = add;

        $.ajax({
          method: "PUT",
          url: `api/element/${idMainElement}`,
          dataType:"json",
          contentType: "application/json",
          data:JSON.stringify(idMainElementObject)
        }).done(function(response){
          if (debug) console.log("Response of update: ",response)
        }).fail(function(xhr, textStatus, errorThrown){
          console.log("ERROR: ",xhr.responseText)
          return xhr.responseText;
        });

        timeout = false;

        setTimeout(() => {
          timeout = true;
        }, "200");
      }
    },

    _deleteElement: function () {
      if (debug) console.log('_deleteElement');

      const idMainElementObject = {};

      const idElement = $(this).closest('li').attr("id");
      const idMainElement = $(this).closest('ul').data("id");
      $(this).closest('li').remove();

      idMainElementObject.nameId = idElement;

      $.ajax({
        method: "DELETE",
        url: `api/element/${idMainElement}`,
        dataType: "json",
        contentType: "application/json",
        data:JSON.stringify(idMainElementObject),
      }).done(function(response){
        if (debug) console.log("Response of update: ",response)
      }).fail(function(xhr, textStatus, errorThrown){
        console.log("ERROR: ",xhr.responseText)
        return xhr.responseText;
      });
    },

    _getElementDetail: function (user) {
      if (debug) console.log('_getElementDetail');

      if (user === '' || user === null) {
        window.location.replace('/');
        return;
      }

      const location = window.location.pathname;
      const path = location.substring(0, location.lastIndexOf("/"));
      const userUi = path.match(/([^\/]*)\/*$/)[1];
      const getIdFunction = thePath => thePath.substring(thePath.lastIndexOf('/') + 1)
      var id = getIdFunction(location);

      console.log(`User : ${userUi} , id : ${id}`);

      $.ajax({
        method: "GET",
        url: `/api/element/${userUi}/${id}`,
      }).done(function(data){
        if (data) {
          console.log('Data : ' , data);
          $('.connectedTitle').text(data.name)
        }
      }).fail(function(xhr, textStatus, errorThrown){
        if (xhr.status === 401) {
          window.location.replace(xhr.responseJSON.url);
        } else {
          console.log("ERROR: ",xhr.responseText)
          return xhr.responseText;
        }
      });

    },

    _getElement: function (user, daysParam) {
      if (debug) console.log('_getElement', user);

      if (user === '' || user === null) {
        window.location.replace('/');
        return;
      }

      let dynnamicElement = '';
      let elementMainId

      $.ajax({
        method: "GET",
        url: `api/elements/${user}?time=${daysParam}`,
      }).done(function(data){
        if (data) {
          if (debug) console.log('Data : ' , data);
          elementMainId = data._id;

          for (const element of data.names) {
            const lengthNumberDisplayed = element.numbers.length;
            let lengthNumber = element.numbers.length - 1;
            if (lengthNumber === -1) {
              lengthNumber = 0
            }

            let idNumber;
            if (element.numbers[lengthNumber]) {
              idNumber = element.numbers[lengthNumber].id;
            }

            dynnamicElement +=
              `<li id="${element.id}">
                  <span>
                    <button class="minus">-</button>
                    <a href="/detail/${user}/${element.id}" class="viewTitle">${element.name}</a>
                  </span>
                  
                  <span>
                    <span class="number" data-id="${idNumber}">${lengthNumberDisplayed}</span>
                    <button class="add">+</button>
                  </span>
                </li>`;
          }

          $('#view').append(`${dynnamicElement}`);
          $('#view').attr('data-id', elementMainId)
        }
      }).fail(function(xhr, textStatus, errorThrown){
        if (xhr.status === 401) {
          window.location.replace(xhr.responseJSON.url);
        } else {
          console.log("ERROR: ",xhr.responseText)
          return xhr.responseText;
        }
      });
    },

    _getElementAdmin: function (user) {
      if (debug) console.log('_getElementAdmin', user);

      if (user === '' || user === null) {
        window.location.replace('/');
        return;
      }

      let dynnamicElement = '';
      let elementMainId;

      const placeholderGenerator = [
        'Boire du Coca',
        'Manger du chocolat',
        'Manger des chips',
        'Manger de la charcuterie',
        'Faire du sport',
        'Prendre des douches froides',
      ];

      const resultGenerator = placeholderGenerator[ Math.floor( Math.random() * placeholderGenerator.length ) ];

      $('#formElement input').attr('placeholder', resultGenerator);

      $.ajax({
        type: "GET",
        url: `api/elements/${user}`,
        async: false,
        success: function(data) {
          if (data) {
            elementMainId = data._id;
            for (const element of data.names) {
              const elementName = element.name;
              const elementId = element.id;
              const elementNumber = element.number;
              let elementNameTable = [];
              let elementIdTable = [];

              elementNameTable.push(elementName);
              elementIdTable.push(elementId);

              dynnamicElement +=
                `<li data-number="${elementNumber}" id="${elementId}"><span>${elementName}</span> <button>Supprimer</button></li>`;
            }

            $('#preview').append(`${dynnamicElement}`);
            $('#preview').attr('data-id', elementMainId);
          }
        }
      });
    },

    _addElement: function (e) {
      e.preventDefault();
      if (debug) console.log('_addElement');

      const user = localStorage.getItem('user');
      const idDate = (Date.now()).toString();

      if (user === '') {
        window.location.replace('/');
        return;
      }

      let textVal = $(this).closest('form').find('input').val();

      if (textVal === '') {
        return;
      }

      const categories = {
        id: idDate,
        name: textVal,
        numbers: [{date: null, id: null}]
      }

      $.ajax({
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data:JSON.stringify(categories),
        url: `api/element/${user}`,
      }).done(function(response){
        if (debug) console.log("Response of update: ",response);

        let dynnamicElement = '';
        dynnamicElement +=
          `<li data-number="0" id="${idDate}"><span>${textVal}</span> <button>Supprimer</button></li>`;
        $('#preview').append(`${dynnamicElement}`);
      }).fail(function(xhr, textStatus, errorThrown){
        console.log("ERROR: ",xhr.responseText)
        return xhr.responseText;
      });

      $(this).closest('form').find('input').val('');
    }
  };

  Base.init();
}