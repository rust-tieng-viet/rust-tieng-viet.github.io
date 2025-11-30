# Đo lường Hiệu suất

Bao giờ bạn cũng sẽ gặp câu hỏi kinh điển: "Code mình viết nhanh không?". Thay vì đoán mò hay dựa vào "cảm giác", hãy đo lường nó. Benchmarking chính là cách để làm việc đó - so sánh hiệu suất giữa các phiên bản code khác nhau, xem thay đổi nào thực sự làm chương trình chạy nhanh hơn.

## Tại sao phải đo?

Nhiều khi mình nghĩ một đoạn code "chắc chắn nhanh hơn", nhưng thực tế lại khác. Compiler hiện đại rất thông minh, có khi code trông phức tạp lại chạy nhanh hơn code đơn giản. Không đo thì không biết.

Có câu nói hay: "Mediocre benchmarking is far better than no benchmarking" - Đo tạm tạm vẫn tốt hơn không đo. Đừng để sự hoàn hảo cản trở việc bắt đầu.

## Chuẩn bị gì trước khi đo

Trước tiên cần có dữ liệu test hợp lý. Tốt nhất là dùng dữ liệu thực từ production, không phải data tự nghĩ ra. Nếu app xử lý file JSON thì dùng file JSON thật, đừng tạo data nhỏ xíu cho nó "chạy nhanh".

Về chỉ số đo, có mấy loại phổ biến:
- **Wall-time** là thời gian thực tế user cảm nhận được, dễ hiểu nhưng hay nhảy số
- **CPU cycles** hoặc **instruction count** ổn định hơn, phù hợp khi cần so sánh chính xác
- **Memory usage** quan trọng nếu app xử lý dữ liệu lớn

## Các công cụ trong Rust

### Criterion - Phổ biến nhất

Criterion là thư viện benchmark chuẩn trong Rust. Setup khá đơn giản:

```toml
[dev-dependencies]
criterion = "0.5"

[[bench]]
name = "my_benchmark"
harness = false
```

Viết benchmark cũng straightforward:

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 1,
        1 => 1,
        n => fibonacci(n-1) + fibonacci(n-2),
    }
}

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("fib 20", |b| b.iter(|| fibonacci(black_box(20))));
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
```

Chạy với `cargo bench` là xong. Cái `black_box()` ở đây ngăn compiler "thông minh" quá, tối ưu mất cả đoạn code cần đo.

### Divan - Lựa chọn mới hơn

Divan ra đời gần đây, API đơn giản hơn Criterion một chút:

```rust
fn main() {
    divan::main();
}

#[divan::bench]
fn parse_num() {
    let input = "42";
    let output: i32 = input.parse().unwrap();
    assert_eq!(output, 42);
}
```

Thích cái cú pháp `#[divan::bench]` giống `#[test]`, nhìn quen mắt. Kết quả hiển thị cũng đẹp hơn.

### Hyperfine - Đo từ command line

Hyperfine hữu ích khi muốn so sánh tổng thể hai version của chương trình, không cần viết code:

```bash
cargo install hyperfine
hyperfine './target/release/myapp-v1' './target/release/myapp-v2'
```

Nó sẽ chạy nhiều lần, đưa ra con số trung bình và cho biết version nào nhanh hơn bao nhiêu lần. Rất tiện khi làm POC.

```
Benchmark 1: ./target/release/myapp-v1
  Time (mean ± σ):     142.3 ms ±   2.1 ms

Benchmark 2: ./target/release/myapp-v2
  Time (mean ± σ):      89.7 ms ±   1.8 ms

Summary
  './target/release/myapp-v2' ran 1.59 times faster
```

### Built-in benchmark của Rust

Rust có sẵn framework benchmark nhưng chỉ chạy trên nightly. Ít người dùng vì Criterion/Divan đã đủ tốt và chạy trên stable.

## Mấy điều cần nhớ

**Luôn dùng release mode.** Benchmark trên dev build không có ý nghĩa gì. Chạy `cargo bench` thì nó tự động dùng release rồi.

**Đổi từng cái một.** Đừng sửa 5 chỗ rồi benchmark - sẽ không biết cái nào thực sự giúp ích. Sửa một chỗ, đo, xem kết quả, rồi mới sửa tiếp.

**Đảm bảo môi trường ổn định.** Đóng Chrome đi, tắt Slack, đừng vừa benchmark vừa xem YouTube. CPU throttling cũng ảnh hưởng - máy quá nóng thì CPU chạy chậm lại.

**Chú ý xu hướng, không phải con số tuyệt đối.** Việc "nhanh hơn 20%" quan trọng hơn "chạy mất 100ms". Vì môi trường chạy khác nhau sẽ cho số khác nhau.

**Test nhiều trường hợp.** Tối ưu cho case A có khi làm chậm case B. Đừng quá tập trung vào một scenario.

## Ví dụ thực tế

Giả sử muốn so sánh iterator vs loop truyền thống:

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn sum_even_iter(numbers: &[i32]) -> i32 {
    numbers.iter()
        .filter(|&&x| x % 2 == 0)
        .sum()
}

fn sum_even_loop(numbers: &[i32]) -> i32 {
    let mut sum = 0;
    for &num in numbers {
        if num % 2 == 0 {
            sum += num;
        }
    }
    sum
}

fn benchmark_sum_even(c: &mut Criterion) {
    let numbers: Vec<i32> = (0..10000).collect();

    c.bench_function("sum_even_iter", |b| {
        b.iter(|| sum_even_iter(black_box(&numbers)))
    });

    c.bench_function("sum_even_loop", |b| {
        b.iter(|| sum_even_loop(black_box(&numbers)))
    });
}

criterion_group!(benches, benchmark_sum_even);
criterion_main!(benches);
```

Chạy rồi sẽ thấy hai cách này performance gần như nhau (nhờ compiler tối ưu), nhưng iterator code ngắn gọn hơn.

## Benchmark liên tục trong CI

Nếu dự án lớn, nên setup benchmark trong CI để theo dõi performance regression. Có mấy dịch vụ hay:

- **Bencher.dev** - tracking benchmark qua thời gian
- **CodSpeed** - support Criterion và Divan
- **GitHub Actions** - tự chạy benchmark mỗi PR

Như vậy nếu ai đó commit code làm chậm app, sẽ phát hiện ngay.

## Kết

Benchmark không khó, quan trọng là bắt đầu. Đừng nghĩ phải làm sao cho hoàn hảo. Cài Criterion hoặc Divan, viết vài test case đơn giản, chạy thử. Từ đó mới hiểu được code chạy như thế nào.

Nhớ là: đo trước khi tối ưu, đổi từng cái một, và luôn verify bằng con số chứ đừng tin vào "cảm giác".

---

**Đọc thêm:**
- [The Rust Performance Book - Benchmarking](https://nnethercote.github.io/perf-book/benchmarking.html)
- [Criterion.rs Documentation](https://bheisler.github.io/criterion.rs/book/)
- [Divan Documentation](https://docs.rs/divan/latest/divan/)
