# [`indoc`]

[`indoc`] là một crate nhỏ nhưng hữu ích giúp canh lề (indented documents).
`indoc!()` macro nhận multiline string và un-indents lúc compile time,
xoá tất cả khoảng trắng đầu tiên trên cách dòng dựa theo dòng đầu tiên.

## Cài đặt

```bash
cargo add indoc
```

Hoặc

```toml
# File: Cargo.toml

[dependencies]
indoc = "1"
```

## Ví dụ

```rust
use indoc::indoc;

fn main() {
    let testing = indoc! {"
        def hello():
            print('Hello, world!')

        hello()
    "};

    let expected = "def hello():\n    print('Hello, world!')\n\nhello()\n";
    assert_eq!(testing, expected);
}
```

[`indoc`] cũng hoạt động với raw string `r# ... #` và byte string `b" ... "`.

## References

- <https://docs.rs/indoc/latest/indoc/>
- <https://github.com/dtolnay/indoc>

[`indoc`]: https://github.com/dtolnay/indoc
