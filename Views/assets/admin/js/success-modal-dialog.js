// External JS: JS Helper Functions
// External JS: Dynamics JS

// hasClass
function hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

// toggleClass
function toggleClass(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
        elem.className += ' ' + className;
    }
}

// select
function select(selector) {
    var elements = document.querySelectorAll(selector);

    if (elements.length > 1) {
        return elements;
    } else {
        return elements.item(0);
    }
}

var btnOpen = select(".js-open");
var btnClose = select(".js-close");
var modal = select(".js-modal");
var form = select("#formId");
var modalChildren = modal.children;

function hideModal() {

    dynamics.animate(
        modal,
        {
            opacity: 0,
            translateY: 100
        },
        {
            type: dynamics.spring,
            frequency: 50,
            friction: 600,
            duration: 1500
        }
    );
}

function showModal() {
    // Define initial properties
    dynamics.css(modal, {
        opacity: 0,
        scale: 0.5
    });

    // Animate to final properties
    dynamics.animate(
        modal,
        {
            opacity: 1,
            scale: 1
        },
        {
            type: dynamics.spring,
            frequency: 300,
            friction: 400,
            duration: 1000
        }
    );
}

function showBtn() {
    dynamics.css(btnOpen, {
        opacity: 0
    });

    dynamics.animate(
        btnOpen,
        {
            opacity: 1
        },
        {
            type: dynamics.spring,
            frequency: 300,
            friction: 400,
            duration: 800
        }
    );
}

function showModalChildren() {
    // Animate each child individually
    for (var i = 0; i < modalChildren.length; i++) {
        var item = modalChildren[i];

        // Define initial properties
        dynamics.css(item, {
            opacity: 0,
            translateY: 30
        });

        // Animate to final properties
        dynamics.animate(
            item,
            {
                opacity: 1,
                translateY: 0
            },
            {
                type: dynamics.spring,
                frequency: 300,
                friction: 400,
                duration: 1000,
                delay: 100 + i * 40
            }
        );
    }
}

function toggleClasses() {
    toggleClass(btnOpen, "is-active");
    toggleClass(modal, "is-active");
}

// Open nav when clicking sandwich button
btnOpen.addEventListener("click", function(e) {
    $("#img_gallery_form, #event_form").on("submit", function() {
        var has_empty = false;

        if($(this).find('#ImgForm_submit').text() !== "Update Form" || $(this).find('#event_submit').text() !== "Update Form") {
            $(this).find('input').each(function () {
                if (!$(this).val()) {
                    has_empty = true;
                    return false;
                }
            });

            if (has_empty) {
                return false;
            }
        }
        $(this).find('#ImgForm_submit').text("Submit Form");
        $(this).find('#event_submit').text("Submit Form");
        toggleClasses();
        showModal();
        showModalChildren();
    });
});

// Open nav when clicking sandwich button
btnClose.addEventListener("click", function(e) {
    hideModal();
    dynamics.setTimeout(toggleClasses, 500);
    dynamics.setTimeout(showBtn, 500);
});
