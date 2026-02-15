/**
* Created by abed on 10/09/19.
*/

document.addEventListener('DOMContentLoaded', function() {
	window.MP = window.MP || {};

	$('.password-show-button').click(function () {
		var $showPasswordButton = $(this)
		var $passwordField = $showPasswordButton.siblings('input')
		if ($passwordField.attr('type') === 'password') {
			showPassword($showPasswordButton, $passwordField)
		} else {
			hidePassword($showPasswordButton, $passwordField)
		}
	});

	$('#user-password').bind('copy cut', function(e) {
		e.preventDefault();
	});

	// Reset show button state to hidden on submit
	$('#signon-button').click(function () {
		var $showPasswordButton = $('.password-show-button')
		var $passwordField = $showPasswordButton.siblings('input')
		hidePassword($showPasswordButton, $passwordField)
	});

	function showPassword($showButton, $inputField) {
		$inputField.attr('type', 'text');
		$showButton.children('img').attr('src', 'doc/images/common/ui-eye.png')
		$showButton.attr('aria-pressed', 'true');
	}

	function hidePassword($showButton, $inputField) {
		$inputField.attr('type', 'password');
		$showButton.children('img').attr('src', 'doc/images/common/ui-eye_closed.png')
		$showButton.attr('aria-pressed', 'false');
	}

});
