# panic

Cơ chế đơn giản nhất để xử lý lỗi là `panic!`. Panic sẽ in error message 
và thường sẽ thoát chương trình.

```rust
fn drink(beverage: &str) {
    if beverage == "lemonade" { panic!("AAAaaaaa!!!!"); }

    println!("Some refreshing {} is all I need.", beverage);
}

fn main() {
    drink("water");
    drink("lemonade");
}
```
