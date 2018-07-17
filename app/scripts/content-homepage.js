//Lazy Load
var windowWidth = $(window).width();
if (windowWidth < 768  ) {
    lazyLoadImage('img.visible-xs');
} else if (windowWidth >= 768) {
    lazyLoadImage('img.hidden-xs');
    lazyLoadImage('img.visible-lg');
}
lazyLoadImage('img.visible-all');
function lazyLoadImage(responsiveClass) {
    [].forEach.call(document.querySelectorAll(responsiveClass), function(img) {
    	if(img.getAttribute('data-src') != null) {
    		img.setAttribute('src', img.getAttribute('data-src'));
			img.onload = function() {
				img.removeAttribute('data-src');
			}
		};
    });
}
//Signup Form
AddressHelper = {
    validateEmailAddressNew: function(a) {
        var a = document.forms[a];
        var b = [];
        b.storeId = this.storeId;
        b.catalogId = this.catalogId;
        b.langId = this.langId;
        b.email1 = a.email1.value;
        b.isMarketing = true;
        cursor_wait();
        wc.service.getServiceById("AjaxQASEmailValidateNew").formId = a.id;
        wc.service.invoke("AjaxQASEmailValidateNew", b);
    }
}
dojo.require("wc.service.common");
ServicesDeclarationJS = {
    langId: "-1",
    storeId: "",
    catalogId: "",
    setCommonParameters: function(c, a, b) {
        this.langId = c;
        this.storeId = a;
        this.catalogId = b
    }
};
wc.service.declare({
    id: "AjaxQASEmailValidateNew",
    actionId: "AjaxQASEmailValidate",
    url: getAbsoluteURL() + "AjaxQASEmailValidateCmd",
    formId: "",
    successHandler: function(a) {
        if (a.isValidEmail) {
            dojo.byId("mailResponse").value = "success";
            showMarketingSuccessDiv([{
                id: "regAddForm_email1"
            }])
        } else {
            showMarketingErrorDiv([{
                id: "regAddForm_email1",
                errorType: "invalidFormat"
            }]);
            dojo.byId("mailResponse").value = "fail"
        }
        if (a.qasEmailStatus) {
            dojo.byId("qasEmailStatus").value = a.qasEmailStatus
        } else {
            dojo.byId("qasEmailStatus").value = "99"
        }
        cursor_clear()
    },
    failureHandler: function(a) {
        if (!a.isValidEmail) {
            showMarketingErrorDiv([{
                id: "regAddForm_email1",
                errorType: "invalidFormat"
            }]);
            dojo.byId("mailResponse").value = "fail"
        }
        dojo.byId("qasEmailStatus").value = "99";
        cursor_clear()
    }
});
// Validator.js
+function(a){"use strict";function b(b){return b.is('[type="checkbox"]')?b.prop("checked"):b.is('[type="radio"]')?!!a('[name="'+b.attr("name")+'"]:checked').length:b.val()}function c(b){return this.each(function(){var c=a(this),e=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b),f=c.data("bs.validator");(f||"destroy"!=b)&&(f||c.data("bs.validator",f=new d(this,e)),"string"==typeof b&&f[b]())})}var d=function(c,e){this.options=e,this.validators=a.extend({},d.VALIDATORS,e.custom),this.$element=a(c),this.$btn=a('button[type="submit"], input[type="submit"]').filter('[form="'+this.$element.attr("id")+'"]').add(this.$element.find('input[type="submit"], button[type="submit"]')),this.update(),this.$element.on("input.bs.validator change.bs.validator focusout.bs.validator",a.proxy(this.onInput,this)),this.$element.on("submit.bs.validator",a.proxy(this.onSubmit,this)),this.$element.on("reset.bs.validator",a.proxy(this.reset,this)),this.$element.find("[data-match]").each(function(){var c=a(this),d=c.data("match");a(d).on("input.bs.validator",function(){b(c)&&c.trigger("input.bs.validator")})}),this.$inputs.filter(function(){return b(a(this))}).trigger("focusout"),this.$element.attr("novalidate",!0),this.toggleSubmit()};d.VERSION="0.11.5",d.INPUT_SELECTOR=':input:not([type="hidden"], [type="submit"], [type="reset"], button)',d.FOCUS_OFFSET=20,d.DEFAULTS={delay:500,html:!1,disable:!0,focus:!0,custom:{},errors:{match:"Does not match",minlength:"Not long enough"},feedback:{success:"glyphicon-ok",error:"glyphicon-remove"}},d.VALIDATORS={"native":function(a){var b=a[0];return b.checkValidity?!b.checkValidity()&&!b.validity.valid&&(b.validationMessage||"error!"):void 0},match:function(b){var c=b.data("match");return b.val()!==a(c).val()&&d.DEFAULTS.errors.match},minlength:function(a){var b=a.data("minlength");return a.val().length<b&&d.DEFAULTS.errors.minlength}},d.prototype.update=function(){return this.$inputs=this.$element.find(d.INPUT_SELECTOR).add(this.$element.find('[data-validate="true"]')).not(this.$element.find('[data-validate="false"]')),this},d.prototype.onInput=function(b){var c=this,d=a(b.target),e="focusout"!==b.type;this.$inputs.is(d)&&this.validateInput(d,e).done(function(){c.toggleSubmit()})},d.prototype.validateInput=function(c,d){var e=(b(c),c.data("bs.validator.errors"));c.is('[type="radio"]')&&(c=this.$element.find('input[name="'+c.attr("name")+'"]'));var f=a.Event("validate.bs.validator",{relatedTarget:c[0]});if(this.$element.trigger(f),!f.isDefaultPrevented()){var g=this;return this.runValidators(c).done(function(b){c.data("bs.validator.errors",b),b.length?d?g.defer(c,g.showErrors):g.showErrors(c):g.clearErrors(c),e&&b.toString()===e.toString()||(f=b.length?a.Event("invalid.bs.validator",{relatedTarget:c[0],detail:b}):a.Event("valid.bs.validator",{relatedTarget:c[0],detail:e}),g.$element.trigger(f)),g.toggleSubmit(),g.$element.trigger(a.Event("validated.bs.validator",{relatedTarget:c[0]}))})}},d.prototype.runValidators=function(c){function d(a){return c.data(a+"-error")}function e(){var a=c[0].validity;return a.typeMismatch?c.data("type-error"):a.patternMismatch?c.data("pattern-error"):a.stepMismatch?c.data("step-error"):a.rangeOverflow?c.data("max-error"):a.rangeUnderflow?c.data("min-error"):a.valueMissing?c.data("required-error"):null}function f(){return c.data("error")}function g(a){return d(a)||e()||f()}var h=[],i=a.Deferred();return c.data("bs.validator.deferred")&&c.data("bs.validator.deferred").reject(),c.data("bs.validator.deferred",i),a.each(this.validators,a.proxy(function(a,d){var e=null;(b(c)||c.attr("required"))&&(c.data(a)||"native"==a)&&(e=d.call(this,c))&&(e=g(a)||e,!~h.indexOf(e)&&h.push(e))},this)),!h.length&&b(c)&&c.data("remote")?this.defer(c,function(){var d={};d[c.attr("name")]=b(c),a.get(c.data("remote"),d).fail(function(a,b,c){h.push(g("remote")||c)}).always(function(){i.resolve(h)})}):i.resolve(h),i.promise()},d.prototype.validate=function(){var b=this;return a.when(this.$inputs.map(function(){return b.validateInput(a(this),!1)})).then(function(){b.toggleSubmit(),b.focusError()}),this},d.prototype.focusError=function(){if(this.options.focus){var b=a(".has-error:first :input");0!==b.length&&(a("html, body").animate({scrollTop:b.offset().top-d.FOCUS_OFFSET},250),b.focus())}},d.prototype.showErrors=function(b){var c=this.options.html?"html":"text",d=b.data("bs.validator.errors"),e=b.closest(".form-group"),f=e.find(".help-block.with-errors"),g=e.find(".form-control-feedback");d.length&&(d=a("<ul/>").addClass("list-unstyled").append(a.map(d,function(b){return a("<li/>")[c](b)})),void 0===f.data("bs.validator.originalContent")&&f.data("bs.validator.originalContent",f.html()),f.empty().append(d),e.addClass("has-error has-danger"),e.hasClass("has-feedback")&&g.removeClass(this.options.feedback.success)&&g.addClass(this.options.feedback.error)&&e.removeClass("has-success"))},d.prototype.clearErrors=function(a){var c=a.closest(".form-group"),d=c.find(".help-block.with-errors"),e=c.find(".form-control-feedback");d.html(d.data("bs.validator.originalContent")),c.removeClass("has-error has-danger has-success"),c.hasClass("has-feedback")&&e.removeClass(this.options.feedback.error)&&e.removeClass(this.options.feedback.success)&&b(a)&&e.addClass(this.options.feedback.success)&&c.addClass("has-success")},d.prototype.hasErrors=function(){function b(){return!!(a(this).data("bs.validator.errors")||[]).length}return!!this.$inputs.filter(b).length},d.prototype.isIncomplete=function(){function c(){var c=b(a(this));return!("string"==typeof c?a.trim(c):c)}return!!this.$inputs.filter("[required]").filter(c).length},d.prototype.onSubmit=function(a){this.validate(),(this.isIncomplete()||this.hasErrors())&&a.preventDefault()},d.prototype.toggleSubmit=function(){this.options.disable&&this.$btn.toggleClass("disabled",this.isIncomplete()||this.hasErrors())},d.prototype.defer=function(b,c){return c=a.proxy(c,this,b),this.options.delay?(window.clearTimeout(b.data("bs.validator.timeout")),void b.data("bs.validator.timeout",window.setTimeout(c,this.options.delay))):c()},d.prototype.reset=function(){return this.$element.find(".form-control-feedback").removeClass(this.options.feedback.error).removeClass(this.options.feedback.success),this.$inputs.removeData(["bs.validator.errors","bs.validator.deferred"]).each(function(){var b=a(this),c=b.data("bs.validator.timeout");window.clearTimeout(c)&&b.removeData("bs.validator.timeout")}),this.$element.find(".help-block.with-errors").each(function(){var b=a(this),c=b.data("bs.validator.originalContent");b.removeData("bs.validator.originalContent").html(c)}),this.$btn.removeClass("disabled"),this.$element.find(".has-error, .has-danger, .has-success").removeClass("has-error has-danger has-success"),this},d.prototype.destroy=function(){return this.reset(),this.$element.removeAttr("novalidate").removeData("bs.validator").off(".bs.validator"),this.$inputs.off(".bs.validator"),this.options=null,this.validators=null,this.$element=null,this.$btn=null,this};var e=a.fn.validator;a.fn.validator=c,a.fn.validator.Constructor=d,a.fn.validator.noConflict=function(){return a.fn.validator=e,this},a(window).on("load",function(){a('form[data-toggle="validator"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery);
//Qas for catalogue signup on homepage only
var isQasValiad = false;
$(document).ready(function() {
    // QAS style ctrl
    var QASVALIDATION = {
        // Add class 'has-warning' & show validating status message
        hasWarning: function hasWarning(thisObj, type) {
            thisObj.parent().addClass('has-warning');
            $('#' + type + '-reg-error').html('<ul class="list-unstyled"><li>Validating ' + type +
                '..</li></ul>');
            console.log("QASVALIDATION.hasWarning()");
        },
        // Remove validating status style
        removeWarning: function removeWarning(thisObj, type) {
            var isWarning = thisObj.parent().hasClass('has-warning') ? true : false;
            if (isWarning) {
                thisObj.parent().removeClass('has-warning');
                $('#' + type + '-reg-error').html(' ');
                console.log("QASVALIDATION.removeWarning()");
            }
        },
        // Auto remove validating status style if request is overtime
        qasDeferred: function qasDeferred(thisObj, type) {
            setTimeout(function() {
                QASVALIDATION.removeWarning(thisObj, type);
            }, 5000);
            console.log("QASVALIDATION.qasDeferred()");
        }
    };

    $(this).find('form').validator('destroy').validator();
    // Remove QAS valid status if input has changed
    $('input[type=email]').on('input', function() {
        var thisType = $(this).attr("type");
        console.log("Input change: " + thisType);
        $(this).parent().removeClass('has-qas-success has-success');
        $('#registration-message .infocallout.infocallout-success').hide();
        $("#submitForm").prop('disabled', false);
        if (thisType === 'email') {
            isQasValiad = false;
        }
    });
    $('#email-signup').validator().on('submit', function(e) {
        var thisObj = $('div#regAddForm_email1_div input');
        var isFormValid = thisObj.parent().hasClass('has-success') ? true : false;
        $('#registration-message .infocallout.infocallout-success').hide();
        if (e.isDefaultPrevented()) {
            e.preventDefault();
            isMarketingFormInvalid("regAddForm_email1", "email");
        } else if (isFormValid) {
            e.preventDefault();
            $("#submitForm").prop('disabled', true);
            QASVALIDATION.hasWarning(thisObj, 'email');
            // Call QAS (Ref to AddressHelper.js & ServicesDeclaration.js)
            var b = dojo.byId("regAddForm_email1").form;
            AddressHelper.validateEmailAddressNew(b.id);
            QASVALIDATION.qasDeferred(thisObj, 'email');
        }

    });
});

function clearMarketingErrorDiv(formId) {
    switch (formId) {
        case "regAddForm_email1":
            clearError("regAddForm_email1", "email");
            break;
    }

    function clearError(id, type) {
        $('#' + id).parent().removeClass('has-error has-success');
    }
}

function isMarketingFormInvalid(id, type, errType) {
    //Get error type from QAS response
    var em = (type === "email") ? "address" : "number";
    //Get multiple email value from uber global
    var errorMsg = (errType === "multiple") ? "Your " + type + " " + em + " is already registered!" : null;
    $('#' + id).parent().removeClass('has-warning has-success').addClass('has-error has-danger');
    //Show error message based on different error type
    if (errorMsg) {
        $('#' + type + '-reg-error').html(errorMsg);
    } else {
        $('#' + type + '-reg-error').html('<ul class="list-unstyled"><li>Please enter a valid  ' + type + ' ' + em +
            ' </li></ul>');
    }
    //Notice BS-Validator to update validate status
    $(this).find('form').validator('update');
    if (errType === "multiple") {
        $(".form-error-summary").removeClass("hidden");
    }
}
// Invalid response from QAS
function showMarketingErrorDiv(errorObj) {

    for (var i = 0; i < errorObj.length; i++) {
        switch (errorObj[i].id) {
            case "regAddForm_email1":
                isMarketingFormInvalid("regAddForm_email1", "email");
                //isQasResolved.email = true;
                break;
        }
    }
    // Show invalid form style
}

// Valid response from QAS
function showMarketingSuccessDiv(successObj) {
    for (var i = 0; i < successObj.length; i++) {
        switch (successObj[i].id) {
            case "regAddForm_email1":
                isValid("regAddForm_email1", "email");
                //isQasResolved.email = true;
                break;
        }
    }
    //console.log(successObj);
    function isValid(id, type) {
        console.log(type + "SuccessDiv");
        $('#' + id).parent().removeClass('has-warning has-error').addClass('has-success has-qas-success');
        $('#' + type + '-reg-error').html(' ');
        if (type === 'email') {
            isQasValiad = true;
            submitForm()
        }
    }
}

function submitForm() {
    //e.preventDefault();
    console.log('SignUp: ' + $('#regAddForm_email1').val());
    $.ajax({
        url: 'https://social.thegoodguys.com.au/cheetah-digital/api/home_email_signup_submit.php',
        type: 'POST',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 0,
        data: {
            email: $("#regAddForm_email1").val()
        },
        success: function(response) {
            function disableQueryString() {
                var url = window.location.href;
                var newUrl = url.split(/[?#]/)[0];
                console.log("Removed Query String: " + url);
                window.history.pushState({}, "", newUrl);
            }
            disableQueryString();
            var data = response;
            var json = JSON.parse(data);
            if (json.email === "multiple") {
                isMarketingFormInvalid("regAddForm_email1", "email", "multiple");
                //registrationResponse("multiple");
                // If email address not exist
            } else if (json.email === "true") {
                $("#submitForm").prop('disabled', false);
                $('#registration-message .infocallout.infocallout-success').show('');
                dataLayer.push({
                    'event': 'HPespot',
                    'TGGEventCategory': 'Homepage Espots',
                    'TGGEventAction': 'Sign Up for Special Offers',
                    'TGGEventLabel': ' Special Offers'
                });
            }
        },
        error: function(error) {
            console.log("Error: ", error);

        }
    });
};
