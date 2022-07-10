# impl Enum

Ta cũng có thể `impl` cho `enum` giống như `struct`.

```rust
enum Day {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

// impl enum
impl Day {
  fn today(self) -> Self {
    self
  }
}

// Trait
trait DayOff {
  fn day_off(self);
}

// impl trait for enum
impl DayOff for Day {
  fn day_off(self) {
    match self.today() {
      Self::Sunday | Self::Saturday => println!("day off"),
      _ => println!("noooo"),
    }
  }
}

let today = Day::Sunday;
today.day_off();
```
