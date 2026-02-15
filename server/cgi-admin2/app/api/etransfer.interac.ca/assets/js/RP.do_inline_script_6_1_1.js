$(document).prop('title', $($.parseHTML('Deposit your INTERAC e-Transfer ')).text());
       	function submitForm(){
			var form = document.deposit;
			form.submit();
		}
        $(document).ready(function() {
            $(".other-option-link").click(function(){
            	//console.log("other-option-link pushed");
		       	self.location = 'standardDeposit.do?type=bank';
				//return false;
            });
       	});