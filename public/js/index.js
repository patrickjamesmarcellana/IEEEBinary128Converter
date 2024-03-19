// records values so they are not lost when switching base/radix
var binaryNumberString = "";
var binaryExponentString = "";
var decimalNumberString = "";
var decimalExponentString = "";

// 2 stands for binary mantissa input,
// 10 stands for decimal mantissa input
var MODE = 2;

// stores the values of the number and exponent text fields
var NUMBER = 0;
var EXPONENT = 0;

$("#submit-btn").click((e) => {
    if ($("#binary-input").hasClass("active")) {
        MODE = 2;
    } else {
        MODE = 10;
    }

    NUMBER = $("#number-value").val();
    EXPONENT = $("#exponent-value").val();

    let result;
    switch (MODE) {
        case 2:
            result = window.loadBinaryString(NUMBER, EXPONENT);
            break;
        case 10:
            result = window.loadDecimalString(NUMBER, EXPONENT);
            break;
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
    console.log(MODE);
    console.log(NUMBER);
    console.log(EXPONENT);
});
