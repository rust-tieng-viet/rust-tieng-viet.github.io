# println!()

Đây là một trong những macro được dùng nhiều nhất trong Rust.
Giúp in nội dung ra standard output, với một dấu newline xuống dòng.

`println!` có cùng cú pháp với [format!](./format.md).

Ví dụ:

```rust
println!(); // prints just a newline
println!("hello there!");
println!("format {} arguments", "some");
```

# In một Struct

```rust
#[derive(Debug)]
struct MyStruct {
  item: String,
  n: i32,
}

let my_struct = MyStruct {
  item: "duyet".to_string(),
  n: 99,
};

println!("my struct = {:?}", my_struct); // my struct = MyStruct { item: "duyet", n: 99 }
```
