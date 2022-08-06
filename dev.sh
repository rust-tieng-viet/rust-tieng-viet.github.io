#!/bin/bash

if ! command -v mdbook &>/dev/null; then
  echo Installing mdBook https://rust-lang.github.io/mdBook/guide/installation.html ...
  cargo install mdbook
fi

mdbook serve --open
