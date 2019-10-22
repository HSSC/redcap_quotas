$(document).ready(function() {
  var $modal = $('#external-modules-configure-modal');
  $modal.on('show.bs.modal', function() {

    // Making sure we are overriding this modules's modal only.
    if ($(this).data('module') !== quotaConfigSettings.modulePrefix) {
        return;
    }

    console.log(quotaConfigSettings);
    console.log(quotaConfigFields);

    $(document).on('change', "select[name*='field-name']", function() {
      selectedVal = $(this).val();
      if (quotaConfigFields.hasOwnProperty(selectedVal)) {
        inputTd = $(this).closest("tr").next("tr").find("td.external-modules-input-td")
        oldInput = inputTd.find("input, select, textarea");

        console.log("Input TD: ", inputTd);
        console.log("Selected Val: ", selectedVal);
        console.log("Config for Val: ", quotaConfigFields[selectedVal]);

        // dropdowns and radio buttons
        if (['dropdown', 'radio'].includes(quotaConfigFields[selectedVal].field_type)) {
          options = quotaConfigFields[selectedVal].select_choices_or_calculations.split(" | ");
          console.log("Need to convert to select");
          console.log("Options for Select: ", options);

          newSelect = '<select class="' + oldInput.attr('class') + '" name="' + oldInput.attr('name') + '">';

          $.each(options, function(index, value) {
            option = value.split(", ");
            newSelect += '<option value=' + option[0] + '>' + option[1] + '</option>';
          });
          newSelect += '</select>';

          oldInput.replaceWith(newSelect);
        }

        // text, notes, and calculated fields
        if (['calc', 'text', 'notes'].includes(quotaConfigFields[selectedVal].field_type)) {
          console.log("Need to convert to input");

          newInput = '<input type="text" class="' + oldInput.attr('class') + '" name="' + oldInput.attr('name') + '">';
          oldInput.replaceWith(newInput);
        }
      }
    });
  });
});
