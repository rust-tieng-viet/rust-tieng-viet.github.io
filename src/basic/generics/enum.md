# Generic Enum

[`Option`] và [`Result`] là 2 ví dụ của generic struct.

```rust
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

#### Sử dụng [`Option<T>`]:

{{#playground ../enum/option/option-example.rs}}

Xem thêm: [*Enum > Option<T>*](../enum/option)

#### Sử dụng [`Result<T, E>`]:

{{#playground ../enum/result/result-example.rs}}

Xem tưhêm: [*Enum > Result<T, E>*](../enum/result)

[`Option`]: https://doc.rust-lang.org/std/option/index.html
[`Option<T>`]: https://doc.rust-lang.org/std/option/index.html
[`Result`]: https://doc.rust-lang.org/std/result/index.html
[`Result<T, E>`]: https://doc.rust-lang.org/std/result/index.html
