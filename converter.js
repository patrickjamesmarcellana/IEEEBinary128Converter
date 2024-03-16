const Decimal = require('decimal.js');

var shift_forward = -1;
var binary = [];

var decimal_val = '893490.9839'
var actual_val = ''
var binary_val = '';
var hex_val = '';
var sign_bit = [];
var exponent_bits = [];
var mantissa_bits = [];

function updateFromNewDecimal() {
    Decimal.set({ precision: 150 });
    var x = new Decimal(decimal_val);
    Decimal.rounding = Decimal.ROUND_DOWN;
    if (x.greaterThanOrEqualTo(0)){
        sign_bit = [0];
    } else {
        sign_bit = [1];
    }
    var number_binary = getNumberBinary(x);
    var number_bits_total = number_binary.length;

    var decimal_binary = getDecimalBinary(x, 113 - number_bits_total);
    if (decimal_binary.length > 112 - number_bits_total){
        if (decimal_binary[113 - number_bits_total] == 1){
            decimal_binary = roundUpBinary(decimal_binary)
            decimal_binary.pop();
        } else {
            decimal_binary.pop();
        };
    }
    console.log(number_binary.join(''));
    console.log(decimal_binary.join(''));

    var exponent = 0;
    if (number_bits_total > 0) {
        exponent = number_bits_total - 1;
    } else {
        exponent = shift_forward;
    }

    var exponent_binary = new Decimal(16383 + exponent);
    exponent_binary = getNumberBinary(exponent_binary);
    exponent_bits = exponent_binary;
    console.log(exponent_bits.join(''));

    var mantissa = []
    mantissa = number_binary.slice(1);
    mantissa = mantissa.concat(decimal_binary);
    mantissa_bits = addZerosToArray(mantissa, 112);
    console.log(addSpaces(mantissa_bits.join('')));

    binary_val = sign_bit.join('') + exponent_bits.join('') + mantissa_bits.join('')
    console.log(binary_val);

    var hex_string = convertBinaryStringToHex();
    hex_val = hex_string.join('');
    console.log(hex_val);

    var hex_string = convertBinaryStringToHex();
    hex_val = hex_string.join('');
    console.log(hex_val);
}

function getDecimalFromBinary() {
    var exponent = binaryToNumber(exponent_bits.join(''));
    exponent = exponent.sub(16383);
    var mantissa = mantissa_bits.join('');
    if (exponent < 0) {
        var fractional_string = mantissa.addZerosAndOneToBeginning(exponent.negated());
        var fractional = binaryToFractional(fractional_string);
        actual_val = fractional.toFixed(20);
    } else {

    }


}

function binaryToFractional(string) {
    let decimal = new Decimal(0);
    let one = new Decimal(1);
    let power = new Decimal(2); // The power of 2 associated with the rightmost bit

    // Iterate over the binary string from right to left
    for (let i = string.length - 1; i >= 0; i--) {
        // If the current bit is '1', add the corresponding power of 2 to the decimal value
        if (string[i] === '1') {
            decimal.add(one.div(power));
        }
        // Update the power of 2 for the next bit
        power = power.mul(2);
    }

    return decimal;
}

function binaryToNumber(string) {
    let decimal = new Decimal(0);
    let power = new Decimal(1); // The power of 2 associated with the rightmost bit

    // Iterate over the binary string from right to left
    for (let i = string.length - 1; i >= 0; i--) {
        // If the current bit is '1', add the corresponding power of 2 to the decimal value
        if (string[i] === '1') {
            decimal.add(power);
        }
        // Update the power of 2 for the next bit
        power = power.mul(2);
    }

    return decimal;
}

function roundUpBinary(arr) {
    var i = arr.length - 1;
    while (arr[i] != 0){
        arr[i] = 0;
        i--
    }
    arr[i] = 1;
    return arr;
}

function convertBinaryStringToHex(){
    var hex_string = []
    var split4 = binary_val.match(/.{1,4}/g);

    split4.forEach(split => {
        hex_string.push(parseInt(split, 2).toString(16).toUpperCase());
    });

    return hex_string
}

function addZerosToArray(arr, desiredLength) {
    while (arr.length < desiredLength) {
        arr.push(0);
    }
    return arr;
}

function addZerosAndOneToBeginning(num){
    var zeros = '0'.repeat(num - 1); // Create a string of zeros
    return zeros + '1' + str; // Concatenate the zeros with the original string
}

function addSpaces(str) {
    return str.replace(/(.{4})/g, '$1 ');
}

function getNumberBinary(number){
    var number_portion = number.round();
    var binary_bits = [];
    while(!number_portion.equals(0)){
        var cur_binary = number_portion.modulo(2);
        binary_bits.push(cur_binary.toNumber());
        number_portion = number_portion.div(2).round();
    }
    return binary_bits.reverse();
}

function getDecimalBinary(number, limit){
    var decimal_portion = number.minus(number.round());
    var binary_bits = [];
    var current_bit_total = 0;
    var no_number = false;
    var zero_trigger = true;
    if (limit == 121){
        no_number = true;
    }

    while(binary_bits.length <= limit && !decimal_portion.equals(0)){
        decimal_portion = decimal_portion.mul(2);
        if (decimal_portion.greaterThanOrEqualTo(1)){
            decimal_portion = decimal_portion.minus(1);
            binary_bits.push(1);
            zero_trigger = false;
        } else {
            binary_bits.push(0);
        }
        current_bit_total = current_bit_total + 1;
        if (zero_trigger){
            current_bit_total = current_bit_total - 1;
            shift_forward = shift_forward - 1;
        }
    }
    return binary_bits;
}

updateFromNewDecimal();
