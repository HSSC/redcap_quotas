setTimeout(function() {
  $(function() {

    function enforceQuota(e) {
      $failed_data_count_check = false;
      $form_data = $('form').serialize() + '&event_id=' + event_id;

      $.get({
        url: quotaEnforcementSettings.url,
        async: false,
        data: $form_data,
        success: function(data) {
          data = JSON.parse(data);
          failed_data_count_check = data.failed_data_check_count;
          block_number = data.block_number;
          eligibility_message = data.eligibility_message;
          set_confirmed_enrollment = data.set_confirmed_enrollment;

          console.log(failed_data_count_check);
          console.log(block_number);

          //$message = failed_data_count_check ? quotaEnforcementSettings['rejected'] : quotaEnforcementSettings['accepted'];
          $message = eligibility_message ? quotaEnforcementSettings['eligibility_message'] : failed_data_count_check ? quotaEnforcementSettings['rejected'] : quotaEnforcementSettings['accepted'];
          $("#quota-modal .modal-body").html($message);
          $('#quota-modal').modal('show');

          if (failed_data_count_check) {
            // Set passed_quota_check to false
            $("#" + quotaEnforcementSettings['passed_quota_check'] + "-tr .data :input").val(0);
          }
          else {
            // Set passed_quota_check to true
            $("#" + quotaEnforcementSettings['passed_quota_check'] + "-tr .data :input").val(1);
          }

          // Set confirmed_enrollment to true if the quota is met and enrolled_confirmed = true
          if(!failed_data_count_check && set_confirmed_enrollment) {
            $("#" + quotaEnforcementSettings['confirmed_enrollment'] + "-tr .data :input").val(1);
          }


          $("#block_number-tr .data :input").val(block_number);

          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          $('#quota-modal').off('hidden.bs.modal');
          $('#quota-modal').on('hidden.bs.modal', function (e2) {
            dataEntrySubmit(e.target.id);
          });
        }
      });
    }

    var submitBtns = $("[id^=submit-btn-save], [name^=submit-btn-save]");

    submitBtns.prop("onclick", null).off("click");
    submitBtns.each((i, elt) => {
      elt.onclick = enforceQuota;
    });
  });
}, 0);
