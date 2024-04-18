# serde_json

JSON đã trở thành một trong những định dạng trao đổi dữ liệu phổ biến, đa số các ngữ lập trình server-side đều có thể xử lý chúng. Nhờ vào [serde](https://crates.io/crates/serde) và [serde_json](https://crates.io/crates/serde_json) việc xử lý JSON cũng vô cùng dễ dàng với Rust. Các crate này cũng đã được test một cách kỹ càng và nhiều examples vô cùng phong phú dễ sử dụng.

```toml
[dependencies]
serde = "1"
serde_json = "1"
```

# Parse JSON String into Rust

Giả sử chúng ta có đoạn JSON như sau:

```json
{
	"name": "Duyet Le",
	"age": 27,
	"phones": [
		"+60 1234567",
		"+84 2345678"
	]
}
```

Chúng ta sẽ parse thành một giá trị trong Rust:

```rust
use serde_json::{Result, Value};

fn untyped_example() -> Result<()> {
    // Some JSON input data as a &str. Maybe this comes from the user.
    let data = r#"
        {
			"name": "Duyet Le",
			"age": 27,
			"phones": [
				"+60 1234567",
				"+84 2345678"
			]
        }"#;

    // Parse the string of data into serde_json::Value.
    let v: Value = serde_json::from_str(data)?;

    // Access parts of the data by indexing with square brackets.
    println!("Please call {} at the number {}", v["name"], v["phones"][0]);

    Ok(())
}
```

`v` được parse từ JSON là một enum [`serde_json::Value`](https://docs.rs/serde_json/1/serde_json/value/enum.Value.html) cho phép biểu diễn mọi thuộc tính của JSON.

```rust
enum Value {
    Null,
    Bool(bool),
    Number(Number),
    String(String),
    Array(Vec<Value>),
    Object(Map<String, Value>),
}
```

Để truy xuất đến từng thuộc tính:

```rust
v["name"]
v["phones"]
v["phones"][0 ]
```

# Parse JSON into Strongly Typed

Serde cho phép chúng ta map một JSON data vào một kiểu dữ liệu của Rust và có thể do chúng ta tự định nghĩa, một cách tự động:

```rust
use serde::{Deserialize, Serialize};
use serde_json::Result;

#[derive(Serialize, Deserialize)]
struct Person {
    name: String,
    age: u8,
    phones: Vec<String>,
}

fn typed_example() -> Result<()> {
    let data = r#"
        {
			"name": "Duyet Le",
			"age": 27,
			"phones": [
				"+60 1234567",
				"+84 2345678"
			]
        }"#;

    // Parse the string of data into a Person object. This is exactly the
    // same function as the one that produced serde_json::Value above, but
    // now we are asking it for a Person as output.
    let p: Person = serde_json::from_str(data)?;

    // Do things just like with any other Rust data structure.
    println!("Please call {} at the number {}", p.name, p.phones[0]);

    Ok(())
}
```

# Constructing JSON values

`json!` macro giúp chúng ta khởi tạo `serde_json::Value` objects với cú pháp giống hệt JSON string:

```rust
use serde_json::json;

fn main() {
    // The type of `john` is `serde_json::Value`
    let duyet = json!({
        "name": "Duyet Le",
		"age": 27,
		"phones": [
			"+60 1234567",
			"+84 2345678"
		]
    });

    println!("first phone number: {}", duyet["phones"][0]);

    // Convert to a string of JSON and print it out
    println!("{}", duyet.to_string());
}
```

# Convert a Struct to JSON

Một kiểu dữ liệu có thể được convert thành JSON string bởi [`serde_json::to_string`](https://docs.rs/serde_json/1/serde_json/ser/fn.to_string.html). Kiểu dữ liệu này có thể là Struct hoặc Enum có có implement `#[derive(Serialize)]`:

```rust
use serde::{Deserialize, Serialize};
use serde_json::Result;

#[derive(Serialize, Deserialize)]
struct Address {
    street: String,
    city: String,
}

fn print_an_address() -> Result<()> {
    // Some data structure.
    let address = Address {
        street: "Dist 1 Street".to_owned(),
        city: "Ho Chi Minh".to_owned(),
    };

    // Serialize it to a JSON string.
    let j = serde_json::to_string(&address)?;

    // Print, write to a file, or send to an HTTP server.
    println!("{}", j);

    Ok(())
}
```

## References

- [JSON API documentation](https://docs.rs/serde_json)
- [Serde API documentation](https://docs.rs/serde)
- [Detailed documentation about Serde](https://serde.rs/)
- [Setting up `#[derive(Serialize, Deserialize)]`](https://serde.rs/derive.html)
