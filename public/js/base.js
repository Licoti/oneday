const debug = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'none';
import 'select2';

export function initHome () {
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