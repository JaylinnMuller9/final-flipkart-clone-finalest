var pageLoadFlag = true;
var current_user = null;
var timezone = jstz.determine();
$(".overlay-modal").removeClass('hide').hide();
var complete_execution = 1;
if (typeof MODULE_NAME === 'undefined' || MODULE_NAME === null) {
    var MODULE_NAME = '';
}
var FIRST_PAGE_LOAD = 1;
var CLOSE_CONSTANT = 'Close';
var CANCEL_CONSTANT = 'Cancel';
var saveMessage = 'Saved';
var updateMessage = 'Updated';
var CURRENT_DATA = [];
var editor = [];

// NProgress
(function ($) {

    'use strict';

    if (typeof NProgress !== 'undefined' && $.isFunction(NProgress.configure)) {

        NProgress.configure({
            showSpinner: true,
            ease: 'ease',
            speed: 750
        });

    }

}).apply(this, [jQuery]);

$(document).ready(function () {
    window.addEventListener('scroll', () => {
        document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    });
    // handle common show event of all dialog
    $('.modal').on('shown.bs.modal', function (s) {
        const scrollY = document.documentElement.style.getPropertyValue('--scroll-y'); const body = document.body; body.style.position = 'fixed'; body.style.top = `-${scrollY}`;// Hide scroll when modal open
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
    // handle common close event of all dialog
    $('.modal').on('hide.bs.modal', function (s) {
        const body = document.body; const scrollY = body.style.top; body.style.position = ''; body.style.top = ''; window.scrollTo(0, parseInt(scrollY || '0') * -1); // Manage scroll when modal hide
    });

    //Prevent Submit Form on press Enter
    $('form').on('keyup keypress', function (e) {
        ///Get Target
        if (e.target.nodeName != 'TEXTAREA' && e.target.id != 'q' && e.target.id != 'tb_email' && e.target.id != 'tb_password' && $(e.target).attr('class') != "note-editable" && !$(e.target).attr('class').includes("ck-editor__editable"))//For Allow Enter in TextArea, Allow when global search enter
        {
            var keyCode = e.keyCode || e.which;
            if (keyCode === 13 && !$(e.target).hasClass('select2-search__field')) {
                e.preventDefault();
                return false;
            }
        }
    });

});

function showLoading() {
    NProgress.start();
}

function hideLoading() {
    NProgress.done();
}

function changeView(view, formID = "", isEditMode = false) {
    if (view == 'form') {
        $("#addBtn, #detailsDiv").hide();
        $("#backBtn, #formDiv").show();
        if (formID != "") {
            resetValidation(formID)
        }
        if (CURRENT_PAGE == "manage_products.php" && isEditMode == false) {
            editor = [];
            $("#verientList").html("");
        }
    }
    else {
        $("#addBtn, #detailsDiv").show();
        $("#backBtn, #formDiv").hide();
        CURRENT_DATA = [];
    }
}

function showMessage(msg, title) {
    PNotify.removeAll();
    var title = (typeof (title) == 'undefined') ? "Success" : title;
    new PNotify({
        title: title,
        text: msg,
        maxOpen: 1,
        type: 'success'
    });
}

function showAlert(msg, title) {
    PNotify.removeAll();
    var title = (typeof (title) == 'undefined') ? "Alert" : title;
    new PNotify({
        title: title,
        text: msg,
        type: 'info',
        maxOpen: 1,
        animate_speed: 'fast',
        buttons: {
            closer: true,
            sticker: false, //ugly
            labels: { close: "Fechar", stick: "Manter" }
        }
    });
    //$.notify(msg, 'info');
}

function showError(msg, title) {
    PNotify.removeAll();
    var title = (typeof (title) == 'undefined') ? "Alert" : title;
    new PNotify({
        title: title,
        text: msg,
        type: 'error',
        maxOpen: 1,
        animate_speed: 'fast',
        buttons: {
            closer: true,
            sticker: false, //ugly
            labels: { close: "Fechar", stick: "Manter" }
        }
    });
    //$.notify(msg, 'danger');
    hideLoading();
}

jQuery["postJSON"] = function (url, data, callback) {
    // shift arguments if data argument was omitted
    if (jQuery.isFunction(data)) {
        callback = data;
        data = undefined;
    }

    return jQuery.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: callback
    });
};

function doAPICall(obj, callback, is_async) {

    showLoading();

    is_async = (typeof (is_async) == 'undefined' || is_async) ? true : false;
    var token = "";
    if (readLocalStorage(GLOBAL_STORAGE_KEY) != '' && readLocalStorage(GLOBAL_STORAGE_KEY) != null) {
        var SESSION_DATA = JSON.parse(readLocalStorage(GLOBAL_STORAGE_KEY));
        if (!SESSION_DATA.hasOwnProperty('exp_time') || new Date().getTime() > SESSION_DATA.exp_time) {
            // If the item is expired, delete the item from storage
            // and return null
            removeLocalStorage(GLOBAL_STORAGE_KEY);
        }
        else {
            token = SESSION_DATA.token;
        }
    }
    var data = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof (obj[key]) != "string") {
                data[key] = obj[key];
            }
            else {

                if (obj[key] == "Invalid date") {
                    showError(ERROR_MESSAGE_INVALID_DATE);
                    PREVENT_API_CALL = true;
                    break;
                }
                data[key] = obj[key].replace(/''/g, '&apos;').replace(/\'/g, '&apos;').replace(/'/g, "&apos;");
            }
        }
    }

    data["version"] = "web";
    data["from"] = "panel";
    data["tz"] = getTzOffset();
    data["tzid"] = timezone.name();
    data["token"] = token;
    // data["curr_time"] = $.format.date(new Date(), 'yyyy-MM-dd HH:mm:ss');
    data["curr_time"] = moment().format('D-MM-YYYY');
    if (CURRENT_USER_ID != "") data["user_id"] = CURRENT_USER_ID;

    var settings = {
        type: "POST",
        url: API_SERVICE_URL,
        data: data,
        async: is_async,
        dataType: 'json',
        "crossDomain": true,
        "headers": {}
    }
    $.ajax(settings).done(function (response) {
        $("#btn_save,button.edit.btn-success").button('reset');
        response = response || {};
        responseString = JSON.stringify(response).replace(/''/g, '&apos;').replace(/\'/g, '&apos;').replace(/&apos;/g, "'");
        response = JSON.parse(responseString);
        if (parseInt(response.subscription_flag) == 0) {
            window.location = "logout.php";
        }
        else if (parseInt(response.status) == -2) {
            window.location = "logout.php";
        }
        if (response.error) {
            showError(JSON.stringify(response.error), "ERROR");
        }
        else {
            callback(response);
        }
    }).fail(function (err) {
        $("#btn_save,button.edit.btn-success").button('reset');
        hideLoading();
        //console.log(err);
        if (err.readyState != 0) {
            showError("System failure: ") + JSON.stringify(err);
            $("body").html(err.responseText);
        }
    });
}

function fmt(format_string, params) {
    var _format = format_string || "";
    var _ret = _format + "";
    var r = null;
    try {
        for (var i in params) {
            r = new RegExp("\\{" + i + "\\}", "g");
            _ret = _ret.replace(r, params[i] == null ? "" : params[i].toString());
        }
    } catch (e) { }
    return _ret;
}


/*
 POSTED TIME AGO PRINT FUNCTION
 TIMEZONE WISE DATE CALCULATION USING OFFSET

 db_date = MYSQL DATETIME FORMAT [YYYY-MM-DD HH:II:SS]
 */

function posted_ago(db_date, tz_offset) {
    //console.log("DB DATE : "+db_date + " OFFSET: "+tz_offset);
    var dateString = db_date.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    var db_date = new Date(dateString[1], dateString[2] - 1, dateString[3], dateString[4], dateString[5], dateString[6]);
    //var db_date  = new Date(""+db_date);
    var client_tz_ms = db_date.getTime() + (-1 * tz_offset * 60 * 1000);
    var client_date = new Date(client_tz_ms);

    if (client_date) {
        var seconds = Math.floor(((new Date()).getTime() - client_date.getTime()) / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        var time_display_text = seconds + " seconds ago.";
        if (minutes > 0) {
            if (hours > 0) {
                if (days > 0) {
                    time_display_text = days + " day ago.";
                }
                else {
                    time_display_text = hours + " hour ago.";
                }
            }
            else {
                time_display_text = minutes + " minute ago.";
            }
        }

        return time_display_text;
    }

    return false;
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else
        var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function addToLocalStorage(name, value) {
    window.localStorage.setItem(name, value);
}

function readLocalStorage(name) {
    return window.localStorage.getItem(name);
}

function removeLocalStorage(name) {
    return window.localStorage.removeItem(name);
}

function logEvents(logString) {
    if (clevertap) {
        clevertap.event.push(logString);
    }
    if (mixpanel) {
        mixpanel.track(logString);
    }
}

function doRefreshSession(response, do_reload, URL) {
    if (response && response.success > 0) {
        current_user = response.data;
        $.post('ajax.html', { current_user: JSON.stringify(current_user), login: "1" }).done(function (data, status, xhr) {
            if (typeof do_reload !== 'undefined' && do_reload) {
                location.reload(true);
                do_reload = 0;
            }
            if (typeof URL !== 'undefined' && !$.isEmptyObject(URL)) {
                window.location.href = URL;
            }
            if (typeof refreshSessionCallback !== 'undefined' && $.isFunction(refreshSessionCallback)) {
                refreshSessionCallback();
            }
        }).fail(function (xhr, status, error) {
            //console.log(err);
        });
        $.magnificPopup.close();
        hideLoading();
    }
    else if (response && response.success <= 0) {
        $.magnificPopup.close();
        showError(response.message);
        hideLoading();
    }
    else if (!response) {
        showLoading();
        var cookieName = 'user_1';
        var userCookie = readCookie(cookieName);

        if ($.isEmptyObject(userCookie) || userCookie == null || userCookie == "") {
            window.location.href = 'logout.html';
            return false;
        }

        var data = {
            "op": "login_user"
            , "cookie_id": userCookie

        };
        doAPICall(data, function (resp) { doRefreshSession(resp, do_reload, URL); }, false);
    }
    return true;
}

function sumObjectValues(items, prop) {
    if (items == null) {
        return 0;
    }
    return items.reduce(function (a, b) {
        return b[prop] == null || b[prop] == "" || isNaN(parseFloat(b[prop])) ? parseFloat(a) : parseFloat(a) + parseFloat(b[prop]);
    }, 0);
}

function getTzOffset() {
    var offset = new Date().getTimezoneOffset();
    var minutes = Math.abs(offset);
    var hours = Math.floor(minutes / 60);
    var prefix = offset < 0 ? "+" : "-";
    return prefix + hours + ":" + (minutes % 60);
}

function getCurrentDate() {
    return moment(new Date()).format(COMPANY_DATE_FORMAT.toUpperCase());
}

function getCurrentTime() {
    return $.format.date(new Date(), "hh:mm a");
}

function getCustomCurrentTimeDate() {
    return moment(new Date()).format("MMDDYY".toUpperCase()) + "-" + $.format.date(new Date(), "HHmmss");
}

function resetValidation(formID) {
    $("#" + formID + " #id").val(0);
    $("#" + formID)[0].reset();
    $("#" + formID).removeClass('was-validated');
    $('.select2').val("").trigger('change');
    $('#image_preview').attr('src', "");
    $(".default-hide").addClass('hide');
    CURRENT_DATA = [];
}

$(".numbersOnlyField").keydown(function (e) {
    if (e.keyCode == 107 || e.keyCode == 109 || e.keyCode == 110 || e.keyCode == 187 || e.keyCode == 189 || e.keyCode == 61 || e.keyCode == 173 || e.keyCode == 220) {
        return false;
    }
});

$(".numberTypeField").keydown(function (e) {
    if (!(e.keyCode >= 48 && e.keyCode <= 57) && !(e.keyCode >= 96 && e.keyCode <= 105) && e.keyCode != 18 && e.keyCode != 8 && e.keyCode != 9 && e.keyCode != 13 && e.keyCode != 16 && e.keyCode != 36) {
        showAlert("Only numbers can be entered into the field.");
        $(this).val("");
        return false;
    }
});

async function HTMLEditor(id, index = '') {

    editor[index] = CKEDITOR.ClassicEditor.create(document.getElementById(id), {
        // updateSourceElementOnDestroy: true,
        Plugins: ['ckEditorEnterBreaks'],
        // https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html#extended-toolbar-configuration-format
        toolbar: {
            items: [
                'findAndReplace', 'selectAll', '|',
                'heading', '|',
                'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'removeFormat', '|',
                'bulletedList', 'numberedList', 'todoList', '|',
                'outdent', 'indent', '|',
                'undo', 'redo',
                '-',
                'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
                'alignment', '|',
                'link', 'insertImage', 'blockQuote', 'insertTable', 'mediaEmbed', 'codeBlock', 'htmlEmbed', '|',
                'specialCharacters', 'horizontalLine', '|',
                'sourceEditing'
            ],
            shouldNotGroupWhenFull: true
        },
        // Changing the language of the interface requires loading the language file using the <script> tag.
        // language: 'es',
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#configuration
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/editor-placeholder.html#using-the-editor-configuration
        placeholder: 'Features',
        // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
        fontFamily: {
            options: [
                'default',
                'Arial, Helvetica, sans-serif',
                'Courier New, Courier, monospace',
                'Georgia, serif',
                'Lucida Sans Unicode, Lucida Grande, sans-serif',
                'Tahoma, Geneva, sans-serif',
                'Times New Roman, Times, serif',
                'Trebuchet MS, Helvetica, sans-serif',
                'Verdana, Geneva, sans-serif'
            ],
            supportAllValues: true
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-size-feature
        fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true
        },
        // Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
        // https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
        htmlSupport: {
            allow: [
                {
                    name: /.*/,
                    attributes: true,
                    classes: true,
                    styles: true
                }
            ]
        },
        // Be careful with enabling previews
        // https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
        htmlEmbed: {
            showPreviews: true
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
        link: {
            decorators: {
                addTargetToExternalLinks: true,
                defaultProtocol: 'https://',
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        removePlugins: [
            'CKBox',
            'CKFinder',
            'EasyImage',
            'Base64UploadAdapter',
            'RealTimeCollaborativeComments',
            'RealTimeCollaborativeTrackChanges',
            'RealTimeCollaborativeRevisionHistory',
            'PresenceList',
            'Comments',
            'TrackChanges',
            'TrackChangesData',
            'RevisionHistory',
            'Pagination',
            'WProofreader',
            // Careful, with the Mathtype plugin CKEditor will not load when loading this sample
            // from a local file system (file://) - load this site via HTTP server if you enable MathType.
            'MathType',
            // The following features are part of the Productivity Pack and require additional license.
            'SlashCommand',
            'Template',
            'DocumentOutline',
            'FormatPainter',
            'TableOfContents'
        ]
    })
        .then(newEditor => {
            editor[index] = newEditor;
        });
}