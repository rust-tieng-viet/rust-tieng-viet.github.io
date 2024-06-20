# [`lazy_static`]

[`lazy_static`] là một macro cho phép khởi tạo biến `static` nhưng chứa giá trị
được thực thi lúc runtime. Các giá trị này có thể là bất kỳ cái gì cần heap allocations,
ví dụ như [`Vec`], [`HashMap`] hoặc function call.

## Cài đặt

```bash
cargo add lazy_static
```

Hoặc

```toml
# File: Cargo.toml

[dependencies]
lazy_static = "1"
```

## Ví dụ

```rust
use lazy_static::lazy_static;
use std::collections::HashMap;

lazy_static! {
    static ref HASHMAP: HashMap<u32, &'static str> = {
        let mut m = HashMap::new();
        m.insert(0, "foo");
        m.insert(1, "bar");
        m.insert(2, "baz");
        m
    };
    static ref COUNT: usize = HASHMAP.len();
    static ref NUMBER: u32 = times_two(21);
}

fn times_two(n: u32) -> u32 { n * 2 }

fn main() {
    println!("The map has {} entries.", *COUNT);
    println!("The entry for `0` is \"{}\".", HASHMAP.get(&0).unwrap());
    println!("A expensive calculation on a static results in: {}.", *NUMBER);
}
```

## References

- Doc: <https://docs.rs/lazy_static>
- Github: <https://github.com/rust-lang-nursery/lazy-static.rs>

[`lazy_static`]: https://docs.rs/lazy_static
[`Vec`]: https://doc.rust-lang.org/std/vec/struct.Vec.html
[`HashMap`]: https://doc.rust-lang.org/std/collections/struct.HashMap.html