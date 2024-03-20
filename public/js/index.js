import { loadDecimalString, loadBinaryString } from "../../converter.js";

// records values so they are not lost when switching base/radix
let binaryNumberString = "";
let binaryExponentString = "";
let decimalNumberString = "";
let decimalExponentString = "";

let signBitOutput = "";
let exponentOutput = "";
let significandOutput = "";
let hexOutput = "";

let outputFile = null;

$("#submit-btn").click((e) => {
    const numberValue = $("#number-value").val();
    const exponentValue = $("#exponent-value").val();

    let result;
    if ($("#binary-input").hasClass("active")) {
        result = loadBinaryString(numberValue, exponentValue);
    } else {
        result = loadDecimalString(numberValue, exponentValue);
    }

    const first16Bits = result.bin.substring(0, 16);
    const first16BitsGrouped = first16Bits.match(/.{1,4}/g).join(" ");
    const significandBitsGrouped = result.bin
        .substring(16)
        .match(/.{1,4}/g)
        .join(" ");

    signBitOutput = first16BitsGrouped[0];
    exponentOutput = first16BitsGrouped.substring(1);
    significandOutput = significandBitsGrouped;
    hexOutput = "0x" + result.hex;

    $("#sign-bit").text(signBitOutput);
    $("#exponent-bits").text(exponentOutput);
    $("#significand-bits").text(significandOutput);
    $("#output-hex").text(hexOutput);

    createOutputFile();

    $(".result-value").removeClass("invisible");
    $("#download-btn").removeClass("invisible");
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

function createOutputFile() {
    // prevent memory leaks by releasing previous object URL
    if (outputFile !== null) {
        window.URL.revokeObjectURL(outputFile);
    }

    const text =
        "Result\r\n\r\n" +
        "Binary Representation\r\n" +
        `Sign bit: ${signBitOutput}\r\n` +
        `Exponent: ${exponentOutput}\r\n` +
        `Significand: ${significandOutput}\r\n\r\n` +
        "Hexadecimal Representation\r\n" +
        `${hexOutput}\r\n`;

    const blob = new Blob([text], { type: "text/plain" });
    outputFile = window.URL.createObjectURL(blob);
    $("#download-btn").attr("download", "output.txt");
    $("#download-btn").attr("href", outputFile);
}
