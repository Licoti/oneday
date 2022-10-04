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

      $('#formBase button').on('click', this._addElement);
      $('#preview').on('click', 'button', this._deleteElement);
      $('#view').on('click', 'button', this._count);

      if (_getElementAdmin) {
        this._getElementAdmin();
      }

      if (_getElement) {
        this._getElement();
      }
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
        data:JSON.stringify(idMainElementObject),
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

      const user = $('#userModel label').data('name');
      let dynnamicElement = '';
      let elementMainId;

      $.get(`api/elements/${user}`, function (data) {
        elementMainId = data._id;

        for (const element of data.names) {
          dynnamicElement +=
            `<li id="${element.id}"><button class="minus">-</button><span>${element.name}</span> <span class="number">${element.number}</span> <button class="add">+</button></li>`;
        }

        $('#view').append(`${dynnamicElement}`);
        $('#view').attr('data-id', elementMainId)
      });
    },

    _getElementAdmin: function () {
      if (debug) console.log('_getElementAdmin');

      const user = $('#userModel label').data('name');
      let elementsCategories = [];
      let dynnamicElement = '';
      let elementMainId;

      $.ajax({
        type: "GET",
        url: `api/elements/${user}`,
        async: false,
        success: function(data) {
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

      const user = $('#userModel label').data('name');
      const dataSelectedElements = $('#inputElementCategory').select2('data');
      const dataPresent = $('#preview li');
      const categories = [];

      for (let j = 0; j < dataSelectedElements.length; j++) {
        const element = dataSelectedElements[j];
        const elementId = element._resultId;
        const elementName = element.text;

        categories.push({
          id: elementId,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YXNjcmlwdHMvanMvYmFzZS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGNBQWMsS0FBc0MsSUFBSSxDQUErQjtBQUN0RTs7QUFFVjtBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLE1BQU0sQ0FBQztBQUNQLE1BQU0sQ0FBQztBQUNQLE1BQU0sQ0FBQzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUEsNEJBQTRCLENBQUM7QUFDN0I7QUFDQSw4QkFBOEIsQ0FBQztBQUMvQix3QkFBd0IsQ0FBQztBQUN6Qjs7QUFFQSxTQUFTLENBQUM7QUFDVjtBQUNBLFFBQVEsQ0FBQztBQUNUO0FBQ0EsU0FBUyxDQUFDO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLENBQUM7QUFDVDs7QUFFQTtBQUNBOztBQUVBLE1BQU0sQ0FBQztBQUNQO0FBQ0EsNEJBQTRCLGNBQWM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBOztBQUVBOztBQUVBLHdCQUF3QixDQUFDO0FBQ3pCLDRCQUE0QixDQUFDO0FBQzdCLE1BQU0sQ0FBQzs7QUFFUDs7QUFFQSxNQUFNLENBQUM7QUFDUDtBQUNBLDRCQUE0QixjQUFjO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTs7QUFFQSxtQkFBbUIsQ0FBQztBQUNwQjtBQUNBOztBQUVBLE1BQU0sQ0FBQyxxQkFBcUIsS0FBSztBQUNqQzs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLFdBQVcsMENBQTBDLGFBQWEsK0JBQStCLGVBQWU7QUFDdkk7O0FBRUEsUUFBUSxDQUFDLG9CQUFvQixnQkFBZ0I7QUFDN0MsUUFBUSxDQUFDO0FBQ1QsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTs7QUFFQSxtQkFBbUIsQ0FBQztBQUNwQjtBQUNBO0FBQ0E7O0FBRUEsTUFBTSxDQUFDO0FBQ1A7QUFDQSw2QkFBNkIsS0FBSztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBLHlCQUF5QixVQUFVLFVBQVUsWUFBWTtBQUN6RDs7QUFFQSxVQUFVLENBQUMsdUJBQXVCLGdCQUFnQjtBQUNsRCxVQUFVLENBQUM7QUFDWDtBQUNBLE9BQU87O0FBRVA7QUFDQSx3RUFBd0UsS0FBSzs7QUFFN0UsTUFBTSxDQUFDO0FBQ1A7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLENBQUM7O0FBRXRCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLENBQUM7QUFDcEIsbUNBQW1DLENBQUM7QUFDcEMsMEJBQTBCLENBQUM7QUFDM0I7O0FBRUEsc0JBQXNCLGlDQUFpQztBQUN2RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUEsTUFBTSxDQUFDO0FBQ1AscUJBQXFCLENBQUM7QUFDdEIsdUJBQXVCLENBQUM7O0FBRXhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87O0FBRVA7O0FBRUE7QUFDQTtBQUNBOztBQUVBLE1BQU0sQ0FBQztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLEtBQUs7QUFDakMsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYm9va25vZGVnZW5lcmF0b3IvLi9wdWJsaWMvanMvYmFzZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkZWJ1ZyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnIHx8IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnbm9uZSc7XG5pbXBvcnQgJ3NlbGVjdDInO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdEhvbWUgKCkge1xuICBjb25zdCBCYXNlID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChkZWJ1ZykgY29uc29sZS5sb2coJ0Jhc2UtaW5pdCAhJyk7XG5cbiAgICAgIGNvbnN0IF9nZXRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXcnKSB8fCBmYWxzZTtcbiAgICAgIGNvbnN0IF9nZXRFbGVtZW50QWRtaW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybUJhc2UnKSB8fCBmYWxzZTtcblxuICAgICAgJCgnI2Zvcm1CYXNlIGJ1dHRvbicpLm9uKCdjbGljaycsIHRoaXMuX2FkZEVsZW1lbnQpO1xuICAgICAgJCgnI3ByZXZpZXcnKS5vbignY2xpY2snLCAnYnV0dG9uJywgdGhpcy5fZGVsZXRlRWxlbWVudCk7XG4gICAgICAkKCcjdmlldycpLm9uKCdjbGljaycsICdidXR0b24nLCB0aGlzLl9jb3VudCk7XG5cbiAgICAgIGlmIChfZ2V0RWxlbWVudEFkbWluKSB7XG4gICAgICAgIHRoaXMuX2dldEVsZW1lbnRBZG1pbigpO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2dldEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5fZ2V0RWxlbWVudCgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfY291bnQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdfY291bnQnKTtcblxuICAgICAgY29uc3QgaWRNYWluRWxlbWVudCA9ICQodGhpcykuY2xvc2VzdCgndWwnKS5kYXRhKFwiaWRcIik7XG4gICAgICBjb25zdCBpZE1haW5FbGVtZW50T2JqZWN0ID0ge307XG4gICAgICBjb25zdCBudW1iZXJSZWZlcmVuY2UgPSAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykuZmluZCgnLm51bWJlcicpLnRleHQoKTtcbiAgICAgIGNvbnN0IGlkRWxlbWVudCA9ICQodGhpcykuY2xvc2VzdCgnbGknKS5hdHRyKFwiaWRcIik7XG4gICAgICBsZXQgbnVtYmVyUmVmZXJlbmNlUGFyc2VkID0gcGFyc2VJbnQobnVtYmVyUmVmZXJlbmNlLCAxMCk7XG5cbiAgICAgIGlmKCQodGhpcykuaGFzQ2xhc3MoJ2FkZCcpKSB7XG4gICAgICAgICsrbnVtYmVyUmVmZXJlbmNlUGFyc2VkO1xuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykuZmluZCgnLm51bWJlcicpLnRleHQobnVtYmVyUmVmZXJlbmNlUGFyc2VkKTtcbiAgICAgIH1cbiAgICAgIGlmKCQodGhpcykuaGFzQ2xhc3MoJ21pbnVzJykpIHtcbiAgICAgICAgLS1udW1iZXJSZWZlcmVuY2VQYXJzZWQ7XG4gICAgICAgIGlmKG51bWJlclJlZmVyZW5jZVBhcnNlZCA8IDApIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykuZmluZCgnLm51bWJlcicpLnRleHQobnVtYmVyUmVmZXJlbmNlUGFyc2VkKTtcbiAgICAgIH1cblxuICAgICAgaWRNYWluRWxlbWVudE9iamVjdC5udW1iZXIgPSBudW1iZXJSZWZlcmVuY2VQYXJzZWQ7XG4gICAgICBpZE1haW5FbGVtZW50T2JqZWN0Lm5hbWVJZCA9IGlkRWxlbWVudDtcblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgbWV0aG9kOlwiUFVUXCIsXG4gICAgICAgIHVybDogYGFwaS9lbGVtZW50LyR7aWRNYWluRWxlbWVudH1gLFxuICAgICAgICBkYXRhVHlwZTpcImpzb25cIixcbiAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBkYXRhOkpTT04uc3RyaW5naWZ5KGlkTWFpbkVsZW1lbnRPYmplY3QpLFxuICAgICAgfSkuZG9uZShmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2Ugb2YgdXBkYXRlOiBcIixyZXNwb25zZSlcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bil7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IFwiLHhoci5yZXNwb25zZVRleHQpXG4gICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9kZWxldGVFbGVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdfZGVsZXRlRWxlbWVudCcpO1xuXG4gICAgICBjb25zdCBpZE1haW5FbGVtZW50T2JqZWN0ID0ge307XG5cbiAgICAgIGNvbnN0IGlkRWxlbWVudCA9ICQodGhpcykuY2xvc2VzdCgnbGknKS5hdHRyKFwiaWRcIik7XG4gICAgICBjb25zdCBpZE1haW5FbGVtZW50ID0gJCh0aGlzKS5jbG9zZXN0KCd1bCcpLmRhdGEoXCJpZFwiKTtcbiAgICAgICQodGhpcykuY2xvc2VzdCgnbGknKS5yZW1vdmUoKTtcblxuICAgICAgaWRNYWluRWxlbWVudE9iamVjdC5uYW1lSWQgPSBpZEVsZW1lbnQ7XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICAgICAgdXJsOiBgYXBpL2VsZW1lbnQvJHtpZE1haW5FbGVtZW50fWAsXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBkYXRhOkpTT04uc3RyaW5naWZ5KGlkTWFpbkVsZW1lbnRPYmplY3QpLFxuICAgICAgfSkuZG9uZShmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2Ugb2YgdXBkYXRlOiBcIixyZXNwb25zZSlcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bil7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IFwiLHhoci5yZXNwb25zZVRleHQpXG4gICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9nZXRFbGVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdfZ2V0RWxlbWVudCcpO1xuXG4gICAgICBjb25zdCB1c2VyID0gJCgnI3VzZXJNb2RlbCBsYWJlbCcpLmRhdGEoJ25hbWUnKTtcbiAgICAgIGxldCBkeW5uYW1pY0VsZW1lbnQgPSAnJztcbiAgICAgIGxldCBlbGVtZW50TWFpbklkO1xuXG4gICAgICAkLmdldChgYXBpL2VsZW1lbnRzLyR7dXNlcn1gLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBlbGVtZW50TWFpbklkID0gZGF0YS5faWQ7XG5cbiAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGRhdGEubmFtZXMpIHtcbiAgICAgICAgICBkeW5uYW1pY0VsZW1lbnQgKz1cbiAgICAgICAgICAgIGA8bGkgaWQ9XCIke2VsZW1lbnQuaWR9XCI+PGJ1dHRvbiBjbGFzcz1cIm1pbnVzXCI+LTwvYnV0dG9uPjxzcGFuPiR7ZWxlbWVudC5uYW1lfTwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJudW1iZXJcIj4ke2VsZW1lbnQubnVtYmVyfTwvc3Bhbj4gPGJ1dHRvbiBjbGFzcz1cImFkZFwiPis8L2J1dHRvbj48L2xpPmA7XG4gICAgICAgIH1cblxuICAgICAgICAkKCcjdmlldycpLmFwcGVuZChgJHtkeW5uYW1pY0VsZW1lbnR9YCk7XG4gICAgICAgICQoJyN2aWV3JykuYXR0cignZGF0YS1pZCcsIGVsZW1lbnRNYWluSWQpXG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgX2dldEVsZW1lbnRBZG1pbjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGRlYnVnKSBjb25zb2xlLmxvZygnX2dldEVsZW1lbnRBZG1pbicpO1xuXG4gICAgICBjb25zdCB1c2VyID0gJCgnI3VzZXJNb2RlbCBsYWJlbCcpLmRhdGEoJ25hbWUnKTtcbiAgICAgIGxldCBlbGVtZW50c0NhdGVnb3JpZXMgPSBbXTtcbiAgICAgIGxldCBkeW5uYW1pY0VsZW1lbnQgPSAnJztcbiAgICAgIGxldCBlbGVtZW50TWFpbklkO1xuXG4gICAgICAkLmFqYXgoe1xuICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICB1cmw6IGBhcGkvZWxlbWVudHMvJHt1c2VyfWAsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGVsZW1lbnRNYWluSWQgPSBkYXRhLl9pZDtcbiAgICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZGF0YS5uYW1lcykge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudE5hbWUgPSBlbGVtZW50Lm5hbWU7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50SWQgPSBlbGVtZW50LmlkO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnROYW1lVGFibGUgPSBbXTtcbiAgICAgICAgICAgIGxldCBlbGVtZW50SWRUYWJsZSA9IFtdO1xuXG4gICAgICAgICAgICBlbGVtZW50TmFtZVRhYmxlLnB1c2goZWxlbWVudE5hbWUpO1xuICAgICAgICAgICAgZWxlbWVudElkVGFibGUucHVzaChlbGVtZW50SWQpO1xuXG4gICAgICAgICAgICBlbGVtZW50c0NhdGVnb3JpZXMucHVzaCh7XG4gICAgICAgICAgICAgIGlkOiBlbGVtZW50SWQsXG4gICAgICAgICAgICAgIHRleHQ6IGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZHlubmFtaWNFbGVtZW50ICs9XG4gICAgICAgICAgICAgIGA8bGkgaWQ9XCIke2VsZW1lbnRJZH1cIj48c3Bhbj4ke2VsZW1lbnROYW1lfTwvc3Bhbj4gPGJ1dHRvbj5TdXBwcmltZXI8L2J1dHRvbj48L2xpPmA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJCgnI3ByZXZpZXcnKS5hcHBlbmQoYCR7ZHlubmFtaWNFbGVtZW50fWApO1xuICAgICAgICAgICQoJyNwcmV2aWV3JykuYXR0cignZGF0YS1pZCcsIGVsZW1lbnRNYWluSWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdGV4dHMgPSBlbGVtZW50c0NhdGVnb3JpZXMubWFwKG8gPT4gby50ZXh0KVxuICAgICAgY29uc3QgZWxlbWVudHNDYXRlZ29yaWVzVW5pcXVlVGV4dHMgPSBlbGVtZW50c0NhdGVnb3JpZXMuZmlsdGVyKCh7dGV4dH0sIGluZGV4KSA9PiAhdGV4dHMuaW5jbHVkZXModGV4dCwgaW5kZXggKyAxKSlcblxuICAgICAgJChcIiNpbnB1dEVsZW1lbnRDYXRlZ29yeVwiKS5zZWxlY3QyKHtcbiAgICAgICAgdGFnczogdHJ1ZSxcbiAgICAgICAgZGF0YTogZWxlbWVudHNDYXRlZ29yaWVzVW5pcXVlVGV4dHMsXG4gICAgICAgIGNyZWF0ZVRhZzogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgIHZhciB0ZXJtID0gJC50cmltKHBhcmFtcy50ZXJtKTtcblxuICAgICAgICAgIGlmICh0ZXJtID09PSAnJykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiB0ZXJtLFxuICAgICAgICAgICAgdGV4dDogdGVybSxcbiAgICAgICAgICAgIG5ld1RhZzogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9hZGRFbGVtZW50OiBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGRlYnVnKSBjb25zb2xlLmxvZygnX2FkZEVsZW1lbnQnKTtcblxuICAgICAgY29uc3QgdXNlciA9ICQoJyN1c2VyTW9kZWwgbGFiZWwnKS5kYXRhKCduYW1lJyk7XG4gICAgICBjb25zdCBkYXRhU2VsZWN0ZWRFbGVtZW50cyA9ICQoJyNpbnB1dEVsZW1lbnRDYXRlZ29yeScpLnNlbGVjdDIoJ2RhdGEnKTtcbiAgICAgIGNvbnN0IGRhdGFQcmVzZW50ID0gJCgnI3ByZXZpZXcgbGknKTtcbiAgICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBbXTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXRhU2VsZWN0ZWRFbGVtZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZGF0YVNlbGVjdGVkRWxlbWVudHNbal07XG4gICAgICAgIGNvbnN0IGVsZW1lbnRJZCA9IGVsZW1lbnQuX3Jlc3VsdElkO1xuICAgICAgICBjb25zdCBlbGVtZW50TmFtZSA9IGVsZW1lbnQudGV4dDtcblxuICAgICAgICBjYXRlZ29yaWVzLnB1c2goe1xuICAgICAgICAgIGlkOiBlbGVtZW50SWQsXG4gICAgICAgICAgbmFtZTogZWxlbWVudE5hbWUsXG4gICAgICAgICAgbnVtYmVyOiAwXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkKCcjcHJldmlldycpLmZpbmQoJ2xpJykuZWFjaChmdW5jdGlvbihpbmRleCl7XG4gICAgICAgIGNvbnN0IGlkSWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XG4gICAgICAgIGNvbnN0IGlkTmFtZSA9ICQodGhpcykuZmluZCgnc3BhbicpLnRleHQoKTtcblxuICAgICAgICBjYXRlZ29yaWVzLnB1c2goe1xuICAgICAgICAgIGlkOiBpZElkLFxuICAgICAgICAgIG5hbWU6IGlkTmFtZSxcbiAgICAgICAgICBudW1iZXI6IDBcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGVsZW1lbnRJbmZvO1xuXG4gICAgICBlbGVtZW50SW5mbyA9IHtcbiAgICAgICAgY2F0ZWdvcmllc1xuICAgICAgfTtcblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGRhdGE6SlNPTi5zdHJpbmdpZnkoZWxlbWVudEluZm8pLFxuICAgICAgICB1cmw6IGBhcGkvZWxlbWVudC8ke3VzZXJ9YCxcbiAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIG9mIHVwZGF0ZTogXCIscmVzcG9uc2UpXG4gICAgICB9KS5mYWlsKGZ1bmN0aW9uKHhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBcIix4aHIucmVzcG9uc2VUZXh0KVxuICAgICAgICByZXR1cm4geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBCYXNlLmluaXQoKTtcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=