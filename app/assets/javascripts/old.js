jQuery(function() {
   /* var onPopUpShow = function (top) {
        jQuery('body').css(
            {
                position: 'fixed',
                width: '100%',
                top: (top ? -top : 0) + 'px'
            }
        );
        jQuery('html').css({"overflow-y": 'scroll'});
    };*/

    /*var isNotValidItem = function (item) {
        return (!jQuery(item).val() || (jQuery(item).attr('type') == "checkbox" && !jQuery(item).is(':checked')));
    };*/

    /*var validateForm = function (form) {
        var required = jQuery(form).find(':input[required]');
        var isValid = true;
        jQuery.each(required, function (key, val) {
            if(isNotValidItem(this)) {
                if (jQuery(this).parents('md-input-container').length) {
                    jQuery(this).parents('md-input-container').addClass('md-input-invalid');
                } else {
                    jQuery(this).addClass('ng-invalid');
                }
                isValid = false;
            } else {
                jQuery(this).removeClass('ng-invalid');
                if (jQuery(this).parents('md-input-container').length) {
                    jQuery(this).parents('md-input-container').removeClass('md-input-invalid');
                }
            }
        });

        return isValid;
    };
*/
    jQuery('.md-dialog-container').click(function (event) {
        if (!jQuery(event.target).parents('md-dialog').length) {
            jQuery('body').removeAttr("style");
            jQuery('html').removeAttr("style")
            jQuery('.md-dialog-container').hide();
        }
    });
    jQuery('.login-btn').click(function () {
        onPopUpShow();
        openLoginForm();
    });

    jQuery('.success-contact-form-dialog md-dialog-actions button').click(function () {
        jQuery('body').removeAttr("style");
        jQuery('html').removeAttr("style");
        jQuery('.success-contact-form-dialog').hide();
    });



    // signin form
    var input = jQuery('#auth-form md-input-container input');
    input.focus(function () {
        jQuery(this).parent().addClass('md-input-focused');
    });
    input.blur(function () {
        jQuery(this).parent().removeClass('md-input-focused');
        if (jQuery(this).val()) {
            jQuery(this).parent().removeClass('md-input-invalid');
            jQuery(this).parent().addClass('md-input-has-value');
        } else {
            jQuery(this).parent().addClass('md-input-invalid');
            jQuery(this).parent().removeClass('md-input-has-value');
        }
    });
    input.on('input', function () {
        if (jQuery(this).val()) {
            jQuery(this).parent().removeClass('md-input-invalid');
            jQuery(this).parent().addClass('md-input-has-value');
        } else {
            jQuery(this).parent().addClass('md-input-invalid');
            jQuery(this).parent().removeClass('md-input-has-value');
        }
    });

    //contact form

    var contactFormI = jQuery('#contactForm input[required]');
    contactFormI.focus(function () {
        jQuery(this).addClass('md-input-focused');
    });
    contactFormI.blur(function () {
        jQuery(this).removeClass('md-input-focused');
        if (!isNotValidItem(this)) {
            jQuery(this).removeClass('ng-invalid');
            jQuery(this).addClass('md-input-has-value');
        } else {
            jQuery(this).addClass('ng-invalid');
            jQuery(this).removeClass('md-input-has-value');
        }
    });
    contactFormI.on('input', function () {
        if (!isNotValidItem(this)) {
            jQuery(this).removeClass('ng-invalid');
            jQuery(this).addClass('md-input-has-value');
        } else {
            jQuery(this).addClass('ng-invalid');
            jQuery(this).removeClass('md-input-has-value');
        }
    });
    jQuery('#contactForm input[type="checkbox"]').on('change', function () {
        if(jQuery(this).is(':checked')) {
            jQuery(this).removeClass('ng-invalid');
        } else {
            jQuery(this).addClass('ng-invalid');
        }
    });

    jQuery('#auth-form').submit(function (event) {
        event.preventDefault();
        jQuery('#auth-form .md-dialog-content .form-error').hide();
        var data = jQuery("#auth-form").serializeArray();
        var login = data[0].value;
        var password = data[1].value;
        if (!login) {
            jQuery('#auth-form #userPass').parent().addClass('md-input-invalid');
        } else if (!password) {
            jQuery('#auth-form #userName').parent().addClass('md-input-invalid');
        } else {
            jQuery('#auth-form md-input-container').removeClass('md-input-invalid');
            jQuery('.loading-screen').show();
            jQuery.post('/api/auth/login', {login: login, password: password} )
                .done(function (data) {
                    if (data.status == 'error') {
                        jQuery('#auth-form .form-error.error-'+ data.message || 'unknown').show();
                    } else {
                        window.location.replace("/account");
                    }
                })
                .always(function () {
                    jQuery('.loading-screen').hide();
                })
        }
    });

    jQuery('#contactForm').submit(function (event) {
        event.preventDefault();

        var data = jQuery("#contactForm").serializeArray();
        var top = jQuery("body").scrollTop();
        var formData = {};

        jQuery.each(data, function (key, field) {
            formData[field.name] = field.value
        });

        if(validateForm("#contactForm")) {
            var url = formData.contract_type == 'groups' ? 'group-requests' : 'contract-requests';
            jQuery('.loading-screen').show();
            jQuery.post('/api/'+url, {params: formData})
                .done(function (data) {
                    try {
                        ga('send', 'event', 'request-b2b', 'submit-request', formData.contract_type);
                    } catch (e) {

                    }

                    onPopUpShow(top);
                    jQuery('.success-contact-form-dialog').css({top: top});
                    jQuery('.success-contact-form-dialog').show();
                })
                .always(function () {
                    jQuery('.loading-screen').hide();
                })
        }
    });

    // Login form auto pop-up
    if (document.location.search.indexOf('pop_auth=1') > -1) {
        setTimeout(function() {
            jQuery('.login-btn').click();
        }, 1500);
    }

    function openLoginForm() {
        jQuery('#auth-form .md-dialog-content .form-error').hide();
        jQuery('#auth-form #userPass').val('');
        jQuery('#auth-form #userName').val('');
        jQuery('.auth-form-dialog').show();
    }
});
