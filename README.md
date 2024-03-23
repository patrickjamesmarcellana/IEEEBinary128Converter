# IEEE-754 Binary-128 Floating-Point Converter

## Overview

The application is a web-based calculator for converting numbers in binary and decimal format to its binary128 or [quadruple precision floating-point](https://en.wikipedia.org/wiki/Quadruple-precision_floating-point_format) representation as defined in IEEE 754. The web application serves as the simulation project for the CSARCH2 course of A.Y. 2023-2024 at De La Salle University.

The input value must be represented in floating-point notation. The calculator requires a significand/mantissa in either decimal or binary, along with the exponent in the power term. The output is displayed in binary (sign bit, exponent, and significand) and hexadecimal representations, which can optionally be exported to a plaintext file. The calculator supports normal, denormalized, zero, (positive and negative) infinity, and NaN (indeterminate) values.

Other deliverables such as the analysis writeup and screenshots of test cases can be found within the `output` folder.

## Project Demo

https://github.com/lordpinpin/Binary128Converter/assets/113344400/bbafd880-ebaf-429a-a3a9-8e2dc46ae666

The project demo video shows the compilation of the program and demonstrates possible test cases and scenarios using different input values. Alternatively, the project demo video can be viewed on [YouTube](https://www.youtube.com/watch?v=QbLP0B4on_g).

# Output Deliverables

All the output deliverables including the screenshots of the program with different input values for test cases and the analysis writeup can be found in the `output` directory.

## Dependencies

The web application was mainly written in HTML with [Tailwind CSS](https://tailwindcss.com/) for styling, and JavaScript and [jQuery](https://jquery.com/) for DOM manipulation. It uses [Node.js](https://nodejs.org/) for the web server.

The following is a list of Node.js packages that the project uses.

| Dependency                                                       | Purpose                                                                                                           |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [express](https://www.npmjs.com/package/express)                 | Node.js web application framework the application was written with.                                               |
| [dotenv](https://www.npmjs.com/package/dotenv)                   | Loading custom environment variables in local instances.                                                          |
| [decimal.js](https://www.npmjs.com/package/decimal.js)           | Accurately represents the input as a floating-point. Used in the conversion script for floating-point operations. |
| [browserify](https://www.npmjs.com/package/browserify)           | Loading the conversion script client-side.                                                                        |
| [esmify](https://www.npmjs.com/package/esmify)                   | Used with browserify in loading the conversion script client-side.                                                |
| [watchify](https://www.npmjs.com/package/watchify)               | Used with browserify in loading the conversion script client-side.                                                |
| [path-browserify](https://www.npmjs.com/package/path-browserify) | Used with browserify in loading the conversion script client-side.                                                |

## Installation

### Live Instance

A deployed instance of the web application hosted using Render is accessible [here](https://ieeebinary128converter.onrender.com/). A backup instance hosted with Fly can also be used [here](https://converter-appp.fly.dev/).

### Local Instance

Alternatively, the web application can be run locally. Make sure to install [Node.js](https://nodejs.org/) prior to doing the following.

1. Clone the repository.
2. Create a file named `.env` in the root directory that contains the line `PORT = N`. `N` will serve as the port number at which the application will listen for requests. It can be set to any valid, unused port.
3. In the root directory, launch the terminal and run `npm i` to install the required Node.js [dependencies](#dependencies).
4. Run the server with `npm start`. Console logs should show that the application is listening on port `N`.
5. Go to `localhost:N` or `127.0.0.1:N` using a browser to use the application. `N` should be changed to the port used in `.env`.

## Team Members

- Harvey Shawn Chua
- Patrick James Marcellana
- Brett Harley Mider
- Lord John Benedict Pinpin
- John Wilson Tiquia
