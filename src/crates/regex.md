# [`regex`]

Regular expressions cho Rust.

## Cài đặt

```bash
cargo add regex
```

Hoặc

```toml
# File: Cargo.toml

[dependencies]
regex = "1"
```

## Sử dụng

```rust
use regex::Regex;

fn main() {
    let re = Regex::new(r"(\d{4})-(\d{2})-(\d{2})").unwrap();
    let hay = "On 2010-03-14, foo happened. On 2014-10-14, bar happened.";

    let mut dates = vec![];
    for (_, [year, month, day]) in re.captures_iter(hay).map(|c| c.extract()) {
        dates.push((year, month, day));
    }
    assert_eq!(dates, vec![
      ("2010", "03", "14"),
      ("2014", "10", "14"),
    ]);
}
```

## References

- https://docs.rs/regex
- https://crates.io/crates/regex


[`regex`]: https://crates.io/crates/regex