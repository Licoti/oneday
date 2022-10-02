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