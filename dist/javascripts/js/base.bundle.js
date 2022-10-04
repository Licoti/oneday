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

      const user = $('#userModel label').data('name');
      let dynnamicElement = '';
      let elementMainId;

      $.get(`api/elements/${user}`, function (data) {
        if (data) {
          elementMainId = data._id;

          for (const element of data.names) {
            dynnamicElement +=
              `<li id="${element.id}"><button class="minus">-</button><span>${element.name}</span> <span class="number">${element.number}</span> <button class="add">+</button></li>`;
          }

          $('#view').append(`${dynnamicElement}`);
          $('#view').attr('data-id', elementMainId)
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YXNjcmlwdHMvanMvYmFzZS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGNBQWMsS0FBc0MsSUFBSSxDQUErQjtBQUN0RTs7QUFFVjtBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLE1BQU0sQ0FBQztBQUNQLE1BQU0sQ0FBQztBQUNQLE1BQU0sQ0FBQzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUEsNEJBQTRCLENBQUM7QUFDN0I7QUFDQSw4QkFBOEIsQ0FBQztBQUMvQix3QkFBd0IsQ0FBQztBQUN6Qjs7QUFFQSxTQUFTLENBQUM7QUFDVjtBQUNBLFFBQVEsQ0FBQztBQUNUO0FBQ0EsU0FBUyxDQUFDO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLENBQUM7QUFDVDs7QUFFQTtBQUNBOztBQUVBLE1BQU0sQ0FBQztBQUNQO0FBQ0EsNEJBQTRCLGNBQWM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBOztBQUVBOztBQUVBLHdCQUF3QixDQUFDO0FBQ3pCLDRCQUE0QixDQUFDO0FBQzdCLE1BQU0sQ0FBQzs7QUFFUDs7QUFFQSxNQUFNLENBQUM7QUFDUDtBQUNBLDRCQUE0QixjQUFjO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTs7QUFFQSxtQkFBbUIsQ0FBQztBQUNwQjtBQUNBOztBQUVBLE1BQU0sQ0FBQyxxQkFBcUIsS0FBSztBQUNqQztBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBeUIsV0FBVywwQ0FBMEMsYUFBYSwrQkFBK0IsZUFBZTtBQUN6STs7QUFFQSxVQUFVLENBQUMsb0JBQW9CLGdCQUFnQjtBQUMvQyxVQUFVLENBQUM7QUFDWDtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7O0FBRUEsbUJBQW1CLENBQUM7QUFDcEI7QUFDQTtBQUNBOztBQUVBLE1BQU0sQ0FBQztBQUNQO0FBQ0EsNkJBQTZCLEtBQUs7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7QUFFZjtBQUNBLDJCQUEyQixVQUFVLFVBQVUsWUFBWTtBQUMzRDs7QUFFQSxZQUFZLENBQUMsdUJBQXVCLGdCQUFnQjtBQUNwRCxZQUFZLENBQUM7QUFDYjtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBLHdFQUF3RSxLQUFLOztBQUU3RSxNQUFNLENBQUM7QUFDUDtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsQ0FBQzs7QUFFdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsQ0FBQztBQUNwQixtQ0FBbUMsQ0FBQztBQUNwQywwQkFBMEIsQ0FBQztBQUMzQjs7QUFFQSxzQkFBc0IsaUNBQWlDO0FBQ3ZEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQSxNQUFNLENBQUM7QUFDUCxxQkFBcUIsQ0FBQztBQUN0Qix1QkFBdUIsQ0FBQzs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTzs7QUFFUDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTSxDQUFDO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsS0FBSztBQUNqQyxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib29rbm9kZWdlbmVyYXRvci8uL3B1YmxpYy9qcy9iYXNlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGRlYnVnID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgfHwgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdub25lJztcbmltcG9ydCAnc2VsZWN0Mic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0SG9tZSAoKSB7XG4gIGNvbnN0IEJhc2UgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGRlYnVnKSBjb25zb2xlLmxvZygnQmFzZS1pbml0ICEnKTtcblxuICAgICAgY29uc3QgX2dldEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldycpIHx8IGZhbHNlO1xuICAgICAgY29uc3QgX2dldEVsZW1lbnRBZG1pbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtQmFzZScpIHx8IGZhbHNlO1xuXG4gICAgICAkKCcjZm9ybUJhc2UgYnV0dG9uJykub24oJ2NsaWNrJywgdGhpcy5fYWRkRWxlbWVudCk7XG4gICAgICAkKCcjcHJldmlldycpLm9uKCdjbGljaycsICdidXR0b24nLCB0aGlzLl9kZWxldGVFbGVtZW50KTtcbiAgICAgICQoJyN2aWV3Jykub24oJ2NsaWNrJywgJ2J1dHRvbicsIHRoaXMuX2NvdW50KTtcblxuICAgICAgaWYgKF9nZXRFbGVtZW50QWRtaW4pIHtcbiAgICAgICAgdGhpcy5fZ2V0RWxlbWVudEFkbWluKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfZ2V0RWxlbWVudCkge1xuICAgICAgICB0aGlzLl9nZXRFbGVtZW50KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIF9jb3VudDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChkZWJ1ZykgY29uc29sZS5sb2coJ19jb3VudCcpO1xuXG4gICAgICBjb25zdCBpZE1haW5FbGVtZW50ID0gJCh0aGlzKS5jbG9zZXN0KCd1bCcpLmRhdGEoXCJpZFwiKTtcbiAgICAgIGNvbnN0IGlkTWFpbkVsZW1lbnRPYmplY3QgPSB7fTtcbiAgICAgIGNvbnN0IG51bWJlclJlZmVyZW5jZSA9ICQodGhpcykuY2xvc2VzdCgnbGknKS5maW5kKCcubnVtYmVyJykudGV4dCgpO1xuICAgICAgY29uc3QgaWRFbGVtZW50ID0gJCh0aGlzKS5jbG9zZXN0KCdsaScpLmF0dHIoXCJpZFwiKTtcbiAgICAgIGxldCBudW1iZXJSZWZlcmVuY2VQYXJzZWQgPSBwYXJzZUludChudW1iZXJSZWZlcmVuY2UsIDEwKTtcblxuICAgICAgaWYoJCh0aGlzKS5oYXNDbGFzcygnYWRkJykpIHtcbiAgICAgICAgKytudW1iZXJSZWZlcmVuY2VQYXJzZWQ7XG4gICAgICAgICQodGhpcykuY2xvc2VzdCgnbGknKS5maW5kKCcubnVtYmVyJykudGV4dChudW1iZXJSZWZlcmVuY2VQYXJzZWQpO1xuICAgICAgfVxuICAgICAgaWYoJCh0aGlzKS5oYXNDbGFzcygnbWludXMnKSkge1xuICAgICAgICAtLW51bWJlclJlZmVyZW5jZVBhcnNlZDtcbiAgICAgICAgaWYobnVtYmVyUmVmZXJlbmNlUGFyc2VkIDwgMCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgICQodGhpcykuY2xvc2VzdCgnbGknKS5maW5kKCcubnVtYmVyJykudGV4dChudW1iZXJSZWZlcmVuY2VQYXJzZWQpO1xuICAgICAgfVxuXG4gICAgICBpZE1haW5FbGVtZW50T2JqZWN0Lm51bWJlciA9IG51bWJlclJlZmVyZW5jZVBhcnNlZDtcbiAgICAgIGlkTWFpbkVsZW1lbnRPYmplY3QubmFtZUlkID0gaWRFbGVtZW50O1xuXG4gICAgICAkLmFqYXgoe1xuICAgICAgICBtZXRob2Q6XCJQVVRcIixcbiAgICAgICAgdXJsOiBgYXBpL2VsZW1lbnQvJHtpZE1haW5FbGVtZW50fWAsXG4gICAgICAgIGRhdGFUeXBlOlwianNvblwiLFxuICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGRhdGE6SlNPTi5zdHJpbmdpZnkoaWRNYWluRWxlbWVudE9iamVjdClcbiAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIG9mIHVwZGF0ZTogXCIscmVzcG9uc2UpXG4gICAgICB9KS5mYWlsKGZ1bmN0aW9uKHhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBcIix4aHIucmVzcG9uc2VUZXh0KVxuICAgICAgICByZXR1cm4geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBfZGVsZXRlRWxlbWVudDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGRlYnVnKSBjb25zb2xlLmxvZygnX2RlbGV0ZUVsZW1lbnQnKTtcblxuICAgICAgY29uc3QgaWRNYWluRWxlbWVudE9iamVjdCA9IHt9O1xuXG4gICAgICBjb25zdCBpZEVsZW1lbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykuYXR0cihcImlkXCIpO1xuICAgICAgY29uc3QgaWRNYWluRWxlbWVudCA9ICQodGhpcykuY2xvc2VzdCgndWwnKS5kYXRhKFwiaWRcIik7XG4gICAgICAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykucmVtb3ZlKCk7XG5cbiAgICAgIGlkTWFpbkVsZW1lbnRPYmplY3QubmFtZUlkID0gaWRFbGVtZW50O1xuXG4gICAgICAkLmFqYXgoe1xuICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgIHVybDogYGFwaS9lbGVtZW50LyR7aWRNYWluRWxlbWVudH1gLFxuICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgZGF0YTpKU09OLnN0cmluZ2lmeShpZE1haW5FbGVtZW50T2JqZWN0KSxcbiAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIG9mIHVwZGF0ZTogXCIscmVzcG9uc2UpXG4gICAgICB9KS5mYWlsKGZ1bmN0aW9uKHhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBcIix4aHIucmVzcG9uc2VUZXh0KVxuICAgICAgICByZXR1cm4geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBfZ2V0RWxlbWVudDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGRlYnVnKSBjb25zb2xlLmxvZygnX2dldEVsZW1lbnQnKTtcblxuICAgICAgY29uc3QgdXNlciA9ICQoJyN1c2VyTW9kZWwgbGFiZWwnKS5kYXRhKCduYW1lJyk7XG4gICAgICBsZXQgZHlubmFtaWNFbGVtZW50ID0gJyc7XG4gICAgICBsZXQgZWxlbWVudE1haW5JZDtcblxuICAgICAgJC5nZXQoYGFwaS9lbGVtZW50cy8ke3VzZXJ9YCwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICBlbGVtZW50TWFpbklkID0gZGF0YS5faWQ7XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZGF0YS5uYW1lcykge1xuICAgICAgICAgICAgZHlubmFtaWNFbGVtZW50ICs9XG4gICAgICAgICAgICAgIGA8bGkgaWQ9XCIke2VsZW1lbnQuaWR9XCI+PGJ1dHRvbiBjbGFzcz1cIm1pbnVzXCI+LTwvYnV0dG9uPjxzcGFuPiR7ZWxlbWVudC5uYW1lfTwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJudW1iZXJcIj4ke2VsZW1lbnQubnVtYmVyfTwvc3Bhbj4gPGJ1dHRvbiBjbGFzcz1cImFkZFwiPis8L2J1dHRvbj48L2xpPmA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJCgnI3ZpZXcnKS5hcHBlbmQoYCR7ZHlubmFtaWNFbGVtZW50fWApO1xuICAgICAgICAgICQoJyN2aWV3JykuYXR0cignZGF0YS1pZCcsIGVsZW1lbnRNYWluSWQpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBfZ2V0RWxlbWVudEFkbWluOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZGVidWcpIGNvbnNvbGUubG9nKCdfZ2V0RWxlbWVudEFkbWluJyk7XG5cbiAgICAgIGNvbnN0IHVzZXIgPSAkKCcjdXNlck1vZGVsIGxhYmVsJykuZGF0YSgnbmFtZScpO1xuICAgICAgbGV0IGVsZW1lbnRzQ2F0ZWdvcmllcyA9IFtdO1xuICAgICAgbGV0IGR5bm5hbWljRWxlbWVudCA9ICcnO1xuICAgICAgbGV0IGVsZW1lbnRNYWluSWQ7XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIHVybDogYGFwaS9lbGVtZW50cy8ke3VzZXJ9YCxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGVsZW1lbnRNYWluSWQgPSBkYXRhLl9pZDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBkYXRhLm5hbWVzKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnROYW1lID0gZWxlbWVudC5uYW1lO1xuICAgICAgICAgICAgICBjb25zdCBlbGVtZW50SWQgPSBlbGVtZW50LmlkO1xuICAgICAgICAgICAgICBsZXQgZWxlbWVudE5hbWVUYWJsZSA9IFtdO1xuICAgICAgICAgICAgICBsZXQgZWxlbWVudElkVGFibGUgPSBbXTtcblxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVRhYmxlLnB1c2goZWxlbWVudE5hbWUpO1xuICAgICAgICAgICAgICBlbGVtZW50SWRUYWJsZS5wdXNoKGVsZW1lbnRJZCk7XG5cbiAgICAgICAgICAgICAgZWxlbWVudHNDYXRlZ29yaWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlkOiBlbGVtZW50SWQsXG4gICAgICAgICAgICAgICAgdGV4dDogZWxlbWVudE5hbWVcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgZHlubmFtaWNFbGVtZW50ICs9XG4gICAgICAgICAgICAgICAgYDxsaSBpZD1cIiR7ZWxlbWVudElkfVwiPjxzcGFuPiR7ZWxlbWVudE5hbWV9PC9zcGFuPiA8YnV0dG9uPlN1cHByaW1lcjwvYnV0dG9uPjwvbGk+YDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCgnI3ByZXZpZXcnKS5hcHBlbmQoYCR7ZHlubmFtaWNFbGVtZW50fWApO1xuICAgICAgICAgICAgJCgnI3ByZXZpZXcnKS5hdHRyKCdkYXRhLWlkJywgZWxlbWVudE1haW5JZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdGV4dHMgPSBlbGVtZW50c0NhdGVnb3JpZXMubWFwKG8gPT4gby50ZXh0KVxuICAgICAgY29uc3QgZWxlbWVudHNDYXRlZ29yaWVzVW5pcXVlVGV4dHMgPSBlbGVtZW50c0NhdGVnb3JpZXMuZmlsdGVyKCh7dGV4dH0sIGluZGV4KSA9PiAhdGV4dHMuaW5jbHVkZXModGV4dCwgaW5kZXggKyAxKSlcblxuICAgICAgJChcIiNpbnB1dEVsZW1lbnRDYXRlZ29yeVwiKS5zZWxlY3QyKHtcbiAgICAgICAgdGFnczogdHJ1ZSxcbiAgICAgICAgZGF0YTogZWxlbWVudHNDYXRlZ29yaWVzVW5pcXVlVGV4dHMsXG4gICAgICAgIGNyZWF0ZVRhZzogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgIHZhciB0ZXJtID0gJC50cmltKHBhcmFtcy50ZXJtKTtcblxuICAgICAgICAgIGlmICh0ZXJtID09PSAnJykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiB0ZXJtLFxuICAgICAgICAgICAgdGV4dDogdGVybSxcbiAgICAgICAgICAgIG5ld1RhZzogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9hZGRFbGVtZW50OiBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGRlYnVnKSBjb25zb2xlLmxvZygnX2FkZEVsZW1lbnQnKTtcblxuICAgICAgY29uc3QgdXNlciA9ICQoJyN1c2VyTW9kZWwgbGFiZWwnKS5kYXRhKCduYW1lJyk7XG4gICAgICBjb25zdCBkYXRhU2VsZWN0ZWRFbGVtZW50cyA9ICQoJyNpbnB1dEVsZW1lbnRDYXRlZ29yeScpLnNlbGVjdDIoJ2RhdGEnKTtcbiAgICAgIGNvbnN0IGRhdGFQcmVzZW50ID0gJCgnI3ByZXZpZXcgbGknKTtcbiAgICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBbXTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXRhU2VsZWN0ZWRFbGVtZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZGF0YVNlbGVjdGVkRWxlbWVudHNbal07XG4gICAgICAgIGNvbnN0IGVsZW1lbnRJZCA9IGVsZW1lbnQuX3Jlc3VsdElkO1xuICAgICAgICBjb25zdCBlbGVtZW50TmFtZSA9IGVsZW1lbnQudGV4dDtcblxuICAgICAgICBjYXRlZ29yaWVzLnB1c2goe1xuICAgICAgICAgIGlkOiBlbGVtZW50SWQsXG4gICAgICAgICAgbmFtZTogZWxlbWVudE5hbWUsXG4gICAgICAgICAgbnVtYmVyOiAwXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkKCcjcHJldmlldycpLmZpbmQoJ2xpJykuZWFjaChmdW5jdGlvbihpbmRleCl7XG4gICAgICAgIGNvbnN0IGlkSWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XG4gICAgICAgIGNvbnN0IGlkTmFtZSA9ICQodGhpcykuZmluZCgnc3BhbicpLnRleHQoKTtcblxuICAgICAgICBjYXRlZ29yaWVzLnB1c2goe1xuICAgICAgICAgIGlkOiBpZElkLFxuICAgICAgICAgIG5hbWU6IGlkTmFtZSxcbiAgICAgICAgICBudW1iZXI6IDBcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGVsZW1lbnRJbmZvO1xuXG4gICAgICBlbGVtZW50SW5mbyA9IHtcbiAgICAgICAgY2F0ZWdvcmllc1xuICAgICAgfTtcblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGRhdGE6SlNPTi5zdHJpbmdpZnkoZWxlbWVudEluZm8pLFxuICAgICAgICB1cmw6IGBhcGkvZWxlbWVudC8ke3VzZXJ9YCxcbiAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIG9mIHVwZGF0ZTogXCIscmVzcG9uc2UpXG4gICAgICB9KS5mYWlsKGZ1bmN0aW9uKHhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBcIix4aHIucmVzcG9uc2VUZXh0KVxuICAgICAgICByZXR1cm4geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBCYXNlLmluaXQoKTtcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=