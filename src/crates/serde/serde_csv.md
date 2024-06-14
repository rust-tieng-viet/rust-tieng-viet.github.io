# serde_toml

[`serde`] đọc và xử lý CSV file.

File: Cargo.toml

```toml
[dependencies]
serde = "1"
csv = "1"
```

Ví dụ parse file CSV:

```rust
use std::io;

let mut rdr = csv::Reader::from_reader(io::stdin());

for result in rdr.records() {
   // An error may occur, so abort the program in an unfriendly way.
   // We will make this more friendly later!
   let record = result.expect("a CSV record");
   // Print a debug version of the record.
   println!("{:?}", record);
}
```

Ví dụ:

```rust
use std::{error::Error, io, process};

#[derive(Debug, serde::Deserialize)]
struct Record {
    city: String,
    region: String,
    country: String,
    population: Option<u64>,
}

fn example() -> Result<(), Box<dyn Error>> {
    let mut rdr = csv::Reader::from_reader(io::stdin());
    for result in rdr.deserialize() {
        // Notice that we need to provide a type hint for automatic
        // deserialization.
        let record: Record = result?;
        println!("{:?}", record);
    }
    Ok(())
}

fn main() {
    if let Err(err) = example() {
        println!("error running example: {}", err);
        process::exit(1);
    }
}
```

# Reference

- [`serde`]
- [https://docs.rs/csv](https://docs.rs/csv)
- [https://docs.rs/csv/latest/csv/tutorial](https://docs.rs/csv/latest/csv/tutorial/index.html)

[`serde`]: ../serde.md