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

      if (_getElementAdmin) {
        this._getElementAdmin();
      }

      if (_getElement) {
        this._getElement();
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
        type:"DELETE",
        url: `/element/${idMainElement}`,
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

    _getElement: function () {
      if (debug) console.log('_getElement');
      let dynnamicElement = '';
      let elementMainId;

      $.get('/elements', function (data) {
        console.log('_getElement : data ', data);
        for (let j = 0; j < data.length; j++) {
          const element = data[j];
          const elementNames = element.names;
          elementMainId = element._id;

          for (let j = 0; j < elementNames.length; j++) {
            let elementName = [];
            let elementId = [];
            let elementNumber = [];

            elementName.push(elementNames[j].name);
            elementNumber.push(elementNames[j].number);
            elementId.push(elementNames[j].id);

            dynnamicElement +=
              `<li id="${elementId}"><span>${elementName}</span> <span>${elementNumber}</span></li>`;
          }
        }


        $('#view').append(`${dynnamicElement}`);
        $('#view').attr('data-id', elementMainId)
      });
    },

    _getElementAdmin: function () {
      if (debug) console.log('_getElementAdmin');
      let elementsCategories = [];
      let dynnamicElement = '';
      let elementMainId;

      $.ajax({
        type: "GET",
        url: "/elements",
        async: false,
        success: function(data) {
          console.log('_getElementAdmin : data ', data);
          for (let j = 0; j < data.length; j++) {
            const element = data[j];
            const elementNames = element.names;
            elementMainId = element._id;

            for (let j = 0; j < elementNames.length; j++) {
              const elementName = elementNames[j].name;
              const elementId = elementNames[j].id;
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
          }

          $('#preview').append(`${dynnamicElement}`);
          $('#preview').attr('data-id', elementMainId)
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
        user,
        categories
      };

      $.ajax({
        type:"POST",
        dataType:"json",
        contentType: "application/json",
        data:JSON.stringify(elementInfo),
        url:"/element"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YXNjcmlwdHMvanMvYmFzZS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGNBQWMsS0FBc0MsSUFBSSxDQUErQjtBQUN0RTs7QUFFVjtBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLE1BQU0sQ0FBQztBQUNQLE1BQU0sQ0FBQzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBOztBQUVBLHdCQUF3QixDQUFDO0FBQ3pCLDRCQUE0QixDQUFDO0FBQzdCLE1BQU0sQ0FBQzs7QUFFUDs7QUFFQSxNQUFNLENBQUM7QUFDUDtBQUNBLHlCQUF5QixjQUFjO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTSxDQUFDO0FBQ1A7QUFDQSx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFQSwwQkFBMEIseUJBQXlCO0FBQ25EO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBeUIsVUFBVSxVQUFVLFlBQVksZ0JBQWdCLGNBQWM7QUFDdkY7QUFDQTs7O0FBR0EsUUFBUSxDQUFDLG9CQUFvQixnQkFBZ0I7QUFDN0MsUUFBUSxDQUFDO0FBQ1QsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNLENBQUM7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGlCQUFpQjtBQUMzQztBQUNBO0FBQ0E7O0FBRUEsNEJBQTRCLHlCQUF5QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7O0FBRWY7QUFDQSwyQkFBMkIsVUFBVSxVQUFVLFlBQVk7QUFDM0Q7QUFDQTs7QUFFQSxVQUFVLENBQUMsdUJBQXVCLGdCQUFnQjtBQUNsRCxVQUFVLENBQUM7QUFDWDtBQUNBLE9BQU87O0FBRVA7QUFDQSx3RUFBd0UsS0FBSzs7QUFFN0UsTUFBTSxDQUFDO0FBQ1A7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLENBQUM7O0FBRXRCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLENBQUM7QUFDcEIsbUNBQW1DLENBQUM7QUFDcEMsMEJBQTBCLENBQUM7QUFDM0I7O0FBRUEsc0JBQXNCLGlDQUFpQztBQUN2RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUEsTUFBTSxDQUFDO0FBQ1AscUJBQXFCLENBQUM7QUFDdEIsdUJBQXVCLENBQUM7O0FBRXhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87O0FBRVA7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTSxDQUFDO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Jvb2tub2RlZ2VuZXJhdG9yLy4vcHVibGljL2pzL2Jhc2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZGVidWcgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyB8fCBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ25vbmUnO1xuaW1wb3J0ICdzZWxlY3QyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRIb21lICgpIHtcbiAgY29uc3QgQmFzZSA9IHtcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdCYXNlLWluaXQgIScpO1xuXG4gICAgICBjb25zdCBfZ2V0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3JykgfHwgZmFsc2U7XG4gICAgICBjb25zdCBfZ2V0RWxlbWVudEFkbWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm1CYXNlJykgfHwgZmFsc2U7XG5cbiAgICAgICQoJyNmb3JtQmFzZSBidXR0b24nKS5vbignY2xpY2snLCB0aGlzLl9hZGRFbGVtZW50KTtcbiAgICAgICQoJyNwcmV2aWV3Jykub24oJ2NsaWNrJywgJ2J1dHRvbicsIHRoaXMuX2RlbGV0ZUVsZW1lbnQpO1xuXG4gICAgICBpZiAoX2dldEVsZW1lbnRBZG1pbikge1xuICAgICAgICB0aGlzLl9nZXRFbGVtZW50QWRtaW4oKTtcbiAgICAgIH1cblxuICAgICAgaWYgKF9nZXRFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuX2dldEVsZW1lbnQoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2RlbGV0ZUVsZW1lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChkZWJ1ZykgY29uc29sZS5sb2coJ19kZWxldGVFbGVtZW50Jyk7XG5cbiAgICAgIGNvbnN0IGlkTWFpbkVsZW1lbnRPYmplY3QgPSB7fTtcblxuICAgICAgY29uc3QgaWRFbGVtZW50ID0gJCh0aGlzKS5jbG9zZXN0KCdsaScpLmF0dHIoXCJpZFwiKTtcbiAgICAgIGNvbnN0IGlkTWFpbkVsZW1lbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJ3VsJykuZGF0YShcImlkXCIpO1xuICAgICAgJCh0aGlzKS5jbG9zZXN0KCdsaScpLnJlbW92ZSgpO1xuXG4gICAgICBpZE1haW5FbGVtZW50T2JqZWN0Lm5hbWVJZCA9IGlkRWxlbWVudDtcblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTpcIkRFTEVURVwiLFxuICAgICAgICB1cmw6IGAvZWxlbWVudC8ke2lkTWFpbkVsZW1lbnR9YCxcbiAgICAgICAgZGF0YVR5cGU6XCJqc29uXCIsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgZGF0YTpKU09OLnN0cmluZ2lmeShpZE1haW5FbGVtZW50T2JqZWN0KSxcbiAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIG9mIHVwZGF0ZTogXCIscmVzcG9uc2UpXG4gICAgICB9KS5mYWlsKGZ1bmN0aW9uKHhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBcIix4aHIucmVzcG9uc2VUZXh0KVxuICAgICAgICByZXR1cm4geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBfZ2V0RWxlbWVudDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGRlYnVnKSBjb25zb2xlLmxvZygnX2dldEVsZW1lbnQnKTtcbiAgICAgIGxldCBkeW5uYW1pY0VsZW1lbnQgPSAnJztcbiAgICAgIGxldCBlbGVtZW50TWFpbklkO1xuXG4gICAgICAkLmdldCgnL2VsZW1lbnRzJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ19nZXRFbGVtZW50IDogZGF0YSAnLCBkYXRhKTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXRhLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY29uc3QgZWxlbWVudCA9IGRhdGFbal07XG4gICAgICAgICAgY29uc3QgZWxlbWVudE5hbWVzID0gZWxlbWVudC5uYW1lcztcbiAgICAgICAgICBlbGVtZW50TWFpbklkID0gZWxlbWVudC5faWQ7XG5cbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVsZW1lbnROYW1lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnROYW1lID0gW107XG4gICAgICAgICAgICBsZXQgZWxlbWVudElkID0gW107XG4gICAgICAgICAgICBsZXQgZWxlbWVudE51bWJlciA9IFtdO1xuXG4gICAgICAgICAgICBlbGVtZW50TmFtZS5wdXNoKGVsZW1lbnROYW1lc1tqXS5uYW1lKTtcbiAgICAgICAgICAgIGVsZW1lbnROdW1iZXIucHVzaChlbGVtZW50TmFtZXNbal0ubnVtYmVyKTtcbiAgICAgICAgICAgIGVsZW1lbnRJZC5wdXNoKGVsZW1lbnROYW1lc1tqXS5pZCk7XG5cbiAgICAgICAgICAgIGR5bm5hbWljRWxlbWVudCArPVxuICAgICAgICAgICAgICBgPGxpIGlkPVwiJHtlbGVtZW50SWR9XCI+PHNwYW4+JHtlbGVtZW50TmFtZX08L3NwYW4+IDxzcGFuPiR7ZWxlbWVudE51bWJlcn08L3NwYW4+PC9saT5gO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgJCgnI3ZpZXcnKS5hcHBlbmQoYCR7ZHlubmFtaWNFbGVtZW50fWApO1xuICAgICAgICAkKCcjdmlldycpLmF0dHIoJ2RhdGEtaWQnLCBlbGVtZW50TWFpbklkKVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9nZXRFbGVtZW50QWRtaW46IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChkZWJ1ZykgY29uc29sZS5sb2coJ19nZXRFbGVtZW50QWRtaW4nKTtcbiAgICAgIGxldCBlbGVtZW50c0NhdGVnb3JpZXMgPSBbXTtcbiAgICAgIGxldCBkeW5uYW1pY0VsZW1lbnQgPSAnJztcbiAgICAgIGxldCBlbGVtZW50TWFpbklkO1xuXG4gICAgICAkLmFqYXgoe1xuICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICB1cmw6IFwiL2VsZW1lbnRzXCIsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdfZ2V0RWxlbWVudEFkbWluIDogZGF0YSAnLCBkYXRhKTtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRhdGEubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkYXRhW2pdO1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudE5hbWVzID0gZWxlbWVudC5uYW1lcztcbiAgICAgICAgICAgIGVsZW1lbnRNYWluSWQgPSBlbGVtZW50Ll9pZDtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBlbGVtZW50TmFtZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgZWxlbWVudE5hbWUgPSBlbGVtZW50TmFtZXNbal0ubmFtZTtcbiAgICAgICAgICAgICAgY29uc3QgZWxlbWVudElkID0gZWxlbWVudE5hbWVzW2pdLmlkO1xuICAgICAgICAgICAgICBsZXQgZWxlbWVudE5hbWVUYWJsZSA9IFtdO1xuICAgICAgICAgICAgICBsZXQgZWxlbWVudElkVGFibGUgPSBbXTtcblxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVRhYmxlLnB1c2goZWxlbWVudE5hbWUpO1xuICAgICAgICAgICAgICBlbGVtZW50SWRUYWJsZS5wdXNoKGVsZW1lbnRJZCk7XG5cbiAgICAgICAgICAgICAgZWxlbWVudHNDYXRlZ29yaWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlkOiBlbGVtZW50SWQsXG4gICAgICAgICAgICAgICAgdGV4dDogZWxlbWVudE5hbWVcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgZHlubmFtaWNFbGVtZW50ICs9XG4gICAgICAgICAgICAgICAgYDxsaSBpZD1cIiR7ZWxlbWVudElkfVwiPjxzcGFuPiR7ZWxlbWVudE5hbWV9PC9zcGFuPiA8YnV0dG9uPlN1cHByaW1lcjwvYnV0dG9uPjwvbGk+YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkKCcjcHJldmlldycpLmFwcGVuZChgJHtkeW5uYW1pY0VsZW1lbnR9YCk7XG4gICAgICAgICAgJCgnI3ByZXZpZXcnKS5hdHRyKCdkYXRhLWlkJywgZWxlbWVudE1haW5JZClcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRleHRzID0gZWxlbWVudHNDYXRlZ29yaWVzLm1hcChvID0+IG8udGV4dClcbiAgICAgIGNvbnN0IGVsZW1lbnRzQ2F0ZWdvcmllc1VuaXF1ZVRleHRzID0gZWxlbWVudHNDYXRlZ29yaWVzLmZpbHRlcigoe3RleHR9LCBpbmRleCkgPT4gIXRleHRzLmluY2x1ZGVzKHRleHQsIGluZGV4ICsgMSkpXG5cbiAgICAgICQoXCIjaW5wdXRFbGVtZW50Q2F0ZWdvcnlcIikuc2VsZWN0Mih7XG4gICAgICAgIHRhZ3M6IHRydWUsXG4gICAgICAgIGRhdGE6IGVsZW1lbnRzQ2F0ZWdvcmllc1VuaXF1ZVRleHRzLFxuICAgICAgICBjcmVhdGVUYWc6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICB2YXIgdGVybSA9ICQudHJpbShwYXJhbXMudGVybSk7XG5cbiAgICAgICAgICBpZiAodGVybSA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogdGVybSxcbiAgICAgICAgICAgIHRleHQ6IHRlcm0sXG4gICAgICAgICAgICBuZXdUYWc6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBfYWRkRWxlbWVudDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChkZWJ1ZykgY29uc29sZS5sb2coJ19hZGRFbGVtZW50Jyk7XG5cbiAgICAgIGNvbnN0IHVzZXIgPSAkKCcjdXNlck1vZGVsIGxhYmVsJykuZGF0YSgnbmFtZScpO1xuICAgICAgY29uc3QgZGF0YVNlbGVjdGVkRWxlbWVudHMgPSAkKCcjaW5wdXRFbGVtZW50Q2F0ZWdvcnknKS5zZWxlY3QyKCdkYXRhJyk7XG4gICAgICBjb25zdCBkYXRhUHJlc2VudCA9ICQoJyNwcmV2aWV3IGxpJyk7XG4gICAgICBjb25zdCBjYXRlZ29yaWVzID0gW107XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZGF0YVNlbGVjdGVkRWxlbWVudHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRhdGFTZWxlY3RlZEVsZW1lbnRzW2pdO1xuICAgICAgICBjb25zdCBlbGVtZW50SWQgPSBlbGVtZW50Ll9yZXN1bHRJZDtcbiAgICAgICAgY29uc3QgZWxlbWVudE5hbWUgPSBlbGVtZW50LnRleHQ7XG5cbiAgICAgICAgY2F0ZWdvcmllcy5wdXNoKHtcbiAgICAgICAgICBpZDogZWxlbWVudElkLFxuICAgICAgICAgIG5hbWU6IGVsZW1lbnROYW1lLFxuICAgICAgICAgIG51bWJlcjogMFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgJCgnI3ByZXZpZXcnKS5maW5kKCdsaScpLmVhY2goZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgICBjb25zdCBpZElkID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xuICAgICAgICBjb25zdCBpZE5hbWUgPSAkKHRoaXMpLmZpbmQoJ3NwYW4nKS50ZXh0KCk7XG5cbiAgICAgICAgY2F0ZWdvcmllcy5wdXNoKHtcbiAgICAgICAgICBpZDogaWRJZCxcbiAgICAgICAgICBuYW1lOiBpZE5hbWUsXG4gICAgICAgICAgbnVtYmVyOiAwXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBlbGVtZW50SW5mbztcblxuICAgICAgZWxlbWVudEluZm8gPSB7XG4gICAgICAgIHVzZXIsXG4gICAgICAgIGNhdGVnb3JpZXNcbiAgICAgIH07XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6XCJQT1NUXCIsXG4gICAgICAgIGRhdGFUeXBlOlwianNvblwiLFxuICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGRhdGE6SlNPTi5zdHJpbmdpZnkoZWxlbWVudEluZm8pLFxuICAgICAgICB1cmw6XCIvZWxlbWVudFwiXG4gICAgICB9KS5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSBvZiB1cGRhdGU6IFwiLHJlc3BvbnNlKVxuICAgICAgfSkuZmFpbChmdW5jdGlvbih4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogXCIseGhyLnJlc3BvbnNlVGV4dClcbiAgICAgICAgcmV0dXJuIHhoci5yZXNwb25zZVRleHQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgQmFzZS5pbml0KCk7XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9