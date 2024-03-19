// records values so they are not lost when switching base/radix
let binaryNumberString = "";
let binaryExponentString = "";
let decimalNumberString = "";
let decimalExponentString = "";

$("#submit-btn").click((e) => {
    let numberValue = $("#number-value").val();
    let exponentValue = $("#exponent-value").val();

    let result;
    if ($("#binary-input").hasClass("active")) {
        result = window.loadBinaryString(numberValue, exponentValue);
    } else {
        result = window.loadDecimalString(numberValue, exponentValue);
    }
    $("#output-bin").text(result.bin);
    $("#output-hex").text(result.hex);
});

$("#decimal-input").click((e) => {
    if ($("#decimal-input").hasClass("active")) {
        return;
    }

    $("#binary-input").removeClass("opacity-100 active");
    $("#binary-input").addClass("opacity-25 hover:opacity-100");
    $("#decimal-input").addClass("opacity-100 active");
    $("#decimal-input").removeClass("hover:opacity-100");

    $("#number-input-label").text("Decimal Value");
    $("#exponent-input-label").text("Base-10 Exponent");

    // store values so they are not lost when switching radix
    binaryNumberString = $("#number-value").val();
    binaryExponentString = $("#exponent-value").val();
    $("#number-value").val(decimalNumberString);
    $("#exponent-value").val(decimalExponentString);
});

$("#binary-input").click((e) => {
    if ($("#binary-input").hasClass("active")) {
        return;
    }

    $("#decimal-input").removeClass("opacity-100 active");
    $("#decimal-input").addClass("opacity-25 hover:opacity-100");
    $("#binary-input").addClass("opacity-100 active");
    $("#binary-input").removeClass("hover:opacity-100");

    $("#number-input-label").text("Binary Mantissa");
    $("#exponent-input-label").text("Base-2 Exponent");

    // store values so they are not lost when switching radix
    decimalNumberString = $("#number-value").val();
    decimalExponentString = $("#exponent-value").val();
    $("#number-value").val(binaryNumberString);
    $("#exponent-value").val(binaryExponentString);
});

$("#clear-btn").click((e) => {
    $("#number-value").val("");
    $("#exponent-value").val("");
});
