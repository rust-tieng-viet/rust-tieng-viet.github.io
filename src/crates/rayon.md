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


## References

- [Rayon: data parallelism in Rust](https://smallcultfollowing.com/babysteps/blog/2015/12/18/rayon-data-parallelism-in-rust/)
- <https://www.youtube.com/watch?v=gof_OEv71Aw>
- <https://github.com/rayon-rs/rayon>


[`rayon`]: https://github.com/rayon-rs/rayon
[`join`]: https://docs.rs/rayon/*/rayon/fn.join.html
[`scope`]: https://docs.rs/rayon/*/rayon/fn.scope.html
