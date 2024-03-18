$("#decimal-input").click((e) => {
    $("#binary-input").removeClass("opacity-100 chosen")
    $("#binary-input").addClass("opacity-25 hover:opacity-100")
    $("#decimal-input").addClass("opacity-100 chosen")
    $("decimal-input").removeClass("hover:opacity-100")

    $("#number-input-label").text("Decimal Value")
    $("#exponent-input-label").text("Base-10 Exponent")
})

$("#binary-input").click((e) => {
    $("#decimal-input").removeClass("opacity-100 chosen")
    $("#decimal-input").addClass("opacity-25 hover:opacity-100")
    $("#binary-input").addClass("opacity-100 chosen")
    $("binary-input").removeClass("hover:opacity-100")

    $("#number-input-label").text("Binary Mantissa")
    $("#exponent-input-label").text("Base-2 Exponent")
})

$("#clear-btn").click((e) => {
    $("#number-value").val("") 
    $("#exponent-value").val("")
    console.log(MODE)
    console.log(NUMBER)
    console.log(EXPONENT)
})

var MODE = 2; var MODE = 2; // 2 stands for binary mantissa input, 
                            // 10 stands for decimal mantissa input
                            // this value will be changed by clicking the submit button

var NUMBER = 0;             // this value will be changed by clicking the submit button

var EXPONENT = 0;           // this value will be changed by clicking the submit button

$("#submit-btn").click((e) => {
    const binary_input_button = document.getElementById("binary-input")
    if(binary_input_button.classList.contains('chosen')) {
        MODE = 2;
    } else {
        MODE = 10;
    }

    NUMBER = $("#number-value").val()
    EXPONENT = $("#exponent-value").val()

    const {bin, hex} = window.loadBinaryString(NUMBER, EXPONENT)
    console.log(bin, hex)
    $("#output-bin").text(bin)
    $("#output-hex").text   (hex)
})




