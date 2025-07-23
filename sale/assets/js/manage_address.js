$(document).ready(function () {
    $("#addressForm").on('submit', function (e) {
        e.preventDefault();

        const address = {
            name: $("#name").val(),
            number: $("#number").val(),
            pin: $("#pin").val(),
            flat: $("#flat").val(),
            area: $("#area").val(),
            city: $("#city").val(),
            state_id: $("#state").val(),
            state: $("#state :selected").text()
        };

        localStorage.setItem("address", JSON.stringify(address));

        // ✅ Use relative path directly
        window.location.href = "order-summary.html";
    });

    $("#back_btn").on("click", function () {
        history.back();
    });
});
