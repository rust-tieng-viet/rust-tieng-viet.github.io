# [`serde_yaml`]

[`serde`] đọc và xử lý file YAML.

File: Cargo.toml

```toml
[dependencies]
serde = { version = "1", features = ["derive"] }
serde_yaml = "*"
```

Ví dụ

```rust
use std::collections::BTreeMap;

fn main() -> Result<(), serde_yaml::Error> {
    // You have some type.
    let mut map = BTreeMap::new();
    map.insert("x".to_string(), 1.0);
    map.insert("y".to_string(), 2.0);

    // Serialize it to a YAML string.
    let yaml = serde_yaml::to_string(&map)?;
    assert_eq!(yaml, "x: 1.0\ny: 2.0\n");

    // Deserialize it back to a Rust type.
    let deserialized_map: BTreeMap<String, f64> = serde_yaml::from_str(&yaml)?;
    assert_eq!(map, deserialized_map);

    println!("BTreeMap:\n{}", yaml);

    Ok(())
}
```

Structs serialize in the obvious way:

```rust
use serde::{Serialize, Deserialize};

#[derive(Debug, PartialEq, Serialize, Deserialize)]
struct Point {
    x: f64,
    y: f64,
}

fn main() -> Result<(), serde_yaml::Error> {
    let point = Point { x: 1.0, y: 2.0 };

    let yaml = serde_yaml::to_string(&point)?;
    assert_eq!(yaml, "x: 1.0\ny: 2.0\n");

    let deserialized_point: Point = serde_yaml::from_str(&yaml)?;
    assert_eq!(point, deserialized_point);
    Ok(())
}
```

[`serde`]: ../serde.md
[`serde_yaml`]: https://github.com/dtolnay/serde-yaml