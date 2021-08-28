$(function() {
    // SETTINGS
    var password = document.getElementById('password');
    var passwordConfirm = document.getElementById('conf-password');

    var parentConsent = document.getElementById('parents-consent');
    var consentContainer = document.getElementById('consent-container');

    var $parentsConsent = $('#parents-consent');
    var $consentContainer = $('#consent-container');

    $('form').on('submit', function(e) {
        var elements = this.elements, valid = {}, isValid, isFormValid;

        // SHOW / HIDE ERROR MESSAGES - DONE
        for (i = 0, l = elements.length; i < l; i++) {
            isValid = validateRequired(elements[i]) && validateTypes(elements[i]); 

            (!isValid)
                ? showErrorMessage(elements[i])
                : removeErrorMessage(elements[i]);
            valid[elements[i].id] = isValid;
        }

        // PASSWORD - DONE
        if (!validatePassword()) {
            showErrorMessage(password);
            valid.password = false;
        } else
            removeErrorMessage(password);
    
        // PARENTS CONSENT - DONE
        if (!validateParentsConsent()) {
            showErrorMessage(parentConsent);
            valid.parentsConsent = false;
        } else
            removeErrorMessage(parentConsent);

        for(var field in valid) {
            if(!valid[field]) {
                isFormValid = false;
                break;
            } 
            isFormValid = true;
        }

        // EVENT AFTER VALIDATION NEGATIVE / POSITIVE
        if(!isFormValid)
            e.preventDefault();
        else if(isFormValid) {
            e.preventDefault();
            $('.intro').show().siblings().hide();
            $('.intro h2').text('Dziękujemy za rejestrację');
            $('.intro p').hide();
        }  
    });

    // IF VALIDATE IS REQUIRED - DONE
    function validateRequired(el) {
        if(isRequired(el)) {
            var valid = !isEmpty(el);
            if(!valid)
                setErrorMessage(el, 'To pole jest wymagane');
            return valid;
        }
        return true;
    }

    // IF ELEMENT IS REQUIRED RETURN TRUE - DONE
    function isRequired(el) {
        return ((typeof el.required === 'boolean') && el.required) || (typeof el.required === 'string');   
    }

    // IF ELEMENT IS EMPTY RETURN TRUE TEXT, TEXTAREA, PASSWORD, EMAIL FIELD - DONE
    function isEmpty(el) {
        return !el.value || el.value === el.placeholder;
    }

    // IF HAS VALUE AND IS CORRECT RETURN TRUE - DONE
    function validateTypes(el) {
        if(!el.value) return true;
        var type = $(el).data('type') || el.getAttribute('type');
    
        if(typeof validateType[type] === 'function')
            return validateType[type](el);
        else 
            return true; 
    }
    
    /*
     *** MESSAGES
    */
   
    // SET - DONE  
    function setErrorMessage(el, message) {
        $(el).data('errorMessage', message);
    }

    // GET - DONE
    function getErrorMessage(el) {
        return $(el).data('errorMessage') || el.title;
    }
    
    // SHOW - DONE
    function showErrorMessage(el) {
        var $el = $(el);
        var errorContainer = $el.siblings('.error');
    
        if(!errorContainer.length) 
            errorContainer = $('<span class="error"></span>').insertAfter($el);
        errorContainer.text(getErrorMessage(el));
    }

    // REMOVE - DONE
    function removeErrorMessage(el) {
        var errorContainer = $(el).siblings('.error');
        errorContainer.remove();
    }

    /*
     *** CHECK TYPES
    */
    var validateType = {
        email: function (el) {
            var valid = /[^@]+@[^@]+/.test(el.value);
            if (!valid)
                setErrorMessage(el, 'Proszę wpisać poprawny email');
            return valid;
        },
        number: function (el) {
            var valid = /^\d+$/.test(el.value);
            if (!valid)
                setErrorMessage(el, 'Proszę wpisać poprawną liczbę');
            return valid;
        },
        date: function (el) {
            var valid = /^(\d{2}\/\d{2}\/\d{4})|(\d{4}-\d{2}-\d{2})$/.test(el.value);
            if (!valid)
                setErrorMessage(el, 'Proszę wpisać poprawną datę');
            return valid;
        },
        password: function(el) {
            var valid = (password.value === passwordConfirm.value) ? true : false;
            if (!valid)
                setErrorMessage(el, 'Hasła nie są takie same');
            return valid;
        }
    };

    /*
     *** VALIDATION
    */

    // BIO - DONE
    bio = document.getElementById('bio');

    function updateCounter(e) {
        var target = e.target || e.srcElement;
        var count = 140 - target.value.length;

        $('#bio-count').text(`Zostało: ${count} znaków`);
    }

    addEvent(bio, 'focus', updateCounter);
    addEvent(bio, 'input', updateCounter);

    // PASSWORD LENGTH AND COMPARE - DONE
    function validatePassword() {    
        var valid = password.value.length >= 8;
        if(!valid)
            setErrorMessage(password, 'Hasło musi składać się z przynajmniej 8 znaków');
        return valid;
    }

    function setErrorHighlighter(e) {
        var target = e.target || e.srcElement;
        (target.value.length < 8) 
            ? target.className = 'fail'
            : target.className = 'success';
    }

    function removeErrorHighlighter(e) {
        var target = e.target || e.srcElement;
        if(target.className === 'fail')
            target.className = '';
    }

    function passwordMatch(e) {
        var target = e.target || e.srcElement;
        if ((password.value === target.value) && target.value.length >= 8) {
            target.className = 'success';
        } else {
            target.className = 'fail';
        }
    }

    addEvent(password, 'focus', removeErrorHighlighter);
    addEvent(password, 'blur', setErrorHighlighter);
    addEvent(passwordConfirm, 'focus', removeErrorHighlighter);
    addEvent(passwordConfirm, 'blur', passwordMatch);
      
    // DATE AGE IS MORE THAN 13 - DONE
    $('#birthday').prop('type', 'text').data('type', 'date').datepicker({
        dateFormat: 'yy-mm-dd'
    });
    $('#birthday').on('blur change', checkDate);

    function checkDate() {
        var dob = this.value.split('-');
        toggleParentsConsent(new Date(dob[0], dob[1], dob[2]));
    }

    function toggleParentsConsent(date) {
        if(isNaN(date)) return;
        var now = new Date;

        if((now - date) < (1000 * 60 * 60 * 24 * 365 * 13)) {
            $consentContainer.removeClass('hide');
            $parentsConsent.focus();
        } else {
            $consentContainer.addClass('hide');
            $parentsConsent.prop('checked', false);
        }
    }

    // PARENT CONSENT - DONE
    function validateParentsConsent() {
        var valid = true;
    
        if(consentContainer.className.indexOf('hide') === -1) {
            valid = parentConsent.checked;
    
            if(!valid)
                setErrorMessage($parentsConsent, 'Wymagana jest zgoda rodziców');
        }
        return valid;
    }
}());

/*

REGEX - Wyrażenia regularne

.       => dowolny znak (z wyjątkiem nowego wiersza)

[]      => jeden znak podany w nawiasie

[^ ]    => jeden znak nieznajdujący się w tym nawiasie

^       => położenie początkowe w dowolnym wierszu

$       => położenie końcowe w dowolnym wierszu

( )     => subwyrażenia(czasami nazywane blokami lub grupami przechwytywania)

*       => poprzedni element występujący zero lub więcej razy

\n      => n-te subwyrażenie(n to cyfra od 1 do 9)

{m,n}   => poprzedni element występuje minimum m razy, ale nie więcej niż n razy

\d      => cyfra

\D      => znak inny niż cyfra

\s      => znak odstępu

\S      => znak inny niż znak odstępu 

\w      => znak alfanumeryczny(A-Z, a-z, 0-9)

\W      => znak inny niż alfanumeryczny(z wyjątkiem _)

REGEX - Najczęściej stosowane wyrażenia regularne

/^\d+$/                 => oznacza liczbę

^[ \s]+                 => oznacza znak odstępu na początku wiersza

/[^@]+@[^@]+/           => oznacza adres e-mail

/^#[a-fA-F0-9]{6}$/     => oznacza kolor wyrażony jako wartość szesnastkowa

/^(d{2}\/\d{2}\/\d{4})|(\d{4}-\d{2}-\d{2})$/    => oznacza datę w formacie rr-mm-dd

*/