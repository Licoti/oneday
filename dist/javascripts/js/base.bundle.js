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
/* harmony import */ var select2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! select2 */ "./node_modules/select2/dist/js/select2.js");
/* harmony import */ var select2__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(select2__WEBPACK_IMPORTED_MODULE_0__);
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
const debug =  true || 0;


function initHome () {
  const Base = {
    init: function () {
      if (debug) console.log('Base-init !');

      const _getElement = document.getElementById('view') || false;
      const _getElementAdmin = document.getElementById('formBase') || false;
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

      $('#formBase button').on('click', this._addElement);
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
      let elementsCategories = [];
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
              let elementNameTable = [];
              let elementIdTable = [];

              elementNameTable.push(elementName);
              elementIdTable.push(elementId);

              elementsCategories.push({
                id: elementId,
                text: elementName
              });

              dynnamicElement +=
                `<li id="${elementId}"><span>${elementName}</span> <button>Supprimer</button></li>`;
            }

            $('#preview').append(`${dynnamicElement}`);
            $('#preview').attr('data-id', elementMainId);
          }
        }
      });

      const texts = elementsCategories.map(o => o.text)
      const elementsCategoriesUniqueTexts = elementsCategories.filter(({text}, index) => !texts.includes(text, index + 1))

      $("#inputElementCategory").select2({
        tags: true,
        data: elementsCategoriesUniqueTexts,
        createTag: function (params) {
          var term = $.trim(params.term);

          if (term === '') {
            return null;
          }

          return {
            id: term,
            text: term,
            newTag: true
          }
        }
      });
    },

    _addElement: function (e) {
      e.preventDefault();
      if (debug) console.log('_addElement');

      const user = localStorage.getItem('user');
      const dataSelectedElements = $('#inputElementCategory').select2('data');
      const dataPresent = $('#preview li');
      const categories = [];

      if (user === '') {
        window.location.replace('/');
        return;
      }

      for (let j = 0; j < dataSelectedElements.length; j++) {
        const element = dataSelectedElements[j];
        const elementId = element._resultId;
        const elementName = element.text;

        categories.push({
          id: Date.now(),
          name: elementName,
          number: 0
        });
      }

      $('#preview').find('li').each(function(index){
        const idId = $(this).attr('id');
        const idName = $(this).find('span').text();

        categories.push({
          id: idId,
          name: idName,
          number: 0
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
        console.log("Response of update: ",response)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHFCQUFxQixDQUFDO0FBQ3RCLHVCQUF1QixDQUFDOztBQUV4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPOztBQUVQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNLENBQUM7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixLQUFLO0FBQ2pDLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Jvb2tub2RlZ2VuZXJhdG9yLy4vcHVibGljL2pzL2Jhc2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZGVidWcgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyB8fCBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ25vbmUnO1xuaW1wb3J0ICdzZWxlY3QyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRIb21lICgpIHtcbiAgY29uc3QgQmFzZSA9IHtcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdCYXNlLWluaXQgIScpO1xuXG4gICAgICBjb25zdCBfZ2V0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3JykgfHwgZmFsc2U7XG4gICAgICBjb25zdCBfZ2V0RWxlbWVudEFkbWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm1CYXNlJykgfHwgZmFsc2U7XG4gICAgICBjb25zdCBfaW5kZXggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3JlYXRlQWNjb3VudCcpIHx8IGZhbHNlO1xuXG4gICAgICBpZiAoX2luZGV4ICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJykpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoJy9ob21lJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKF9nZXRFbGVtZW50QWRtaW4pIHtcbiAgICAgICAgdGhpcy5fZ2V0RWxlbWVudEFkbWluKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfZ2V0RWxlbWVudCkge1xuICAgICAgICB0aGlzLl9nZXRFbGVtZW50KCk7XG4gICAgICB9XG5cbiAgICAgICQoJyNmb3JtQmFzZSBidXR0b24nKS5vbignY2xpY2snLCB0aGlzLl9hZGRFbGVtZW50KTtcbiAgICAgICQoJyNwcmV2aWV3Jykub24oJ2NsaWNrJywgJ2J1dHRvbicsIHRoaXMuX2RlbGV0ZUVsZW1lbnQpO1xuICAgICAgJCgnI3ZpZXcnKS5vbignY2xpY2snLCAnYnV0dG9uJywgdGhpcy5fY291bnQpO1xuICAgICAgJCgnI2NyZWF0ZUFjY291bnQgYnV0dG9uJykub24oJ2NsaWNrJywgdGhpcy5fbG9naW4pO1xuICAgIH0sXG5cbiAgICBfbG9naW46IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdfbG9naW4nKTtcblxuICAgICAgY29uc3QgdXNlclZhbCA9ICQodGhpcykuY2xvc2VzdCgnZm9ybScpLmZpbmQoJ2lucHV0JykudmFsKCk7XG4gICAgICBjb25zdCB1c2VyVmFsT2JqZWN0ID0ge307XG5cbiAgICAgIGlmICh1c2VyVmFsID09PSAnJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHVzZXJWYWxPYmplY3QubmFtZSA9IHVzZXJWYWw7XG5cbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyJywgdXNlclZhbCk7XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBkYXRhOkpTT04uc3RyaW5naWZ5KHVzZXJWYWxPYmplY3QpLFxuICAgICAgICB1cmw6IGBhcGkvdXNlcmAsXG4gICAgICB9KS5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSBvZiB1cGRhdGU6IFwiLHJlc3BvbnNlKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9XCIvaG9tZVwiO1xuICAgICAgfSkuZmFpbChmdW5jdGlvbih4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogXCIseGhyLnJlc3BvbnNlVGV4dClcbiAgICAgICAgcmV0dXJuIHhoci5yZXNwb25zZVRleHQ7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgX2NvdW50OiBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGRlYnVnKSBjb25zb2xlLmxvZygnX2NvdW50Jyk7XG5cbiAgICAgIGNvbnN0IGlkTWFpbkVsZW1lbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJ3VsJykuZGF0YShcImlkXCIpO1xuICAgICAgY29uc3QgaWRNYWluRWxlbWVudE9iamVjdCA9IHt9O1xuICAgICAgY29uc3QgbnVtYmVyUmVmZXJlbmNlID0gJCh0aGlzKS5jbG9zZXN0KCdsaScpLmZpbmQoJy5udW1iZXInKS50ZXh0KCk7XG4gICAgICBjb25zdCBpZEVsZW1lbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykuYXR0cihcImlkXCIpO1xuICAgICAgbGV0IG51bWJlclJlZmVyZW5jZVBhcnNlZCA9IHBhcnNlSW50KG51bWJlclJlZmVyZW5jZSwgMTApO1xuXG4gICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdhZGQnKSkge1xuICAgICAgICArK251bWJlclJlZmVyZW5jZVBhcnNlZDtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCdsaScpLmZpbmQoJy5udW1iZXInKS50ZXh0KG51bWJlclJlZmVyZW5jZVBhcnNlZCk7XG4gICAgICB9XG4gICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdtaW51cycpKSB7XG4gICAgICAgIC0tbnVtYmVyUmVmZXJlbmNlUGFyc2VkO1xuICAgICAgICBpZihudW1iZXJSZWZlcmVuY2VQYXJzZWQgPCAwKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCdsaScpLmZpbmQoJy5udW1iZXInKS50ZXh0KG51bWJlclJlZmVyZW5jZVBhcnNlZCk7XG4gICAgICB9XG5cbiAgICAgIGlkTWFpbkVsZW1lbnRPYmplY3QubnVtYmVyID0gbnVtYmVyUmVmZXJlbmNlUGFyc2VkO1xuICAgICAgaWRNYWluRWxlbWVudE9iamVjdC5uYW1lSWQgPSBpZEVsZW1lbnQ7XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIG1ldGhvZDpcIlBVVFwiLFxuICAgICAgICB1cmw6IGBhcGkvZWxlbWVudC8ke2lkTWFpbkVsZW1lbnR9YCxcbiAgICAgICAgZGF0YVR5cGU6XCJqc29uXCIsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgZGF0YTpKU09OLnN0cmluZ2lmeShpZE1haW5FbGVtZW50T2JqZWN0KVxuICAgICAgfSkuZG9uZShmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2Ugb2YgdXBkYXRlOiBcIixyZXNwb25zZSlcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bil7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IFwiLHhoci5yZXNwb25zZVRleHQpXG4gICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9kZWxldGVFbGVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdfZGVsZXRlRWxlbWVudCcpO1xuXG4gICAgICBjb25zdCBpZE1haW5FbGVtZW50T2JqZWN0ID0ge307XG5cbiAgICAgIGNvbnN0IGlkRWxlbWVudCA9ICQodGhpcykuY2xvc2VzdCgnbGknKS5hdHRyKFwiaWRcIik7XG4gICAgICBjb25zdCBpZE1haW5FbGVtZW50ID0gJCh0aGlzKS5jbG9zZXN0KCd1bCcpLmRhdGEoXCJpZFwiKTtcbiAgICAgICQodGhpcykuY2xvc2VzdCgnbGknKS5yZW1vdmUoKTtcblxuICAgICAgaWRNYWluRWxlbWVudE9iamVjdC5uYW1lSWQgPSBpZEVsZW1lbnQ7XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICAgICAgdXJsOiBgYXBpL2VsZW1lbnQvJHtpZE1haW5FbGVtZW50fWAsXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBkYXRhOkpTT04uc3RyaW5naWZ5KGlkTWFpbkVsZW1lbnRPYmplY3QpLFxuICAgICAgfSkuZG9uZShmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2Ugb2YgdXBkYXRlOiBcIixyZXNwb25zZSlcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bil7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IFwiLHhoci5yZXNwb25zZVRleHQpXG4gICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9nZXRFbGVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdfZ2V0RWxlbWVudCcpO1xuXG4gICAgICBsZXQgdXNlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJyk7XG4gICAgICBsZXQgZHlubmFtaWNFbGVtZW50ID0gJyc7XG4gICAgICBsZXQgZWxlbWVudE1haW5JZDtcblxuICAgICAgaWYgKHVzZXIgPT09ICcnKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKCcvJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB1cmw6IGBhcGkvZWxlbWVudHMvJHt1c2VyfWAsXG4gICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIGVsZW1lbnRNYWluSWQgPSBkYXRhLl9pZDtcblxuICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBkYXRhLm5hbWVzKSB7XG4gICAgICAgICAgICBkeW5uYW1pY0VsZW1lbnQgKz1cbiAgICAgICAgICAgICAgYDxsaSBpZD1cIiR7ZWxlbWVudC5pZH1cIj48YnV0dG9uIGNsYXNzPVwibWludXNcIj4tPC9idXR0b24+PHNwYW4+JHtlbGVtZW50Lm5hbWV9PC9zcGFuPiA8c3BhbiBjbGFzcz1cIm51bWJlclwiPiR7ZWxlbWVudC5udW1iZXJ9PC9zcGFuPiA8YnV0dG9uIGNsYXNzPVwiYWRkXCI+KzwvYnV0dG9uPjwvbGk+YDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkKCcjdmlldycpLmFwcGVuZChgJHtkeW5uYW1pY0VsZW1lbnR9YCk7XG4gICAgICAgICAgJCgnI3ZpZXcnKS5hdHRyKCdkYXRhLWlkJywgZWxlbWVudE1haW5JZClcbiAgICAgICAgfVxuICAgICAgfSkuZmFpbChmdW5jdGlvbih4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKXtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHhoci5yZXNwb25zZUpTT04udXJsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBcIix4aHIucmVzcG9uc2VUZXh0KVxuICAgICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgX2dldEVsZW1lbnRBZG1pbjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGRlYnVnKSBjb25zb2xlLmxvZygnX2dldEVsZW1lbnRBZG1pbicpO1xuXG4gICAgICBjb25zdCB1c2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKTtcbiAgICAgIGxldCBlbGVtZW50c0NhdGVnb3JpZXMgPSBbXTtcbiAgICAgIGxldCBkeW5uYW1pY0VsZW1lbnQgPSAnJztcbiAgICAgIGxldCBlbGVtZW50TWFpbklkO1xuXG4gICAgICBpZiAodXNlciA9PT0gJycpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoJy8nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkLmFqYXgoe1xuICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICB1cmw6IGBhcGkvZWxlbWVudHMvJHt1c2VyfWAsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICBlbGVtZW50TWFpbklkID0gZGF0YS5faWQ7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZGF0YS5uYW1lcykge1xuICAgICAgICAgICAgICBjb25zdCBlbGVtZW50TmFtZSA9IGVsZW1lbnQubmFtZTtcbiAgICAgICAgICAgICAgY29uc3QgZWxlbWVudElkID0gZWxlbWVudC5pZDtcbiAgICAgICAgICAgICAgbGV0IGVsZW1lbnROYW1lVGFibGUgPSBbXTtcbiAgICAgICAgICAgICAgbGV0IGVsZW1lbnRJZFRhYmxlID0gW107XG5cbiAgICAgICAgICAgICAgZWxlbWVudE5hbWVUYWJsZS5wdXNoKGVsZW1lbnROYW1lKTtcbiAgICAgICAgICAgICAgZWxlbWVudElkVGFibGUucHVzaChlbGVtZW50SWQpO1xuXG4gICAgICAgICAgICAgIGVsZW1lbnRzQ2F0ZWdvcmllcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogZWxlbWVudElkLFxuICAgICAgICAgICAgICAgIHRleHQ6IGVsZW1lbnROYW1lXG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGR5bm5hbWljRWxlbWVudCArPVxuICAgICAgICAgICAgICAgIGA8bGkgaWQ9XCIke2VsZW1lbnRJZH1cIj48c3Bhbj4ke2VsZW1lbnROYW1lfTwvc3Bhbj4gPGJ1dHRvbj5TdXBwcmltZXI8L2J1dHRvbj48L2xpPmA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoJyNwcmV2aWV3JykuYXBwZW5kKGAke2R5bm5hbWljRWxlbWVudH1gKTtcbiAgICAgICAgICAgICQoJyNwcmV2aWV3JykuYXR0cignZGF0YS1pZCcsIGVsZW1lbnRNYWluSWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRleHRzID0gZWxlbWVudHNDYXRlZ29yaWVzLm1hcChvID0+IG8udGV4dClcbiAgICAgIGNvbnN0IGVsZW1lbnRzQ2F0ZWdvcmllc1VuaXF1ZVRleHRzID0gZWxlbWVudHNDYXRlZ29yaWVzLmZpbHRlcigoe3RleHR9LCBpbmRleCkgPT4gIXRleHRzLmluY2x1ZGVzKHRleHQsIGluZGV4ICsgMSkpXG5cbiAgICAgICQoXCIjaW5wdXRFbGVtZW50Q2F0ZWdvcnlcIikuc2VsZWN0Mih7XG4gICAgICAgIHRhZ3M6IHRydWUsXG4gICAgICAgIGRhdGE6IGVsZW1lbnRzQ2F0ZWdvcmllc1VuaXF1ZVRleHRzLFxuICAgICAgICBjcmVhdGVUYWc6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICB2YXIgdGVybSA9ICQudHJpbShwYXJhbXMudGVybSk7XG5cbiAgICAgICAgICBpZiAodGVybSA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogdGVybSxcbiAgICAgICAgICAgIHRleHQ6IHRlcm0sXG4gICAgICAgICAgICBuZXdUYWc6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBfYWRkRWxlbWVudDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChkZWJ1ZykgY29uc29sZS5sb2coJ19hZGRFbGVtZW50Jyk7XG5cbiAgICAgIGNvbnN0IHVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpO1xuICAgICAgY29uc3QgZGF0YVNlbGVjdGVkRWxlbWVudHMgPSAkKCcjaW5wdXRFbGVtZW50Q2F0ZWdvcnknKS5zZWxlY3QyKCdkYXRhJyk7XG4gICAgICBjb25zdCBkYXRhUHJlc2VudCA9ICQoJyNwcmV2aWV3IGxpJyk7XG4gICAgICBjb25zdCBjYXRlZ29yaWVzID0gW107XG5cbiAgICAgIGlmICh1c2VyID09PSAnJykge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSgnLycpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZGF0YVNlbGVjdGVkRWxlbWVudHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRhdGFTZWxlY3RlZEVsZW1lbnRzW2pdO1xuICAgICAgICBjb25zdCBlbGVtZW50SWQgPSBlbGVtZW50Ll9yZXN1bHRJZDtcbiAgICAgICAgY29uc3QgZWxlbWVudE5hbWUgPSBlbGVtZW50LnRleHQ7XG5cbiAgICAgICAgY2F0ZWdvcmllcy5wdXNoKHtcbiAgICAgICAgICBpZDogRGF0ZS5ub3coKSxcbiAgICAgICAgICBuYW1lOiBlbGVtZW50TmFtZSxcbiAgICAgICAgICBudW1iZXI6IDBcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgICQoJyNwcmV2aWV3JykuZmluZCgnbGknKS5lYWNoKGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgICAgY29uc3QgaWRJZCA9ICQodGhpcykuYXR0cignaWQnKTtcbiAgICAgICAgY29uc3QgaWROYW1lID0gJCh0aGlzKS5maW5kKCdzcGFuJykudGV4dCgpO1xuXG4gICAgICAgIGNhdGVnb3JpZXMucHVzaCh7XG4gICAgICAgICAgaWQ6IGlkSWQsXG4gICAgICAgICAgbmFtZTogaWROYW1lLFxuICAgICAgICAgIG51bWJlcjogMFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgZWxlbWVudEluZm87XG5cbiAgICAgIGVsZW1lbnRJbmZvID0ge1xuICAgICAgICBjYXRlZ29yaWVzXG4gICAgICB9O1xuXG4gICAgICAkLmFqYXgoe1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgZGF0YTpKU09OLnN0cmluZ2lmeShlbGVtZW50SW5mbyksXG4gICAgICAgIHVybDogYGFwaS9lbGVtZW50LyR7dXNlcn1gLFxuICAgICAgfSkuZG9uZShmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2Ugb2YgdXBkYXRlOiBcIixyZXNwb25zZSlcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bil7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IFwiLHhoci5yZXNwb25zZVRleHQpXG4gICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIEJhc2UuaW5pdCgpO1xufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==