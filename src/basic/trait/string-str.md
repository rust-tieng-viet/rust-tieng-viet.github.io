# Bonus: `String` và `&str`

Nếu bạn có một `String` và `&` reference, Rust sẽ convert nó thành `&str` khi bạn cần.

```rust,editable
fn prints_country(country_name: &str) {
  println!("{}", country_name);
}

fn main() {
  let country = String::from("Duyet");
  prints_country(&country);
  prints_country(&country);
}
```

`&str` là một kiểu hơi phức tạp. 

- Nó có thể vừa là String literals `let s = "I am &str";`. Trường hợp này `s` có kiểu `&'static` bởi vì nó được ghi trực tiếp vào binary. 
- `&str` cũng có thể là borrowed của `str` hoặc `String`.
