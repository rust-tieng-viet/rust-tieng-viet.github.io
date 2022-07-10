# use Enum::{Variants}

Ta có thể mang variants ra ngoài scope của enum bằng `use`.

```rust,editable
enum Coin {
  Penny,
  Nickel,
  Dime,
  Quarter,
}

// hoặc
// use self::Coin::{Penny, Nickel, Dime, Quarter};
use Coin::*;

fn value_in_cents(coin: Coin) -> u8 {
  match coin {
    Penny => 1,
    Nickel => 5,
    Dime => 10,
    Quarter => 25,
  }
}

fn main() {
  assert_eq!(value_in_cents(Penny), 1);
  assert_eq!(value_in_cents(Coin::Penny), 1);
}
```
