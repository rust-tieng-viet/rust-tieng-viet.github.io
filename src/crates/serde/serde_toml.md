# serde_toml

[`serde`] đọc và xử lý TOML file.

File: Cargo.toml

```toml
[dependencies]
serde = "1"
toml = "1"
```


Ví dụ deserialize từ TOML file:

```rust
use serde::Deserialize;

#[derive(Deserialize)]
struct Config {
   ip: String,
   port: Option<u16>,
   keys: Keys,
}

#[derive(Deserialize)]
struct Keys {
   github: String,
   travis: Option<String>,
}

let config: Config = toml::from_str(r#"
   ip = '127.0.0.1'

   [keys]
   github = 'xxxxxxxxxxxxxxxxx'
   travis = 'yyyyyyyyyyyyyyyyy'
"#).unwrap();

assert_eq!(config.ip, "127.0.0.1");
assert_eq!(config.port, None);
assert_eq!(config.keys.github, "xxxxxxxxxxxxxxxxx");
assert_eq!(config.keys.travis.as_ref().unwrap(), "yyyyyyyyyyyyyyyyy");
```

Ví dụ serialize sang TOML file:

```rust
use serde::Serialize;

#[derive(Serialize)]
struct Config {
   ip: String,
   port: Option<u16>,
   keys: Keys,
}

#[derive(Serialize)]
struct Keys {
   github: String,
   travis: Option<String>,
}

let config = Config {
   ip: "127.0.0.1".to_string(),
   port: None,
   keys: Keys {
       github: "xxxxxxxxxxxxxxxxx".to_string(),
       travis: Some("yyyyyyyyyyyyyyyyy".to_string()),
   },
};

let toml = toml::to_string(&config).unwrap();
println!("{}", toml);
```

# Reference

- [`serde`]
- [https://docs.rs/toml](https://docs.rs/toml)


[`serde`]: ../serde.md