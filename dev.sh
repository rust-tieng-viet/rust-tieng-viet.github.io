#!/bin/bash

PORT=${1:-3000}

if ! command -v mdbook &>/dev/null; then
  echo Installing mdBook https://rust-lang.github.io/mdBook/guide/installation.html ...
  cargo install mdbook
fi

if ! command -v mdbook-linkcheck &>/dev/null; then
  echo Installing mdbook-linkcheck
  cargo install mdbook-linkcheck
fi

mdbook serve --open --port $PORT
