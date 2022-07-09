# `#[attributes]`

Attribute là metadata được apply cho một số module, crate hoặc item.
Metadata này được dùng cho việc:

- [conditional compilation of code](https://doc.rust-lang.org/rust-by-example/attribute/cfg.html): compile code theo điều kiện, ví dụ một số code sẽ chỉ được compile cho tests, cho OS cụ thể, cho một số feature nào đó, etc.

    ```rust
    // This function only gets compiled if the target OS is linux
    #[cfg(target_os = "linux")]
    fn are_you_on_linux() {
        println!("You are running linux!");
    }

    // And this function only gets compiled if the target OS is *not* linux
    #[cfg(not(target_os = "linux"))]
    fn are_you_on_linux() {
        println!("You are *not* running linux!");
    }
    ```

- [set crate name, version and type (binary or library)](https://doc.rust-lang.org/rust-by-example/attribute/crate.html)

    ```rust
    // This crate is a library
    #![crate_type = "lib"]
    // The library is named "rary"
    #![crate_name = "rary"]

    pub fn public_function() {
        println!("called rary's `public_function()`");
    }
    ```


- disable lints (warnings)
- bật một số tính năng của compiler (macros, glob imports, etc.)
- link đến foreign library
- đánh dấu các function là unit tests

    ```rust
    #[test]
    fn test_hello() {
        assert!("hello");
    }
    ```

- đánh dấu function là một phần của benchmark

Khi một attributes được apply cho cả crate, cú pháp là `#![crate_attribute]`.
Khi apply cho một module hoặc item, cú pháp là `#[item_attribute]` (không có dấu `!`).

Attributes cũng có thể có tham số:

- `#[attribute = "value"]`
- `#[attribute(key = "value")]`
- `#[attribute(value)]`

Attributes có thể có nhiều giá trị, có thể break thành nhiều dòng:

```rust
#[attribute(value, value2)]

#[attribute(value, value2, value3,
            value4, value5)]
```