var currentPageNumber = 1; // initialization before all functions
var dataAvailable = true;
$(function () {
    get_product_list(null, currentPageNumber);
});

$(window).scroll(function () {
    if (dataAvailable == true) {
        if ($(window).scrollTop() + 105 >= $(document).height() - $(window).height()) {
            currentPageNumber++;
            get_product_list(null, currentPageNumber);
        }
    }
});
                                                                    
async function get_product_list(data, currentPageNumber) {
    if (data && data != null && data.status == true) {
        var productData = data.data;
        var html = "";
        var i = 1;
        var _3LWZlK = ((Math.random() * 0.4) + 4.5) .toFixed(1);
       // Generates a random 10-digit order number
     
        
        
        
        productData.forEach(function (value) {
            var randomRating = (Math.random() * (5 - 4) + 4).toFixed(1);
            var Rating = Math.floor(Math.random() * (9500 - 7500 + 1)) + 7500;
            console.log(randomRating);
            if (i % 2 != 0) {
                html += `<tr>`;
            }
            html += `<td class="Cs7ycL TcKeCe">
                        <a href="product-details/${value.md5_id}?r=${randomRating}&r1=${Rating}">
                            <div class="_2enssu">
                                <div style="position:relative;min-height:170px;min-width:170px">
                                    <div class="_3LXIRu">
                                        <div class="_2GaeWJ" style="width:170px;height:170px">
                                            <img class="_2puWtW _3a3qyb" src="${value.img1}">
                                        </div>
                                    </div>
                                </div>
                                <div class="_24B_AU _3SexMn">${value.name}</div>
                                <div class="_24B_AU _1AQnZC">
                                    ${100 - ((value.selling_price * 100) / value.mrp).toFixed(0)}% Off
                                    <span class="mrp">₹${value.mrp}</span>
                                </div>
                                <div class="_24B_AU _1AQnZC">
                                    <b class="selling-price">₹${value.selling_price}</b>
                                    <img src="${MAIN_URL}img/SwOvZ3r.png" width="77px">
                                </div>

                                <div class="_24B_AU _1AQnZC">
                                    <b class="_3LWZlK">${randomRating}
                                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSIxMiI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTYuNSA5LjQzOWwtMy42NzQgMi4yMy45NC00LjI2LTMuMjEtMi44ODMgNC4yNTQtLjQwNEw2LjUuMTEybDEuNjkgNC4wMSA0LjI1NC40MDQtMy4yMSAyLjg4Mi45NCA0LjI2eiIvPjwvc3ZnPg==" 
                                        alt="Star" class="starimg" style="margin-top:-3px;">
                                    </b>
                                    <b class="_2_R_DZ" style="color:#494949 !important; margin-top:3px; display:inline-block;">${Rating} Ratings</b>
                                </div>

                                <div class="_3Nxu4r delivery-txt">Free Delivery in Two Days</div>
                            </div>
                        </a>
                    </td>`;
            if (i % 2 == 0) {
                html += `</tr>`;
            }
            i++;
        });
        if (currentPageNumber == 1) {
            $("#home_page_product").html(html);
        }
        else {
            $("#home_page_product").append(html);
        }
        $("#home_page_product .scaling-circle").remove();
        return false;
    }
    else if (data && data != null && data.status == false) {
        // showError(data.message);
        if (currentPageNumber == 1) {
            $("#home_page_product").html("<h1 class='no-data-found'>" + data.message + "</h1>");
        }
        $("#home_page_product .scaling-circle").remove();
        dataAvailable = false;
        return false;
    }
    else if (!data) {
        $("#home_page_product").append(getLoader());
        var length = 10;
        var start = (currentPageNumber - 1) * length;
        var req_data = {
            op: "get_products",
            page: currentPageNumber,
            start: start,
            length: length
        };
        doAPICall(req_data, function (res) { get_product_list(res, currentPageNumber) });
    }
    return false;
}
