# Cấu hình Build

Điều hay nhất về tối ưu hiệu suất trong Rust là nhiều khi không cần sửa code. Chỉ cần config Cargo đúng cách, có thể cải thiện đáng kể về tốc độ chạy, giảm kích thước binary, hoặc tăng tốc compile. Mỗi cái có cách riêng, tùy mục đích mà chọn.

## Dev vs Release

Rust có hai profile chính: `dev` và `release`. Dev build nhanh nhưng code chạy chậm, dùng khi đang code. Release build compile lâu hơn nhưng code chạy nhanh, dùng cho production.

```bash
cargo build           # dev - compile nhanh
cargo build --release # release - chạy nhanh
```

Chênh lệch có thể rất lớn, từ 10 đến 100 lần về tốc độ. Ai cũng biết nhưng thỉnh thoảng vẫn có người quên chạy `--release` rồi thắc mắc sao Rust chậm vậy.

## Nguyên tắc đánh đổi

Hầu hết config đều đánh đổi cái này lấy cái kia:
- Muốn chạy nhanh → compile lâu hơn
- Muốn binary nhỏ → có thể chạy chậm đi
- Muốn debug dễ → binary sẽ to hơn

Không có config "best" cho mọi trường hợp. Phải thử và benchmark xem cái nào phù hợp.

## Tăng tốc độ chạy

### Codegen units

Mặc định Rust chia code thành nhiều phần để compile song song. Nhanh là nhanh, nhưng compiler không tối ưu được tốt lắm.

```toml
[profile.release]
codegen-units = 1
```

Set về 1 thì compiler sẽ tối ưu toàn bộ cùng lúc, code chạy nhanh hơn khoảng 5-15%. Tất nhiên là compile sẽ lâu hơn. Dùng cho production build thôi, đừng bật khi đang dev.

### Link-Time Optimization (LTO)

LTO cho phép compiler nhìn thấy toàn bộ code kể cả dependencies, từ đó tối ưu tốt hơn.

```toml
[profile.release]
lto = "thin"  # cân bằng
# hoặc
lto = true    # tối ưu mạnh nhất (fat LTO)
```

Có ba loại:
- Không có LTO (mặc định dev)
- Thin LTO - vừa đủ, không làm compile lâu quá
- Fat LTO - mạnh nhất, compile rất lâu

Thường dùng `lto = "thin"` là hợp lý nhất. Cải thiện 10-20% tốc độ mà không làm compile time tăng quá nhiều.

### Alternative allocators

System allocator của Rust ổn nhưng không phải nhanh nhất. Có thể thử jemalloc hoặc mimalloc:

```toml
[dependencies]
tikv-jemallocator = "0.6"
```

```rust
use tikv_jemallocator::Jemalloc;

#[global_allocator]
static GLOBAL: Jemalloc = Jemalloc;
```

Hoặc mimalloc:

```toml
[dependencies]
mimalloc = "0.1"
```

```rust
use mimalloc::MiMalloc;

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;
```

Tùy app, có thể nhanh hơn 5-20%, đặc biệt với multi-threaded. Nhưng không phải lúc nào cũng vậy, phải benchmark mới biết.

### CPU-specific instructions

Nếu chỉ chạy trên máy mình hoặc môi trường kiểm soát được, bật CPU-specific optimizations:

```bash
RUSTFLAGS="-C target-cpu=native" cargo build --release
```

Compiler sẽ dùng mọi instruction mà CPU hỗ trợ (AVX, AVX2, v.v.). Cải thiện khá tốt cho code intensive, nhưng binary chỉ chạy được trên CPU tương tự.

⚠️ Đừng dùng cho software distribute công khai.

### Profile-Guided Optimization (PGO)

PGO là kiểu: compile → chạy thực tế → compile lại dựa trên data thu được. Khá mạnh nhưng setup hơi phức tạp.

```bash
# Build với instrumentation
RUSTFLAGS="-Cprofile-generate=/tmp/pgo-data" cargo build --release

# Chạy với workload thực tế
./target/release/myapp <real-workload>

# Build lại với profile data
RUSTFLAGS="-Cprofile-use=/tmp/pgo-data/merged.profdata" cargo build --release
```

Thường cải thiện thêm 10-20%. Chỉ đáng làm cho production app quan trọng.

## Giảm kích thước binary

### Optimization level

Thay vì optimize cho tốc độ, có thể optimize cho size:

```toml
[profile.release]
opt-level = "z"  # nhỏ nhất
# hoặc "s"       # nhỏ nhưng không cực đoan
```

Binary nhỏ hơn 10-30%, nhưng có thể chạy chậm đi một chút.

### Panic strategy

```toml
[profile.release]
panic = "abort"
```

Khi panic, thay vì unwinding stack (chạy destructors, cleanup, v.v.), chương trình abort luôn. Binary nhỏ hơn đáng kể, nhưng không thể catch panic nữa.

### Strip symbols

```toml
[profile.release]
strip = true
```

Bỏ debug symbols đi. Binary nhỏ hơn nhiều nhưng debug khó hơn nếu có bug production.

### Config cho binary nhỏ nhất

Kết hợp mọi thứ:

```toml
[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"
strip = true
```

Dùng cho embedded hoặc khi storage/bandwidth quan trọng.

## Tăng tốc compile

### Linker nhanh hơn

Linker mặc định (ld) khá chậm. Dùng mold (Linux) hoặc lld (cross-platform) nhanh hơn rất nhiều:

```bash
# Linux - cài mold
sudo apt install mold
```

```toml
# .cargo/config.toml
[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=mold"]
```

Giảm linking time 50-80%. Đây là change free lunch, không ảnh hưởng gì đến runtime performance.

### Tắt debug info trong dev

```toml
[profile.dev]
debug = 0  # hoặc 1 nếu cần debug đôi khi
```

Compile nhanh hơn 20-40%, binary nhỏ hơn. Nhược điểm là khi dùng debugger sẽ thiếu thông tin.

### Incremental compilation

```toml
[profile.dev]
incremental = true
```

Mặc định đã bật rồi. Cargo sẽ cache kết quả compile và chỉ compile lại phần thay đổi.

## Config gợi ý

### Cho production (tốc độ tối đa)

```toml
[profile.release]
opt-level = 3
lto = "thin"
codegen-units = 1
```

Thêm alternative allocator nếu phù hợp.

### Cho dev (compile nhanh)

```toml
[profile.dev]
opt-level = 0
debug = 1

# .cargo/config.toml
[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=mold"]
```

### Cho binary nhỏ

```toml
[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"
strip = true
```

## Kiểm tra kết quả

Xem kích thước binary:

```bash
ls -lh target/release/myapp
```

Phân tích chi tiết:

```bash
cargo install cargo-bloat
cargo bloat --release
```

So sánh performance:

```bash
hyperfine './target/release/myapp-before' './target/release/myapp-after'
```

## Lưu ý

Mỗi project khác nhau sẽ phản ứng khác nhau với các config này. Cái này chạy tốt với app A chưa chắc tốt với app B.

Quan trọng nhất là benchmark, đừng copy config rồi mong đợi kỳ tích. Thử từng cái một, đo lường, rồi giữ lại cái nào có hiệu quả.

Và nhớ document lại tại sao chọn config đó. Người sau (hoặc chính mình 6 tháng sau) sẽ thắc mắc tại sao lại config như vậy.

---

**Đọc thêm:**
- [The Rust Performance Book - Build Configuration](https://nnethercote.github.io/perf-book/build-configuration.html)
- [Cargo Book - Profiles](https://doc.rust-lang.org/cargo/reference/profiles.html)
- [rustc Codegen Options](https://doc.rust-lang.org/rustc/codegen-options/index.html)
