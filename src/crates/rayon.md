# [`rayon`]

[`rayon`] là thư viện data-parallelism cho Rust, gọn nhẹ và dễ dàng convert từ
code tính toán tuần tự sang song song mà vẫn đảm bảo không lỗi data-race. 


File: Cargo.toml

```toml
[dependencies]
rayon = "1.5"
```

Ví dụ:

```rust
use rayon::prelude::*;

fn sum_of_squares(input: &[i32]) -> i32 {
    input.par_iter() // <-- chỉ cần sử dụng `par_iter()` thay vì `iter()`!
         .map(|&i| i * i)
         .sum()
}
```

[Parallel iterators](https://docs.rs/rayon/*/rayon/iter/index.html)
sẽ phụ trách việc chia data thành nhiều tasks nhỏ như thế nào và sẽ
đáp ứng linh hoạt để đạt maximum performance. 
Ngoài ra, Rayon cũng cung cấp 2 function [`join`] và [`scope`] để bạn 
có thể chủ động điều khiển việc parallel tasks.


Để tìm hiểu thêm về cách [`rayon`] hoạt động bạn có thể đọc thêm bài blog từ tác giả: 
<https://smallcultfollowing.com/babysteps/blog/2015/12/18/rayon-data-parallelism-in-rust/>

## demo & bench

Trong repo của [`rayon`] có rất nhiều demo và bench, để xem danh sách demo hoặc bench:

```bash
$ git clone https://github.com/rayon-rs/rayon && cd rayon/rayon-demo 
$ cargo run --release -- --help

Usage: rayon-demo bench
       rayon-demo <demo-name> [ options ]
       rayon-demo --help

A collection of different benchmarks of Rayon. You can run the full
benchmark suite by executing `cargo bench` or `rayon-demo bench`.

Alternatively, you can run individual benchmarks by running
`rayon-demo foo`, where `foo` is the name of a benchmark. Each
benchmark has its own options and modes, so try `rayon-demo foo
--help`.

Benchmarks:

  - life : Conway's Game of Life.
  - nbody: A physics simulation of multiple bodies attracting and repelling
           one another.
  - sieve: Finding primes using a Sieve of Eratosthenes.
  - matmul: Parallel matrix multiplication.
  - mergesort: Parallel mergesort.
  - noop: Launch empty tasks to measure CPU usage.
  - quicksort: Parallel quicksort.
  - tsp: Traveling salesman problem solver (sample data sets in `data/tsp`).
```

**Quicksort** benchmark:

```bash
$ cargo run --release quicksort bench

seq: sorted 250000000 ints: 22.268583 s
par: sorted 250000000 ints: 4.172599 s
speedup: 5.34x
```

**Demo nbody visualize**: gõ `s` để chạy tuần tự và `p` để parallel

```bash
cargo run --release -- nbody visualize
```

![](https://i.imgur.com/cF6Euyf.png)

## References

- [Rayon: data parallelism in Rust](https://smallcultfollowing.com/babysteps/blog/2015/12/18/rayon-data-parallelism-in-rust/)
- <https://www.youtube.com/watch?v=gof_OEv71Aw>
- <https://github.com/rayon-rs/rayon>


[`rayon`]: https://github.com/rayon-rs/rayon
[`join`]: https://docs.rs/rayon/*/rayon/fn.join.html
[`scope`]: https://docs.rs/rayon/*/rayon/fn.scope.html
