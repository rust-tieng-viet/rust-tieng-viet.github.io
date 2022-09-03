# [`anyhow`]

[`anyhow`] là thư viện giúp đơn giản hóa việc handle lỗi trong Rust application.

File: Cargo.toml

```toml
[dependencies]
anyhow = "1"
```

Cách sử dụng

- Sử dụng `anyhow::Result<T>` thay cho `Result` của `std`. Ta không cần định nghĩa Error trả về. Trong function sử dụng `?` để trả mọi error đã được impl `std::error::Error` lên level cao hơn. 

    ```rust
    use anyhow::Result;

    fn get_cluster_info() -> Result<ClusterMap> {
        let config = std::fs::read_to_string("cluster.json")?;
        let map: ClusterMap = serde_json::from_str(&config)?;
        Ok(map)
    }
    ```

- Thêm context để debug dễ hơn:

    ```rust
    use anyhow::{Context, Result};

    fn main() -> Result<()> {
        ...
        it.detach().context("Failed to detach the important thing")?;

        let content = std::fs::read(path)
            .with_context(|| format!("Failed to read instrs from {}", path))?;
        ...
    }
    ```

    ```
    Error: Failed to read instrs from ./path/to/instrs.json

    Caused by:
        No such file or directory (os error 2)
    ```

- Return lỗi nhanh hơn với macros [`anyhow!`], [`bail!`], [`ensure!`]

    ```rust
    return Err(anyhow!("Missing attribute: {}", missing));
    ```

    ```rust
    bail!("Missing attribute: {}", missing);    
    ```

    ```rust
    ensure!(user == 0, "only user 0 is allowed");
    ```

### References

- Doc: <https://docs.rs/anyhow>
- Github: <https://github.com/dtolnay/anyhow>


[`anyhow`]: https://docs.rs/anyhow
[`anyhow!`]: https://docs.rs/anyhow/latest/anyhow/macro.anyhow.html
[`bail!`]: https://docs.rs/anyhow/latest/anyhow/macro.bail.html
[`ensure!`]: https://docs.rs/anyhow/latest/anyhow/macro.ensure.html
