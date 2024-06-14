# serde

A generic serialization/deserialization framework

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let point = Point { x: 1, y: 2 };

    // Convert the Point to a JSON string.
    let serialized = serde_json::to_string(&point).unwrap();

    // Prints serialized = {"x":1,"y":2}
    println!("serialized = {}", serialized);

    // Convert the JSON string back to a Point.
    let deserialized: Point = serde_json::from_str(&serialized).unwrap();

    // Prints deserialized = Point { x: 1, y: 2 }
    println!("deserialized = {:?}", deserialized);
}
```

# Data formats

- [serde_json](./serde/serde_json.md)
- [serde_yaml](./serde/serde_yaml.md)
- [serde_toml](./serde/serde_toml.md)
- [serde_csv](./serde/serde_csv.md)


# References

- http://serde.rs