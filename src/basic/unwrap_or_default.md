### `.unwrap_or_default()`

Trả về giá trị nằm trong `Some`, nếu không trả về giá [default](https://doc.rust-lang.org/std/default/trait.Default.html#tymethod.default).

```rust
let good_year_from_input = "1909";
let bad_year_from_input = "190blarg";
let good_year = good_year_from_input.parse().ok().unwrap_or_default();
let bad_year = bad_year_from_input.parse().ok().unwrap_or_default();

assert_eq!(1909, good_year);
assert_eq!(0, bad_year);
```