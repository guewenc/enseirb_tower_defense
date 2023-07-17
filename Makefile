# Define variables to be used throughout the makefile
TS_CONFIG := tsconfig.json
DIST_DIR  := dist
TEST_DIR := tst

.PHONY: all build run test eslint parcel clean doc

# Define the default rule, which is executed when you run 'make' with no arguments
all: build

# Define the 'build' rule to compile TypeScript source code into JavaScript
# The rule depends on the 'TS_CONFIG' variable, which specifies the TypeScript configuration file
build: $(TS_CONFIG)
	npx tsc -p $(TS_CONFIG)

# Define the 'run' rule to execute the compiled JavaScript code
run: build
	node --experimental-specifier-resolution=node $(DIST_DIR)/main.js

# Define the 'test' rule to run unit tests using Jest
# The rule depends on the 'TEST_DIR' variable, which specifies the directory containing the test files
test:
	npx jest $(TEST_DIR)/*.ts

coverage:
	npx jest --coverage

# Define the 'eslint' rule to lint the TypeScript source code using ESLint
eslint:
	npx eslint src tst --fix

# Define the 'parcel' rule to bundle the compiled JavaScript code using Parcel
parcel:
	npx parcel html/index.html

# Define the 'clean' rule to remove temporary files
clean:
	@rm -rf *~ coverage
	@find dist/ ! -name '.gitkeep' -delete
	$(info The repository has been successfully cleaned up)

doc:
	doxygen dgenerate