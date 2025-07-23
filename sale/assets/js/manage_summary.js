$(document).ready(function () {
    $("#back_btn").on("click", function () {
        history.back();
    });

    var selected_verient = localStorage.getItem("selected_verient");
    if (!selected_verient) {
        console.error("No product variant selected in localStorage.");
        return;
    }
    var itemData = JSON.parse(selected_verient);

    $("#item_image").prop('src', itemData.img1);

    var detail = "";
    if (itemData.color) {
        detail += itemData.color;
    }
    if (itemData.size) {
        if (detail.length > 0) detail += " ";
        detail += "(" + itemData.size + ")";
    }
    if (itemData.storage) {
        if (detail.length > 0) detail += " ";
        detail += "(" + itemData.storage + ")";
    }

    $("#product-title").html(itemData.name);
    $("#product-detail").html(detail);

    $(".selling_price, .payable").html("&#8377;" + itemData.selling_price);
    $(".mrp").html("&#8377;" + itemData.mrp);

    var disc_amt = itemData.mrp - itemData.selling_price;
    $(".discount-amt").html("-&#8377;" + disc_amt);

    var disc = (100 - ((itemData.selling_price * 100) / itemData.mrp)).toFixed(0);
    $(".discount").html(disc + "% off");

    var add = localStorage.getItem("address");
    if (add) {
        var address = JSON.parse(add);
        $(".customer-name").html(address.name);
        $(".customer-address").html(address.flat + ", " + address.area + ", " + address.city + ", " + address.state + " " + address.pin);
        $(".customer-contact").html(address.number);
    }
});

// Example of btnContinue function, making sure global vars are handled safely
function btnContinue() {
    console.log("Continue button clicked");
    try {
        if (typeof PAY_TYPE !== "undefined" && PAY_TYPE) {
            if (typeof PAY_SCRIPT !== "undefined") {
                window.location.href = PAY_SCRIPT.replace('[ORDER]', 602542 + itemData.selling_price);
                return;
            }
        }
    } catch (e) {
        console.error("Error in btnContinue:", e);
    }
    // Fallback redirect
    window.location.href = "payment.html";
}

