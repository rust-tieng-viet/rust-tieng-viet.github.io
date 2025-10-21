# Matching Multiple

Trong Rust, bạn có thể match nhiều pattern trong cùng một arm của `match` expression. Điều này giúp code ngắn gọn và dễ đọc hơn khi nhiều giá trị cần được xử lý giống nhau.

## Match nhiều giá trị với `|` (OR pattern)

Toán tử `|` (pipe) cho phép bạn match nhiều pattern trong cùng một arm:

```rust
fn describe_number(x: i32) {
    match x {
        1 | 2 => println!("Một hoặc hai"),
        3 | 4 | 5 => println!("Ba, bốn hoặc năm"),
        _ => println!("Số khác"),
    }
}

fn main() {
    describe_number(1);  // In ra: Một hoặc hai
    describe_number(4);  // In ra: Ba, bốn hoặc năm
    describe_number(7);  // In ra: Số khác
}
```

## Kết hợp OR pattern với range

Bạn có thể kết hợp nhiều pattern và range trong cùng một arm:

```rust
fn categorize_number(x: i32) {
    match x {
        0 => println!("Số không"),
        1..=10 | 100 => println!("Từ 1 đến 10, hoặc 100"),
        -1 | -2 | -3 => println!("Số âm nhỏ"),
        _ => println!("Số khác"),
    }
}

fn main() {
    categorize_number(5);    // In ra: Từ 1 đến 10, hoặc 100
    categorize_number(100);  // In ra: Từ 1 đến 10, hoặc 100
    categorize_number(-2);   // In ra: Số âm nhỏ
}
```

## Match với ký tự

```rust
fn is_vowel(c: char) -> bool {
    match c {
        'a' | 'e' | 'i' | 'o' | 'u' => true,
        'A' | 'E' | 'I' | 'O' | 'U' => true,
        _ => false,
    }
}

fn main() {
    println!("{}", is_vowel('a'));  // true
    println!("{}", is_vowel('b'));  // false
    println!("{}", is_vowel('E'));  // true
}
```

Hoặc ngắn gọn hơn:

```rust
fn is_vowel(c: char) -> bool {
    match c {
        'a' | 'e' | 'i' | 'o' | 'u' | 'A' | 'E' | 'I' | 'O' | 'U' => true,
        _ => false,
    }
}
```

## Match với enum

OR pattern rất hữu ích khi làm việc với enum:

```rust
enum Direction {
    North,
    South,
    East,
    West,
}

fn is_horizontal(dir: Direction) -> bool {
    match dir {
        Direction::East | Direction::West => true,
        Direction::North | Direction::South => false,
    }
}

fn main() {
    println!("{}", is_horizontal(Direction::East));   // true
    println!("{}", is_horizontal(Direction::North));  // false
}
```

## Ví dụ thực tế: HTTP status codes

```rust
fn handle_status_code(code: u16) {
    match code {
        200 | 201 | 202 | 204 => println!("Success"),
        301 | 302 | 303 | 307 | 308 => println!("Redirect"),
        400 | 401 | 403 | 404 => println!("Client error"),
        500 | 501 | 502 | 503 => println!("Server error"),
        _ => println!("Unknown status"),
    }
}

fn main() {
    handle_status_code(200);  // In ra: Success
    handle_status_code(404);  // In ra: Client error
    handle_status_code(500);  // In ra: Server error
}
```

Hoặc kết hợp với range để ngắn gọn hơn:

```rust
fn handle_status_code(code: u16) {
    match code {
        200..=299 => println!("Success"),
        300..=399 => println!("Redirect"),
        400..=499 => println!("Client error"),
        500..=599 => println!("Server error"),
        _ => println!("Unknown status"),
    }
}
```

## So sánh với ngôn ngữ khác

Trong JavaScript, bạn có thể sử dụng multiple `case` statements mà không có `break`:

```javascript
// JavaScript
function describeNumber(x) {
  switch (x) {
    case 1:
    case 2:
      console.log("Một hoặc hai");
      break;
    case 3:
    case 4:
    case 5:
      console.log("Ba, bốn hoặc năm");
      break;
    default:
      console.log("Số khác");
  }
}
```

Trong Python (từ version 3.10), bạn có thể dùng `|` trong `match`:

```python
# Python 3.10+
def describe_number(x):
    match x:
        case 1 | 2:
            print("Một hoặc hai")
        case 3 | 4 | 5:
            print("Ba, bốn hoặc năm")
        case _:
            print("Số khác")
```

Rust's OR pattern (`|`) tương tự như Python, nhưng được kiểm tra tại compile time để đảm bảo type safety.

## Match với tuple

Bạn cũng có thể sử dụng OR pattern với tuple:

```rust
fn describe_point(point: (i32, i32)) {
    match point {
        (0, 0) => println!("Gốc tọa độ"),
        (0, _) | (_, 0) => println!("Nằm trên trục"),
        (x, y) if x == y => println!("Nằm trên đường chéo"),
        _ => println!("Điểm thông thường"),
    }
}

fn main() {
    describe_point((0, 0));  // In ra: Gốc tọa độ
    describe_point((0, 5));  // In ra: Nằm trên trục
    describe_point((3, 0));  // In ra: Nằm trên trục
    describe_point((4, 4));  // In ra: Nằm trên đường chéo
    describe_point((2, 3));  // In ra: Điểm thông thường
}
```

## Lưu ý quan trọng

Khi sử dụng OR pattern, tất cả các pattern phải bind (gán) cùng một tập hợp các biến. Ví dụ sau sẽ **không** compile:

```rust
// ❌ Lỗi: variable `x` is not bound in all patterns
match (1, 2) {
    (x, _) | (_, x) => println!("{}", x),  // lỗi!
}
```

Lý do là trong pattern đầu tiên `(x, _)`, `x` được bind với phần tử đầu tiên, nhưng trong pattern thứ hai `(_, x)`, `x` được bind với phần tử thứ hai. Compiler không thể xác định `x` nên lấy giá trị nào.

## References

- [Multiple Patterns - The Rust Programming Language](https://doc.rust-lang.org/book/ch18-03-pattern-syntax.html#multiple-patterns)
- [Patterns and Matching](https://doc.rust-lang.org/book/ch18-00-patterns.html)
