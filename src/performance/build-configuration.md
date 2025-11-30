# Cấu hình Build để Tối ưu Hiệu suất

Một trong những cách mạnh mẽ nhất để cải thiện hiệu suất Rust là thông qua cấu hình build - và điểm tuyệt vời là bạn **không cần thay đổi code**! Bài viết này sẽ hướng dẫn các cách cấu hình Cargo để tối ưu hóa tốc độ chạy, kích thước binary, và thời gian compile.

## Hiểu về Profile

Rust có hai profile mặc định:

- **`dev`** (development): Tối ưu cho tốc độ compile, không tối ưu code
- **`release`**: Tối ưu cho hiệu suất runtime, compile chậm hơn

```bash
cargo build          # Sử dụng dev profile
cargo build --release # Sử dụng release profile
```

Sự khác biệt có thể lên đến **10-100x** về tốc độ chạy!

## Trade-offs (Đánh đổi)

> "Most configuration choices will improve one or more characteristics while worsening one or more others."

Hầu hết các lựa chọn cấu hình đều có sự đánh đổi:

- **Tăng tốc độ runtime** ↔ **Tăng thời gian compile**
- **Giảm kích thước binary** ↔ **Giảm tốc độ runtime**
- **Debug dễ hơn** ↔ **Binary lớn hơn**

Hãy đo lường (benchmark) từng thay đổi để đảm bảo nó mang lại hiệu quả như mong đợi!

## 1. Tối ưu Tốc độ Runtime

### 1.1. Codegen Units

Theo mặc định, Rust chia code thành nhiều "codegen units" để compile song song nhanh hơn. Nhưng điều này giảm khả năng tối ưu hóa cross-crate.

```toml
[profile.release]
codegen-units = 1
```

**Hiệu quả:**
- ✅ Tăng tốc độ runtime (thường 5-15%)
- ✅ Giảm kích thước binary
- ❌ Tăng thời gian compile

**Khi nào dùng:** Production builds, khi hiệu suất quan trọng hơn thời gian compile.

### 1.2. Link-Time Optimization (LTO)

LTO cho phép compiler tối ưu hóa xuyên suốt các crate dependencies.

```toml
[profile.release]
lto = true  # hoặc "fat" - LTO đầy đủ
# lto = "thin"  # Cân bằng giữa tốc độ compile và tối ưu
```

**Ba loại LTO:**

1. **Thin local LTO** (mặc định): Chỉ tối ưu trong từng crate
2. **Thin LTO** (`lto = "thin"`): Tối ưu cross-crate, cân bằng
3. **Fat LTO** (`lto = true` hoặc `"fat"`): Tối ưu mạnh nhất

**Hiệu quả:**
- ✅ Cải thiện tốc độ 10-20% hoặc hơn
- ✅ Giảm kích thước binary
- ❌ Tăng thời gian compile đáng kể (có thể gấp đôi)

**Ví dụ cấu hình cân bằng:**

```toml
[profile.release]
lto = "thin"
codegen-units = 1
```

### 1.3. Alternative Allocators (Bộ cấp phát bộ nhớ)

Rust mặc định dùng system allocator, nhưng các allocator khác có thể nhanh hơn.

#### jemalloc

```toml
[dependencies]
tikv-jemallocator = "0.6"
```

```rust
use tikv_jemallocator::Jemalloc;

#[global_allocator]
static GLOBAL: Jemalloc = Jemalloc;
```

#### mimalloc

```toml
[dependencies]
mimalloc = "0.1"
```

```rust
use mimalloc::MiMalloc;

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;
```

**Hiệu quả:**
- Có thể tăng tốc độ **5-20%** tùy workload
- Giảm memory usage trong một số trường hợp
- Đặc biệt hiệu quả với multi-threaded applications

**Transparent Huge Pages (THP):**

Với jemalloc, bạn có thể sử dụng huge pages:

```bash
MALLOC_CONF=thp:always ./myapp
```

### 1.4. CPU-Specific Instructions

Cho phép compiler sử dụng các instruction đặc thù của CPU (như AVX, AVX2, AVX-512).

```toml
[profile.release]
[target.'cfg(target_arch = "x86_64")']
rustflags = ["-C", "target-cpu=native"]
```

Hoặc build với:

```bash
RUSTFLAGS="-C target-cpu=native" cargo build --release
```

**⚠️ Lưu ý:** Binary chỉ chạy được trên CPU tương tự. Không phù hợp cho distribution.

**Hiệu quả:**
- Cải thiện 10-30% với workload intensive (SIMD operations)
- Không tốn thời gian compile thêm

### 1.5. Profile-Guided Optimization (PGO)

PGO là kỹ thuật nâng cao: compile, chạy với workload thực tế, rồi compile lại với thông tin profiling.

**Bước 1:** Build với instrumentation

```bash
RUSTFLAGS="-Cprofile-generate=/tmp/pgo-data" \
    cargo build --release
```

**Bước 2:** Chạy chương trình với workload đại diện

```bash
./target/release/myapp <typical-workload>
```

**Bước 3:** Rebuild với profile data

```bash
rustup run stable bash -c \
    'RUSTFLAGS="-Cprofile-use=/tmp/pgo-data/merged.profdata" \
     cargo build --release'
```

**Hiệu quả:**
- Cải thiện **10-20%** hoặc hơn
- Đặc biệt tốt cho hot paths và branch prediction
- Phức tạp để setup

## 2. Tối ưu Kích thước Binary

### 2.1. Optimization Level cho Size

```toml
[profile.release]
opt-level = "z"  # Tối ưu kích thước mạnh nhất
# opt-level = "s"  # Tối ưu kích thước ít mạnh hơn
```

**Các level:**
- `0`: Không tối ưu
- `1`: Tối ưu cơ bản
- `2`: Tối ưu vừa phải
- `3`: Tối ưu mạnh (mặc định cho release)
- `"s"`: Tối ưu cho size
- `"z"`: Tối ưu cho size mạnh nhất

**Hiệu quả:**
- Giảm 10-30% kích thước binary
- ❌ Có thể giảm tốc độ runtime 5-15%

### 2.2. Panic Strategy

```toml
[profile.release]
panic = "abort"
```

Thay vì unwinding stack khi panic, chương trình sẽ abort ngay lập tức.

**Hiệu quả:**
- Giảm đáng kể kích thước binary
- ❌ Không thể catch panic
- ❌ Không chạy destructors khi panic

### 2.3. Strip Debug Symbols

```toml
[profile.release]
strip = true  # hoặc "symbols" hoặc "debuginfo"
```

**Hiệu quả:**
- Giảm kích thước binary đáng kể
- ❌ Khó debug khi có vấn đề production

### 2.4. Config cho Binary nhỏ nhất

Kết hợp tất cả:

```toml
[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"
strip = true
```

**Thêm nữa với Cargo.toml:**

```toml
[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"
strip = true

[dependencies]
# Sử dụng features minimal khi có thể
serde = { version = "1.0", default-features = false }
```

## 3. Tối ưu Thời gian Compile

### 3.1. Sử dụng Linker nhanh hơn

Linker mặc định (ld) khá chậm. Các alternative:

#### mold (Nhanh nhất, Linux)

```toml
# .cargo/config.toml
[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=mold"]
```

#### lld (Cross-platform)

```toml
# .cargo/config.toml
[target.x86_64-unknown-linux-gnu]
rustflags = ["-C", "link-arg=-fuse-ld=lld"]
```

**Cài đặt:**

```bash
# Linux
sudo apt install mold lld

# macOS
brew install llvm
```

**Hiệu quả:**
- Giảm thời gian linking **50-80%**
- Không ảnh hưởng đến runtime performance

### 3.2. Tăng Codegen Units (Dev)

```toml
[profile.dev]
codegen-units = 256  # Mặc định là 256
```

Nhiều codegen units = compile song song nhiều hơn.

### 3.3. Tắt Debug Info trong Dev

```toml
[profile.dev]
debug = 0  # Tắt hoàn toàn
# debug = 1  # Debug info cơ bản
```

**Hiệu quả:**
- Giảm thời gian compile **20-40%**
- Giảm disk usage
- ❌ Khó debug hơn với debugger

### 3.4. Incremental Compilation

```toml
[profile.dev]
incremental = true  # Mặc định đã bật
```

Cargo lưu trữ kết quả compile và chỉ compile lại phần thay đổi.

### 3.5. Sử dụng Workspace Dependencies

Nếu có nhiều crates, sử dụng workspace để tránh compile trùng lặp:

```toml
# Workspace Cargo.toml
[workspace]
members = ["crate1", "crate2", "crate3"]

[workspace.dependencies]
serde = "1.0"
tokio = "1.0"
```

## 4. Config Tổng hợp theo Mục đích

### Config cho Production (Tốc độ tối đa)

```toml
[profile.release]
opt-level = 3
lto = "thin"
codegen-units = 1
panic = "abort"

[target.x86_64-unknown-linux-gnu]
rustflags = ["-C", "target-cpu=native"]
```

### Config cho Development (Compile nhanh)

```toml
[profile.dev]
opt-level = 0
debug = 1
incremental = true

# .cargo/config.toml
[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=mold"]
```

### Config cho Distribution Binary (Size nhỏ)

```toml
[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"
strip = true
```

## 5. Công cụ Kiểm tra

### Kiểm tra kích thước binary

```bash
# Xem tổng kích thước
ls -lh target/release/myapp

# Phân tích chi tiết
cargo bloat --release
```

### So sánh hiệu quả LTO

```bash
# Không LTO
cargo build --release
hyperfine './target/release/myapp'

# Với LTO
# Thêm lto = true vào Cargo.toml
cargo build --release
hyperfine './target/release/myapp'
```

### Đo thời gian compile

```bash
cargo clean
time cargo build --release
```

## Best Practices

1. **Benchmark mọi thay đổi** - Đừng giả định, hãy đo lường
2. **Bắt đầu với config đơn giản** - Từng bước một
3. **Khác nhau giữa dev và release** - Dev cần compile nhanh, release cần chạy nhanh
4. **Document config của bạn** - Giải thích tại sao chọn từng option
5. **Kiểm tra trên target platform** - `target-cpu=native` chỉ tốt cho local

## Ví dụ Thực tế: API Server

```toml
# Cargo.toml
[package]
name = "api-server"
version = "0.1.0"
edition = "2021"

[profile.release]
opt-level = 3           # Tối ưu tốc độ
lto = "thin"            # Cân bằng compile time và performance
codegen-units = 1       # Tối ưu tốt hơn
strip = true            # Binary nhỏ hơn
panic = "abort"         # Không cần unwinding

[profile.dev]
opt-level = 0
debug = 1               # Debug info cơ bản
incremental = true

[dependencies]
tokio = { version = "1", features = ["full"] }
axum = "0.7"
```

```toml
# .cargo/config.toml
[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=mold"]

[target.x86_64-apple-darwin]
rustflags = ["-C", "link-arg=-fuse-ld=/opt/homebrew/opt/llvm/bin/ld64.lld"]
```

## Tài liệu và Thử nghiệm

### Thử nghiệm các config

Tạo script để test nhiều config:

```bash
#!/bin/bash
# benchmark-configs.sh

configs=(
    "default"
    "lto-thin"
    "lto-fat"
    "opt-size"
)

for config in "${configs[@]}"; do
    echo "Testing $config..."
    cp "configs/$config.toml" Cargo.toml
    cargo build --release
    hyperfine --warmup 3 './target/release/myapp'
done
```

## Kết luận

Cấu hình build là một công cụ mạnh mẽ để cải thiện hiệu suất Rust mà không cần thay đổi code. Những điểm chính cần nhớ:

1. **Release mode là bắt buộc** cho production
2. **LTO và codegen-units=1** là những cải thiện dễ dàng nhất
3. **Alternative linkers** giảm đáng kể compile time
4. **Luôn benchmark** để xác nhận cải thiện
5. **Khác nhau giữa dev và release profiles**

Mỗi dự án có nhu cầu khác nhau - hãy thử nghiệm và tìm ra config phù hợp nhất cho use case của bạn!

---

**Tài liệu tham khảo:**
- [The Rust Performance Book - Build Configuration](https://nnethercote.github.io/perf-book/build-configuration.html)
- [Cargo Book - Profiles](https://doc.rust-lang.org/cargo/reference/profiles.html)
- [rustc Book - Codegen Options](https://doc.rust-lang.org/rustc/codegen-options/index.html)
- [Profile-Guided Optimization](https://doc.rust-lang.org/rustc/profile-guided-optimization.html)
