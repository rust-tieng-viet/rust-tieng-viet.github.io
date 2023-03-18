## [`env_logger`]

[`log`] thường được sử dụng với [`env_logger`] để cấu hình logging
thông qua biến môi trường.

Mặc định, `env_logger` ghi log ra `stderr`.

File: Cargo.toml

```toml
[dependencies]
log = "0.4.0"
env_logger = "0.8.4"
```

Ví dụ:

File: src/main.rs

```rust
fn main() {
  env_logger::init();

  info!("starting up");
  error!("this is error!");
  debug!("this is debug {}!", "message");
}
```


```
$ RUST_LOG=error cargo run
[2022-07-11T02:12:24Z ERROR main] this is error
```

```
$ RUST_LOG=info cargo run
[2022-07-11T02:12:24Z INFO main] starting up
[2022-07-11T02:12:24Z ERROR main] this is error
```

```
$ RUST_LOG=debug cargo run
[2022-07-11T02:12:24Z INFO main] starting up
[2022-07-11T02:12:24Z ERROR main] this is error
[2022-07-11T02:12:24Z DEBUG main] this is debug message!
```

Filter log theo module name:

```
$ RUST_LOG=main=info cargo run
[2022-07-11T02:12:24Z INFO main] starting up
[2022-07-11T02:12:24Z ERROR main] this is error
```

Hiện mọi log level cho module `main`:

```
$ RUST_LOG=main cargo run
[2022-07-11T02:12:24Z INFO main] starting up
[2022-07-11T02:12:24Z ERROR main] this is error
[2022-07-11T02:12:24Z DEBUG main] this is debug message!
```

[`env_logger`]: https://docs.rs/env_logger
[`log`]: https://docs.rs/log

### References

- Doc: <https://docs.rs/env_logger>
- Github: <https://github.com/env-logger-rs/env_logger/>
- <https://docs.rs/env_logger/>
