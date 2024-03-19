const Decimal = require("decimal.js");
Decimal.set({ precision: 150 });
Decimal.rounding = Decimal.ROUND_DOWN;

var shift_forward = -1;
var binary = [];
var decimal_val = "15000000000";
var actual_val = "";
var binary_val = "";
var error_val = "";
var hex_val = "";
var sign_bit = [];
var exponent_bits = [];
var mantissa_bits = [];

// TODO: rtn_te is inplace

// A data type storing bin and hex answers
function answer(bin, hex) {
    return {
        bin: bin,
        hex: hex
    }
}

// A data type storing the mantissa 1.xxxxx and its exponent
function mantissa_exponent_pair(_mantissa, _exponent) {
  if(isNaN(_exponent)) {
    throw "Invalid exponent";
  }

  return {
    mantissa: _mantissa,
    exponent: _exponent,
    print: function () {
      if(this.mantissa.length > 0) {
        const first_bit = this.mantissa[0];
        const other_bits = this.mantissa.slice(1)
        console.log(`${first_bit}.${other_bits.join("")} x 2^${this.exponent}`);
      } else {
        console.log(`0 x 2^${this.exponent}`);
      }
    },
    pack: function () {
      rtn_te(this, 113);
      if(this.mantissa.length == 0) {
        binary_val = sign_bit.join("") + Array(127).fill(0).join("")
        hex_val = convertBinaryStringToHex().join("");

        return {
            bin: binary_val,
            hex: hex_val
        }
      }
      
      var exponent_binary = getNumberBinary(new Decimal(16383 + this.exponent));
      exponent_bits = Array(15 - exponent_binary.length)
        .fill(0)
        .concat(exponent_binary);
      console.assert(
        exponent_bits.length === 15,
        "exponent bits length: expected 15, got",
        exponent_bits.length,
      );
      console.log(exponent_bits.join(""));

      mantissa_bits = addZerosToArray(this.mantissa.slice(1), 112);
      console.assert(
        mantissa_bits.length === 112,
        "mantissa bits length: expected 112, got",
        mantissa_bits.length,
      );
      console.log(addSpaces(mantissa_bits.join("")));

      binary_val =
        sign_bit.join("") + exponent_bits.join("") + mantissa_bits.join("");
      console.assert(
        binary_val.length === 128,
        "binary value length: expected 128, got",
        binary_val.length,
      );
      console.log(binary_val);

      var hex_string = convertBinaryStringToHex();
      hex_val = hex_string.join("");
      console.log(hex_val);

      return answer(binary_val, hex_val)
    },
  };
}
function updateFromNewDecimalString(decimal_string, exponent) {
  // Use when decimal input has been changed.
  // All other values will change accordingly.
  decimal_val = decimal_string + "e" + exponent;
  var x = new Decimal(decimal_val);
  if (x.greaterThanOrEqualTo(0)) {
    sign_bit = [0];
  } else {
    sign_bit = [1];
    x = x.negated();
  }
  var number_binary = getNumberBinary(x);
  var number_bits_currently_used = number_binary.length;

  var [decimal_binary, exponent, remaining] = getDecimalBinary(
    x,
    113 - number_bits_currently_used,
    x.lessThan(1) /* if 0.xxx, then remove leading zeros in decimal part */,
  );

  var ZERO_POINT_FIVE = new Decimal("0.5");
  console.log(number_binary, "enc");
  var number = mantissa_exponent_pair(
    number_binary.concat(decimal_binary),
    number_bits_currently_used > 0
      ? number_bits_currently_used -
          1 /* 1xx.xxxxx -> base on number_bits_currently_used */
      : exponent /* 0.xxxxx -> base on getDecimalBinary */,
  );
  console.log(number);

  // having a non-zero remaining implies that it has 113 + 1 (round) binary digits
  if (remaining.equals(ZERO_POINT_FIVE)) {
    // make the excess part "1" as it actually should be
    number.mantissa.push(1);
  } else if (remaining.greaterThan(ZERO_POINT_FIVE)) {
    // case where remaining is greater than even
    // make the excess part "xxx11" so it will always round up
    number.mantissa.push(1);
    number.mantissa.push(1);
  } else {
    // round to zero/truncate, which is the same as doing nothing
  }
  number.print();
  return number.pack();

  getDecimalFromBinary();
  getError();
}

function updateFromNewBinaryString() {
  // Use when binary_val has changed.
  // All other values will change accordingly.
  Decimal.set({ precision: 150 });

  var binary_string = binary_val;
  sign_bit = binary_string.slice(0, 1).split("");
  exponent = binary_string.slice(1, 12).split("");
  mantissa = binary_string.slice(12).split("");

  getDecimalFromBinary();
  decimal_val = actual_val;
  hex_val = convertBinaryStringToHex.join("");
  getError();
}

function updateFromNewBinaryToggle() {
  // Use when a binary bit is changed.
  // All other calues will change accordingly.
  Decimal.set({ precision: 150 });

  binary_val =
    sign_bit.join("") + exponent_bits.join("") + mantissa_bits.join("");
  getDecimalFromBinary();
  decimal_val = actual_val;
  hex_val = convertBinaryStringToHex.join("");
  getError();
}

function getDecimalFromBinary() {
  // Takes the current binary bits and gets the actual decimal value.
  // Will modify actual_val.

  var exponent = binaryToNumber(exponent_bits.join(""));
  exponent = exponent.sub(16383);
  var mantissa = mantissa_bits.join("");
  if (exponent < 0) {
    var fractional_string = addZerosAndOneToBeginning(
      mantissa,
      exponent.negated(),
    );
    var fractional = binaryToFractional(fractional_string);
    actual_val = fractional.toFixed();
  } else if (exponent < mantissa_bits.length) {
    var number_string = "1" + mantissa.slice(0, exponent);
    var fractional_string = mantissa.slice(exponent);
    var number_string_val = binaryToNumber(number_string).toPrecision();
    var fractional_string_val = binaryToFractional(fractional_string)
      .toDP(30)
      .toFixed();
    actual_val = number_string_val + fractional_string_val.slice(1);
  } else {
    var number_string =
      "1" + addZerosToEnd(mantissa, exponent - mantissa_bits.length);
    var number_string_val = binaryToNumber(number_string).toPrecision();
    actual_val = number_string_val;
  }

  if (sign_bit[0] == 1) {
    actual_val = "-" + actual_val;
  }
}

function getError() {
  // Gets the error between actual_val and decimal_val and stores it in error_val

  var decimal = new Decimal(decimal_val);
  var actual = new Decimal(actual_val);

  error_val = actual.sub(decimal).toFixed();
}

function binaryToFractional(string) {
  // Gets the fractional value of a given string.

  var decimal = new Decimal(0);
  var one = new Decimal(1);
  var power = new Decimal(2);

  for (let i = 0; i < string.length; i++) {
    if (string[i] === "1") {
      decimal = decimal.add(one.div(power));
    }
    power = power.mul(2);
  }

  return decimal;
}

function binaryToNumber(string) {
  // Gets the number value of a givens string.

  var decimal = new Decimal(0);
  var power = new Decimal(1); // The power of 2 associated with the rightmost bit

  // Iterate over the binary string from right to left
  for (let i = string.length - 1; i >= 0; i--) {
    // If the current bit is '1', add the corresponding power of 2 to the decimal value
    if (string[i] === "1") {
      decimal = decimal.add(power);
    }
    // Update the power of 2 for the next bit
    power = power.mul(2);
  }

  return decimal;
}

function rtn_te(mantissa_exponent_pair, desired_length) {
  const mantissa = mantissa_exponent_pair.mantissa;
  // Rounds binary
  function round_up() {
    var i = mantissa.length - 1;
    while (i >= 0 && mantissa[i] != 0) {
      mantissa[i] = 0;
      i--;
    }

    if (i >= 0) {
      mantissa[i] = 1;
    } else {
      // add new 1
      mantissa.splice(0, 0, 1);

      // renormalize
      mantissa_exponent_pair.exponent++;
    }
  }

  i = 0;
  while (i++ < 5) {
    console.log(mantissa);

    // remove trailing zeros
    while (mantissa.length > 0 && mantissa[-1] == 0) {
      mantissa.pop();
    }

    if (mantissa.length <= desired_length) {
      // done
      console.log("RTN-TE truncate");
      break;
    } else if (mantissa.length == desired_length + 1) {
      console.log("RTN-TE tie");
      // tie, round to even
      mantissa.pop();
      if (mantissa[-1] == 1) {
        // if odd, round up
        round_up();
      }
    } else {
      // round up digits
      console.log("RTN-TE increase magnitude");
      while (mantissa.length > desired_length) {
        mantissa.pop();
      }

      round_up();
    }
  }

  if (i == 5) {
    console.error(
      "Encountered too many rounding iterations. Check the parameters.",
    );
  }

  return mantissa_exponent_pair;
}

function convertBinaryStringToHex() {
  // Converts a given binary string into hex. Assumes it is a string divisible by 4.
  var hex_string = [];
  var split4 = binary_val.match(/.{1,4}/g);

  split4.forEach((split) => {
    hex_string.push(parseInt(split, 2).toString(16).toUpperCase());
  });

  return hex_string;
}

function addZerosToArray(arr, desiredLength) {
  // Adds zeros at the end of array to match length.
  while (arr.length < desiredLength) {
    arr.push(0);
  }
  return arr;
}

function addZerosAndOneToBeginning(str, num) {
  // Adds a set of zeros and one to a string
  // For numbers where exponent moves the fixed point back past the original value
  var zeros = "0".repeat(num - 1);
  return zeros + "1" + str;
}

function addZerosToEnd(str, num) {
  // Adds a set of zeros to the end of a string
  var zeros = "0".repeat(num - 1);
  return str + zeros;
}

function addSpaces(str) {
  // Splits number into sections of 4 for visual purposes.
  return str.replace(/(.{4})/g, "$1 ");
}

function getNumberBinary(number) {
  // Gets the binary bits of a number
  var number_portion = number.round();
  var binary_bits = [];
  while (!number_portion.equals(0)) {
    var cur_binary = number_portion.modulo(2);
    binary_bits.push(cur_binary.toNumber());
    number_portion = number_portion.div(2).round();
  }
  return binary_bits.reverse();
}

function getDecimalBinary(number, limit, skip_leading = false) {
  // Gets the binary bits of a fractional number
  var decimal_portion = number.minus(number.round());
  var binary_bits = [];
  var zero_trigger = true;
  var exponent = 0;

  while (binary_bits.length <= limit && !decimal_portion.equals(0)) {
    decimal_portion = decimal_portion.mul(2);
    if (decimal_portion.greaterThanOrEqualTo(1)) {
      decimal_portion = decimal_portion.minus(1);
      binary_bits.push(1);
      zero_trigger = false;
    } else {
      // 0 case
      if (!skip_leading || !zero_trigger /* if skip leading enabled */) {
        binary_bits.push(0);
      } else {
        exponent--; // decrease exponent to compensate for place value increase
      }
    }
  }
  return [binary_bits, exponent, decimal_portion];
}

function loadBinaryString(binary_string, exponent) {
  let sign = false;
  let dot_idx = null;
  let first_one_idx = null;
  const mantissa = [];
  for (let i = 0; i < binary_string.length; i++) {
    const char = binary_string[i];

    // parse input
    switch (char) {
      case "0":
        break;
      case "1":
        // check if this is implicit 1
        if (first_one_idx == null) {
          first_one_idx = i;
        }
        break;
      case ".":
        if (dot_idx == null) {
          dot_idx = i;
        } else {
          // error
        }
      case "-":
        if (i == 0) {
          sign = true;
        } else {
          // error
        }
    }

    // push to mantissa if implicit 1 already found
    if (first_one_idx != null && (char == "0" || char == "1")) {
      mantissa.push(char);
    }
  }

  // determine sign
  sign_bit[0] = sign ? 1 : 0

  // determine exponent
  exponent = parseInt(exponent);
  if (dot_idx != null) {
    //
    if (first_one_idx < dot_idx) {
      // has dot
      // move towards 1, but not so they would end up switching positions
      exponent += dot_idx - first_one_idx - 1;
    } else {
      // 000.xx1xxxx
      // move towards 1, and make them switch positions
      exponent += dot_idx - first_one_idx;
    }
  } else {
    // no dot
    exponent += mantissa.length - 1;
  }

  const num = mantissa_exponent_pair(mantissa, exponent);
  num.print();
  return num.pack();
}

window.loadBinaryString = loadBinaryString;
window.loadDecimalString = updateFromNewDecimalString;