# Tower Defense

## Description

This is a tower defense game created using JavaScript and functional programming techniques. The game features a grid-based world with different types of actors, including enemies, towers, and obstacles. The player must strategically place towers and defend against waves of enemies to progress through the levels. The game is designed to showcase the use of functional programming in game development and features pure functions, immutable data structures, and higher-order functions.

## Installation

1. Clone the repository
2. Install the dependencies: npm install

## Usage

To run the project:

```bash
make run
```

This will run the project in the console.

To run the project on an HTML page:

```bash
make parcel
```

This will create a server at `http://localhost:1234` where you can access the project in a web browser.

## Documentation

A Doxygen configuration file is present at the root of the project. Link to the Doxygen project: <https://github.com/doxygen/doxygen>.
Prerequisite `bison` package `>= 2.7`. Change the `DOT_PATH` variable in the `dgenerate` file to the location of your `dot` package. You can find it with the `which dot` command.

To compile the documentation, follow these instructions:

```bash
make clean doc
```

All generated documentation is present in the `doc` folder at the root of the project.

## Contact

If you have any questions or comments about this project, you can contact the authors:

* Guewen COUSSEAU
* Benjamin DAYRES
* Corentin OZANE
* Maxime GAJIC
* Badr EL-HABTI
