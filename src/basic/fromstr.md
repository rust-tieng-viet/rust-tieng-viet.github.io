# `FromStr`

[FromStr](https://doc.rust-lang.org/std/str/trait.FromStr.html) 
là một trait để khởi tạo instance từ string trong Rust, 
nó tương đương abstract class nếu bạn có background OOP.

```rust
pub trait FromStr {
  type Err;
  fn from_str(s: &str) -> Result<Self, Self::Err>;
}
```

Thường phương thức `from_str` của `FromStr` thường được ngầm định 
sử dụng thông qua phương thức 
[parse](https://doc.rust-lang.org/nightly/std/primitive.str.html#method.parse) 
của [str](https://doc.rust-lang.org/nightly/std/primitive.str.html). Ví dụ:

```rust
// Thay vì
let one = u32::from_str("1");

// thì sử dụng phương thức parse
let one: u32 = "1".parse().unwrap();
assert_eq!(1, one);

// parse() sử dụng turbofish ::<>
let two = "2".parse::<u32>(); 
assert_eq!(Ok(2), two);

let nope = "j".parse::<u32>();
assert!(nope.is_err());
```

`parse` là một phương thức general nên thường được sử dụng với kiểu dữ liệu
như trên hoặc sử dụng [turbofish](./turbofish.md) `::<>` để thuật toán inference
có thể hiểu để parse thành đúng kiểu bạn cần.

# Parse `str` to `Struct`

Bạn có 1 struct và muốn parse 1 str thành struct đó, bạn sẽ cần impl trait `FromStr`

```rust
use std::str::FromStr;
use std::num::ParseIntError;

#[derive(Debug, PartialEq)]
struct Point {
  x: i32,
  y: i32
}

impl FromStr for Point {
  type Err = ParseIntError;

  fn from_str(s: &str) -> Result<Self, Self::Err> {
    let coords: Vec<&str> = s.trim_matches(|p| p == '(' || p == ')' )
                               .split(',')
                               .collect();

    let x_fromstr = coords[0].parse::<i32>()?;
    let y_fromstr = coords[1].parse::<i32>()?;

    Ok(Point { x: x_fromstr, y: y_fromstr })
  }
}

// Có nhiều cách
let p: Point = "(1,2)".parse();
let p = "(1,2)".parse::<Point>();
let p = Point::from_str("(1,2)");

assert_eq!(p.unwrap(), Point{ x: 1, y: 2} )
```

# Parse `str` to `Enum`

Một điều mình nhận thấy để code dễ đọc, dễ maintain hơn là 
ta nên sử dụng Enum thay cho string để so sánh giá trị. Ví dụ:

```rust
fn print(color: &str, text: &str) { ... }
print("Foobar", "blue");
```

Thay vì đó mà hãy sử dụng enum:

```rust
enum Color { Red, Green, CornflowerBlue }

fn print(color: Color, text: &str) { ... }
print(Green, "duyet");
```

Cũng nên hạn chế sử dụng quá nhiều Boolean, thực tế Boolean cũng chỉ là 1 enum

```rust
enum bool { true, false }
```

Thay vào đó hãy tự định nghĩa enum cho các ngữ cảnh khác nhau để code dễ đọc hơn:

```rust
enum EnvVars { Clear, Inherit }
enum DisplayStyle { Color, Monochrome } 
```

Chúng ta implement [std::str::FromStr](https://doc.rust-lang.org/std/str/trait.FromStr.html) trait như sau:

```rust
use std::str::FromStr;

#[derive(Debug, PartialEq)]
enum Color {
  Red,
  Green,
  Blue
}

impl FromStr for Color {
  type Err = ();

  fn from_str(input: &str) -> Result<Color, Self::Err> {
    match input {
      "red"   => Ok(Color::Red),
      "green" => Ok(Color::Green),
      "blue"  => Ok(Color::Blue),
      _       => Err(()),
    }
  }
}

let c: Color = "red".parse().unwrap();
assert_eq!(c, Color::Red);
```

# References

- [Trait](./trait.md)
- [https://doc.rust-lang.org/nightly/std/primitive.str.html#method.parse](https://doc.rust-lang.org/nightly/std/primitive.str.html#method.parse)
- [https://doc.rust-lang.org/nightly/std/str/trait.FromStr.html](https://doc.rust-lang.org/nightly/std/str/trait.FromStr.html)
