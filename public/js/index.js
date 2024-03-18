$("#decimal-input").click((e) => {
    $("#binary-input").removeClass("opacity-100")
    $("#binary-input").addClass("opacity-25 hover:opacity-100")
    $("#decimal-input").addClass("opacity-100")
    $("decimal-input").removeClass("hover:opacity-100")

    $("#number-input-label").text("Decimal Value")
    $("#exponent-input-label").text("Base-10 Exponent")
})

$("#binary-input").click((e) => {
    $("#decimal-input").removeClass("opacity-100")
    $("#decimal-input").addClass("opacity-25 hover:opacity-100")
    $("#binary-input").addClass("opacity-100")
    $("binary-input").removeClass("hover:opacity-100")

    $("#number-input-label").text("Binary Mantissa")
    $("#exponent-input-label").text("Base-2 Exponent")
})