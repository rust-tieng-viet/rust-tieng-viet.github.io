# [`async_trait`]

Rust chưa hỗ trợ `async` cho trait. Trait dưới đây sẽ báo lỗi:

```rust
trait MyTrait {
    async fn f() {}
}
```

```
error[E0706]: trait fns cannot be declared `async`
 --> src/main.rs:4:5
  |
4 |     async fn f() {}
  |     ^^^^^^^^^^^^^^^
```

[`async_trait`] cung cấp attribute macro để giúp async có thể hoạt động với trait.

File: Cargo.toml

```toml
[dependencies]
async_trait = "0.1"
```

Ví dụ:

```rust
use async_trait::async_trait;

#[async_trait]
trait Advertisement {
    async fn run(&self);
}

struct Modal;

#[async_trait]
impl Advertisement for Modal {
    async fn run(&self) {
        self.render_fullscreen().await;
        for _ in 0..4u16 {
            remind_user_to_join_mailing_list().await;
        }
        self.hide_for_now().await;
    }
}

struct AutoplayingVideo {
    media_url: String,
}

#[async_trait]
impl Advertisement for AutoplayingVideo {
    async fn run(&self) {
        let stream = connect(&self.media_url).await;
        stream.play().await;

        // Video probably persuaded user to join our mailing list!
        Modal.run().await;
    }
}
```

### References

- Doc: <https://docs.rs/anyhow>
- Github: <https://github.com/dtolnay/anyhow>
- [why async fn in traits are hard](https://smallcultfollowing.com/babysteps/blog/2019/10/26/async-fn-in-traits-are-hard/)

[`async_trait`]: https://docs.rs/async-trait

