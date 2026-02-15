
    // Use the existing depositForm instead of creating a new form dynamically.
    $(document).ready(function(){
      $('.fi-tile').on('click', function(e){
        e.preventDefault(); // Prevent default link behavior
        var fiid = $(this).attr('fiid');
        // Set the value in the existing hidden input in depositForm
        $('#hiddenFiId').val(fiid);
        // Submit the existing form
        $('#depositForm').submit();
      });
    });
  