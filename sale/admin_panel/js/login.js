function login_user(data) {
    if (data && data != null && data.success == true) {
        $("#div_login_status").show().html("<h3>Logging you in!</h3>");
        $(".otp-div").removeClass("d-none");
        $(".non-otp-div").addClass("d-none");
        // current_user.exp_time = new Date().getTime() + 150000;
        // current_user.curr_time = new Date().getTime();
        // addToLocalStorage(GLOBAL_STORAGE_KEY, JSON.stringify(current_user));
        // setAjaxObject();
        hideLoading();
        return false;
    }
    else if (data && data != null && data.success == false) {
        hideLoading();
        showError(data.message);
        $("#div_login_status").html("").hide();
        $("#div_login_form").show();
                // current_user.exp_time = new Date().getTime() + 150000;
        // current_user.curr_time = new Date().getTime();
        // addToLocalStorage(GLOBAL_STORAGE_KEY, JSON.stringify(current_user));
        // setAjaxObject();
        return false;
    }
    else if (!data) {

        if ($('#tb_username').val() == "" || $('#tb_password').val() == "") {
            showError("Please enter login details");
            hideLoading();
            return false;
        }

        // $("#div_login_status").show().html("<h3>Authenticating...</h3>");
        // $("#div_login_form").hide();
        
         $("#div_login_status").show().html("<h3>Authenticating...</h3>");
        $("#div_login_form").hide();

        showLoading();
        var req_data = {
            op: "login_user"
            , email: $('#tb_username').val()
            , password: $('#tb_password').val()
        };
        doAPICall(req_data, login_user);
    }
    return false;
}

function verify_otp(data) {
    if (data && data != null && data.success == true) {
        // $("#div_login_status").show().html("<h3>Logging you in!</h3>");
         $("#div_login_status").show().html("<h3>Authenticating...</h3>");
        $("#div_login_form").hide();
        current_user = data.data;
        console.log(current_user);
        current_user.exp_time = new Date().getTime() + 900000;
        current_user.curr_time = new Date().getTime();
        addToLocalStorage(GLOBAL_STORAGE_KEY, JSON.stringify(current_user));
        setAjaxObject();
        hideLoading();
        return false;
    }
    else if (data && data != null && data.success == false) {
        hideLoading();
        showError(data.message);
        $("#div_login_status").html("").hide();
        $("#div_login_form").show();
        return false;
    }
    else if (!data) {

        if ($('#otp').val() == "") {
            showError("Please enter OTP");
            hideLoading();
            return false;
        }
        $("#div_login_status").show().html("<h3>Authenticating...</h3>");
        $("#div_login_form").hide();
        showLoading();
        var req_data = {
            op: "verify_otp"
            , email: $('#tb_username').val()
            , otp: $('#otp').val()
        };
         console.log(req_data);
        doAPICall(req_data, verify_otp);
    }
    return false;
}

function setAjaxObject() {
    $.post('ajax.html', { current_user: JSON.stringify(current_user), "login": "1" }).done(function (data, status, xhr) {
        $("#div_login_status").show().html("<h3>Login Successful. Redirecting...</h3>");
        var user = current_user;
        var company_settings = current_user['company_settings'];
        if (clevertap) {
            clevertap.profile.push({
                "Site": {
                    "Name": user['name']
                    , "Identity": user['id']
                    , "Phone": user['phone']
                    , "Email": user['email']
                }
            });
        }
        if (mixpanel) {
            mixpanel.people.set({
                "$name": user['name'],
                "$phone": user['phone'],
                "$email": user['email'],
                "$contact_type": ((user['is_main_admin_user'].toString() == '1') ? 'Primary' : 'Secondary'),
                "$signup_date": company_settings['date_added']
            });
            mixpanel.identify((!$.isEmptyObject(user['email']) ? (user['email'] + '_') : '') + user['id']);
        }
        logEvents("User Login" + " : " + user['name']);
        window.location.href = 'login.html';
    }).fail(function (xhr, status, error) {
        console.log(error);
    });
}
