
TESTS=test/*.js
OPTS=-R tap

test:
	NODE_ENV=test mocha ${OPTS} $(TESTS)

.PHONY: test
