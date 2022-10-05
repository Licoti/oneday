"use strict";
(self["webpackChunkbooknodegenerator"] = self["webpackChunkbooknodegenerator"] || []).push([["js/base"],{

/***/ "./public/js/base.js":
/*!***************************!*\
  !*** ./public/js/base.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initHome": () => (/* binding */ initHome)
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
const debug =  true || 0;

function initHome () {
  const Base = {
    init: function () {
      if (debug) console.log('Base-init !');

      const _getElement = document.getElementById('view') || false;
      const _getElementAdmin = document.getElementById('formElement') || false;
      const _index = document.getElementById('createAccount') || false;

      if (_index && localStorage.getItem('user')) {
        window.location.replace('/home');
        return;
      }

      if (_getElementAdmin) {
        this._getElementAdmin();
      }

      if (_getElement) {
        this._getElement();
      }

      $('#formElement button').on('click', this._addElement);
      $('#preview').on('click', 'button', this._deleteElement);
      $('#view').on('click', 'button', this._count);
      $('#createAccount button').on('click', this._login);
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
        console.log("Response of update: ",response);
        window.location.href="/home";
      }).fail(function(xhr, textStatus, errorThrown){
        console.log("ERROR: ",xhr.responseText)
        return xhr.responseText;
      });
    },

    _count: function (e) {
      e.preventDefault();
      if (debug) console.log('_count');

      const idMainElement = $(this).closest('ul').data("id");
      const idMainElementObject = {};
      const numberReference = $(this).closest('li').find('.number').text();
      const idElement = $(this).closest('li').attr("id");
      let numberReferenceParsed = parseInt(numberReference, 10);

      if($(this).hasClass('add')) {
        ++numberReferenceParsed;
        $(this).closest('li').find('.number').text(numberReferenceParsed);
      }
      if($(this).hasClass('minus')) {
        --numberReferenceParsed;
        if(numberReferenceParsed < 0) {
          return
        }
        $(this).closest('li').find('.number').text(numberReferenceParsed);
      }

      idMainElementObject.number = numberReferenceParsed;
      idMainElementObject.nameId = idElement;

      $.ajax({
        method:"PUT",
        url: `api/element/${idMainElement}`,
        dataType:"json",
        contentType: "application/json",
        data:JSON.stringify(idMainElementObject)
      }).done(function(response){
        console.log("Response of update: ",response)
      }).fail(function(xhr, textStatus, errorThrown){
        console.log("ERROR: ",xhr.responseText)
        return xhr.responseText;
      });
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
        console.log("Response of update: ",response)
      }).fail(function(xhr, textStatus, errorThrown){
        console.log("ERROR: ",xhr.responseText)
        return xhr.responseText;
      });
    },

    _getElement: function () {
      if (debug) console.log('_getElement');

      let user = localStorage.getItem('user');
      let dynnamicElement = '';
      let elementMainId;

      if (user === '') {
        window.location.replace('/');
        return;
      }

      $.ajax({
        method: "GET",
        url: `api/elements/${user}`,
      }).done(function(data){
        if (data) {
          elementMainId = data._id;

          for (const element of data.names) {
            dynnamicElement +=
              `<li id="${element.id}"><button class="minus">-</button><span>${element.name}</span> <span class="number">${element.number}</span> <button class="add">+</button></li>`;
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

    _getElementAdmin: function () {
      if (debug) console.log('_getElementAdmin');

      const user = localStorage.getItem('user');
      let dynnamicElement = '';
      let elementMainId;

      if (user === '') {
        window.location.replace('/');
        return;
      }

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
      const categories = [];

      if (user === '') {
        window.location.replace('/');
        return;
      }

      const textVal = $(this).closest('form').find('input').val();

      categories.push({
        id: idDate,
        name: textVal,
        number: 0
      });

      $('#preview').find('li').each(function(index){
        const idId = $(this).attr('id');
        const idName = $(this).find('span').text();
        const number = $(this).data('number');

        categories.push({
          id: idId,
          name: idName,
          number: number
        });
      });

      let elementInfo;

      elementInfo = {
        categories
      };

      $.ajax({
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data:JSON.stringify(elementInfo),
        url: `api/element/${user}`,
      }).done(function(response){
        console.log("Response of update: ",response);

        let dynnamicElement = '';
        dynnamicElement +=
          `<li data-number="0" id="${idDate}"><span>${textVal}</span> <button>Supprimer</button></li>`;
        $('#preview').append(`${dynnamicElement}`);
      }).fail(function(xhr, textStatus, errorThrown){
        console.log("ERROR: ",xhr.responseText)
        return xhr.responseText;
      });
    }
  };

  Base.init();
}

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFPLFVBQVUsUUFBUTtBQUM5RCxRQUFRLENBQUMsdUJBQXVCLGdCQUFnQjtBQUNoRCxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib29rbm9kZWdlbmVyYXRvci8uL3B1YmxpYy9qcy9iYXNlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGRlYnVnID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgfHwgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdub25lJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRIb21lICgpIHtcbiAgY29uc3QgQmFzZSA9IHtcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdCYXNlLWluaXQgIScpO1xuXG4gICAgICBjb25zdCBfZ2V0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3JykgfHwgZmFsc2U7XG4gICAgICBjb25zdCBfZ2V0RWxlbWVudEFkbWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm1FbGVtZW50JykgfHwgZmFsc2U7XG4gICAgICBjb25zdCBfaW5kZXggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3JlYXRlQWNjb3VudCcpIHx8IGZhbHNlO1xuXG4gICAgICBpZiAoX2luZGV4ICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJykpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoJy9ob21lJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKF9nZXRFbGVtZW50QWRtaW4pIHtcbiAgICAgICAgdGhpcy5fZ2V0RWxlbWVudEFkbWluKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfZ2V0RWxlbWVudCkge1xuICAgICAgICB0aGlzLl9nZXRFbGVtZW50KCk7XG4gICAgICB9XG5cbiAgICAgICQoJyNmb3JtRWxlbWVudCBidXR0b24nKS5vbignY2xpY2snLCB0aGlzLl9hZGRFbGVtZW50KTtcbiAgICAgICQoJyNwcmV2aWV3Jykub24oJ2NsaWNrJywgJ2J1dHRvbicsIHRoaXMuX2RlbGV0ZUVsZW1lbnQpO1xuICAgICAgJCgnI3ZpZXcnKS5vbignY2xpY2snLCAnYnV0dG9uJywgdGhpcy5fY291bnQpO1xuICAgICAgJCgnI2NyZWF0ZUFjY291bnQgYnV0dG9uJykub24oJ2NsaWNrJywgdGhpcy5fbG9naW4pO1xuICAgIH0sXG5cbiAgICBfbG9naW46IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdfbG9naW4nKTtcblxuICAgICAgY29uc3QgdXNlclZhbCA9ICQodGhpcykuY2xvc2VzdCgnZm9ybScpLmZpbmQoJ2lucHV0JykudmFsKCk7XG4gICAgICBjb25zdCB1c2VyVmFsT2JqZWN0ID0ge307XG5cbiAgICAgIGlmICh1c2VyVmFsID09PSAnJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHVzZXJWYWxPYmplY3QubmFtZSA9IHVzZXJWYWw7XG5cbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyJywgdXNlclZhbCk7XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBkYXRhOkpTT04uc3RyaW5naWZ5KHVzZXJWYWxPYmplY3QpLFxuICAgICAgICB1cmw6IGBhcGkvdXNlcmAsXG4gICAgICB9KS5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSBvZiB1cGRhdGU6IFwiLHJlc3BvbnNlKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9XCIvaG9tZVwiO1xuICAgICAgfSkuZmFpbChmdW5jdGlvbih4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogXCIseGhyLnJlc3BvbnNlVGV4dClcbiAgICAgICAgcmV0dXJuIHhoci5yZXNwb25zZVRleHQ7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgX2NvdW50OiBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGRlYnVnKSBjb25zb2xlLmxvZygnX2NvdW50Jyk7XG5cbiAgICAgIGNvbnN0IGlkTWFpbkVsZW1lbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJ3VsJykuZGF0YShcImlkXCIpO1xuICAgICAgY29uc3QgaWRNYWluRWxlbWVudE9iamVjdCA9IHt9O1xuICAgICAgY29uc3QgbnVtYmVyUmVmZXJlbmNlID0gJCh0aGlzKS5jbG9zZXN0KCdsaScpLmZpbmQoJy5udW1iZXInKS50ZXh0KCk7XG4gICAgICBjb25zdCBpZEVsZW1lbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykuYXR0cihcImlkXCIpO1xuICAgICAgbGV0IG51bWJlclJlZmVyZW5jZVBhcnNlZCA9IHBhcnNlSW50KG51bWJlclJlZmVyZW5jZSwgMTApO1xuXG4gICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdhZGQnKSkge1xuICAgICAgICArK251bWJlclJlZmVyZW5jZVBhcnNlZDtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCdsaScpLmZpbmQoJy5udW1iZXInKS50ZXh0KG51bWJlclJlZmVyZW5jZVBhcnNlZCk7XG4gICAgICB9XG4gICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdtaW51cycpKSB7XG4gICAgICAgIC0tbnVtYmVyUmVmZXJlbmNlUGFyc2VkO1xuICAgICAgICBpZihudW1iZXJSZWZlcmVuY2VQYXJzZWQgPCAwKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCdsaScpLmZpbmQoJy5udW1iZXInKS50ZXh0KG51bWJlclJlZmVyZW5jZVBhcnNlZCk7XG4gICAgICB9XG5cbiAgICAgIGlkTWFpbkVsZW1lbnRPYmplY3QubnVtYmVyID0gbnVtYmVyUmVmZXJlbmNlUGFyc2VkO1xuICAgICAgaWRNYWluRWxlbWVudE9iamVjdC5uYW1lSWQgPSBpZEVsZW1lbnQ7XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIG1ldGhvZDpcIlBVVFwiLFxuICAgICAgICB1cmw6IGBhcGkvZWxlbWVudC8ke2lkTWFpbkVsZW1lbnR9YCxcbiAgICAgICAgZGF0YVR5cGU6XCJqc29uXCIsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgZGF0YTpKU09OLnN0cmluZ2lmeShpZE1haW5FbGVtZW50T2JqZWN0KVxuICAgICAgfSkuZG9uZShmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2Ugb2YgdXBkYXRlOiBcIixyZXNwb25zZSlcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bil7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IFwiLHhoci5yZXNwb25zZVRleHQpXG4gICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9kZWxldGVFbGVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdfZGVsZXRlRWxlbWVudCcpO1xuXG4gICAgICBjb25zdCBpZE1haW5FbGVtZW50T2JqZWN0ID0ge307XG5cbiAgICAgIGNvbnN0IGlkRWxlbWVudCA9ICQodGhpcykuY2xvc2VzdCgnbGknKS5hdHRyKFwiaWRcIik7XG4gICAgICBjb25zdCBpZE1haW5FbGVtZW50ID0gJCh0aGlzKS5jbG9zZXN0KCd1bCcpLmRhdGEoXCJpZFwiKTtcbiAgICAgICQodGhpcykuY2xvc2VzdCgnbGknKS5yZW1vdmUoKTtcblxuICAgICAgaWRNYWluRWxlbWVudE9iamVjdC5uYW1lSWQgPSBpZEVsZW1lbnQ7XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICAgICAgdXJsOiBgYXBpL2VsZW1lbnQvJHtpZE1haW5FbGVtZW50fWAsXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBkYXRhOkpTT04uc3RyaW5naWZ5KGlkTWFpbkVsZW1lbnRPYmplY3QpLFxuICAgICAgfSkuZG9uZShmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2Ugb2YgdXBkYXRlOiBcIixyZXNwb25zZSlcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bil7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IFwiLHhoci5yZXNwb25zZVRleHQpXG4gICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9nZXRFbGVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdfZ2V0RWxlbWVudCcpO1xuXG4gICAgICBsZXQgdXNlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJyk7XG4gICAgICBsZXQgZHlubmFtaWNFbGVtZW50ID0gJyc7XG4gICAgICBsZXQgZWxlbWVudE1haW5JZDtcblxuICAgICAgaWYgKHVzZXIgPT09ICcnKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKCcvJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB1cmw6IGBhcGkvZWxlbWVudHMvJHt1c2VyfWAsXG4gICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIGVsZW1lbnRNYWluSWQgPSBkYXRhLl9pZDtcblxuICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBkYXRhLm5hbWVzKSB7XG4gICAgICAgICAgICBkeW5uYW1pY0VsZW1lbnQgKz1cbiAgICAgICAgICAgICAgYDxsaSBpZD1cIiR7ZWxlbWVudC5pZH1cIj48YnV0dG9uIGNsYXNzPVwibWludXNcIj4tPC9idXR0b24+PHNwYW4+JHtlbGVtZW50Lm5hbWV9PC9zcGFuPiA8c3BhbiBjbGFzcz1cIm51bWJlclwiPiR7ZWxlbWVudC5udW1iZXJ9PC9zcGFuPiA8YnV0dG9uIGNsYXNzPVwiYWRkXCI+KzwvYnV0dG9uPjwvbGk+YDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkKCcjdmlldycpLmFwcGVuZChgJHtkeW5uYW1pY0VsZW1lbnR9YCk7XG4gICAgICAgICAgJCgnI3ZpZXcnKS5hdHRyKCdkYXRhLWlkJywgZWxlbWVudE1haW5JZClcbiAgICAgICAgfVxuICAgICAgfSkuZmFpbChmdW5jdGlvbih4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKXtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHhoci5yZXNwb25zZUpTT04udXJsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBcIix4aHIucmVzcG9uc2VUZXh0KVxuICAgICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgX2dldEVsZW1lbnRBZG1pbjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGRlYnVnKSBjb25zb2xlLmxvZygnX2dldEVsZW1lbnRBZG1pbicpO1xuXG4gICAgICBjb25zdCB1c2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKTtcbiAgICAgIGxldCBkeW5uYW1pY0VsZW1lbnQgPSAnJztcbiAgICAgIGxldCBlbGVtZW50TWFpbklkO1xuXG4gICAgICBpZiAodXNlciA9PT0gJycpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoJy8nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkLmFqYXgoe1xuICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICB1cmw6IGBhcGkvZWxlbWVudHMvJHt1c2VyfWAsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICBlbGVtZW50TWFpbklkID0gZGF0YS5faWQ7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZGF0YS5uYW1lcykge1xuICAgICAgICAgICAgICBjb25zdCBlbGVtZW50TmFtZSA9IGVsZW1lbnQubmFtZTtcbiAgICAgICAgICAgICAgY29uc3QgZWxlbWVudElkID0gZWxlbWVudC5pZDtcbiAgICAgICAgICAgICAgY29uc3QgZWxlbWVudE51bWJlciA9IGVsZW1lbnQubnVtYmVyO1xuICAgICAgICAgICAgICBsZXQgZWxlbWVudE5hbWVUYWJsZSA9IFtdO1xuICAgICAgICAgICAgICBsZXQgZWxlbWVudElkVGFibGUgPSBbXTtcblxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVRhYmxlLnB1c2goZWxlbWVudE5hbWUpO1xuICAgICAgICAgICAgICBlbGVtZW50SWRUYWJsZS5wdXNoKGVsZW1lbnRJZCk7XG5cbiAgICAgICAgICAgICAgZHlubmFtaWNFbGVtZW50ICs9XG4gICAgICAgICAgICAgICAgYDxsaSBkYXRhLW51bWJlcj1cIiR7ZWxlbWVudE51bWJlcn1cIiBpZD1cIiR7ZWxlbWVudElkfVwiPjxzcGFuPiR7ZWxlbWVudE5hbWV9PC9zcGFuPiA8YnV0dG9uPlN1cHByaW1lcjwvYnV0dG9uPjwvbGk+YDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCgnI3ByZXZpZXcnKS5hcHBlbmQoYCR7ZHlubmFtaWNFbGVtZW50fWApO1xuICAgICAgICAgICAgJCgnI3ByZXZpZXcnKS5hdHRyKCdkYXRhLWlkJywgZWxlbWVudE1haW5JZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgX2FkZEVsZW1lbnQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdfYWRkRWxlbWVudCcpO1xuXG4gICAgICBjb25zdCB1c2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKTtcbiAgICAgIGNvbnN0IGlkRGF0ZSA9IChEYXRlLm5vdygpKS50b1N0cmluZygpO1xuICAgICAgY29uc3QgY2F0ZWdvcmllcyA9IFtdO1xuXG4gICAgICBpZiAodXNlciA9PT0gJycpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoJy8nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0ZXh0VmFsID0gJCh0aGlzKS5jbG9zZXN0KCdmb3JtJykuZmluZCgnaW5wdXQnKS52YWwoKTtcblxuICAgICAgY2F0ZWdvcmllcy5wdXNoKHtcbiAgICAgICAgaWQ6IGlkRGF0ZSxcbiAgICAgICAgbmFtZTogdGV4dFZhbCxcbiAgICAgICAgbnVtYmVyOiAwXG4gICAgICB9KTtcblxuICAgICAgJCgnI3ByZXZpZXcnKS5maW5kKCdsaScpLmVhY2goZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgICBjb25zdCBpZElkID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xuICAgICAgICBjb25zdCBpZE5hbWUgPSAkKHRoaXMpLmZpbmQoJ3NwYW4nKS50ZXh0KCk7XG4gICAgICAgIGNvbnN0IG51bWJlciA9ICQodGhpcykuZGF0YSgnbnVtYmVyJyk7XG5cbiAgICAgICAgY2F0ZWdvcmllcy5wdXNoKHtcbiAgICAgICAgICBpZDogaWRJZCxcbiAgICAgICAgICBuYW1lOiBpZE5hbWUsXG4gICAgICAgICAgbnVtYmVyOiBudW1iZXJcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGVsZW1lbnRJbmZvO1xuXG4gICAgICBlbGVtZW50SW5mbyA9IHtcbiAgICAgICAgY2F0ZWdvcmllc1xuICAgICAgfTtcblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGRhdGE6SlNPTi5zdHJpbmdpZnkoZWxlbWVudEluZm8pLFxuICAgICAgICB1cmw6IGBhcGkvZWxlbWVudC8ke3VzZXJ9YCxcbiAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIG9mIHVwZGF0ZTogXCIscmVzcG9uc2UpO1xuXG4gICAgICAgIGxldCBkeW5uYW1pY0VsZW1lbnQgPSAnJztcbiAgICAgICAgZHlubmFtaWNFbGVtZW50ICs9XG4gICAgICAgICAgYDxsaSBkYXRhLW51bWJlcj1cIjBcIiBpZD1cIiR7aWREYXRlfVwiPjxzcGFuPiR7dGV4dFZhbH08L3NwYW4+IDxidXR0b24+U3VwcHJpbWVyPC9idXR0b24+PC9saT5gO1xuICAgICAgICAkKCcjcHJldmlldycpLmFwcGVuZChgJHtkeW5uYW1pY0VsZW1lbnR9YCk7XG4gICAgICB9KS5mYWlsKGZ1bmN0aW9uKHhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBcIix4aHIucmVzcG9uc2VUZXh0KVxuICAgICAgICByZXR1cm4geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBCYXNlLmluaXQoKTtcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=