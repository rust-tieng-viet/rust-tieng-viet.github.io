# [`Option`](https://doc.rust-lang.org/std/option/)

Nhiều ngôn ngữ sử dụng kiểu dữ liệu `null` hoặc `nil` hoặc `undefined` 
để đại diện cho các giá trị rỗng hoặc không tồn tại, và sử dụng `Exception` 
để xử lý lỗi. Rust bỏ qua hai khái niệm này, để tránh gặp phải các lỗi phổ biến 
như **null pointer exceptions,** hay **lộ thông tin nhạy cảm thông qua exceptions,** ... 
Thay vào đó, Rust giới thiệu hai generic enums [`Option`](https://doc.rust-lang.org/std/option/) 
và [`Result`](https://doc.rust-lang.org/std/result/enum.Result.html) để giải quyết các vấn đề trên.

---

Trong hầu hết các ngôn ngữ họ C (C, C#, Java, ...), để xác định một cái gì đó failed 
hay không tìm được giá trị thỏa mãn, chúng ta thường trả về một giá trị *"đặc biệt"* nào đó.
Ví dụ `indexOf()` của Javascript scan một phần tử trong mảng, 
trả về vị trí của phần tử đó trong mảng. Và trả về `-1` nếu không tìm thấy. 

Dẫn đến, ta sẽ thường thấy một số đoạn code như sau đây:

```typescript
// Typescript

let sentence = "The fox jumps over the dog";
let index = sentence.indexOf("fox");

if (index > -1) {
  let result = sentence.substr(index);
  console.log(result);
}
```

Như bạn thấy `-1` là một trường hợp đặc biệt cần xử lý. 
Có khi nào bạn đã từng mắc lỗi ngớ ngẫn vì tưởng giá trị đặc biệt đó là `0` chưa?

```typescript
// Typescript

if (index > 0) {
  // 3000 days of debugging
}
```

`""` hay `null` hay `None` cũng là một trong những trường hợp đặc biệt đó. 
Bạn đã từng nghe đến ****[Null References: The Billion Dollar Mistake](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/)****?

Lý do cơ bản là không có gì chắc chắn và có thể ngăn bạn lại việc ... **quên** 
xử lý mọi trường hợp giá trị đặc biệt, hoặc do chương trình trả về các giá trị đặc biệt không như mong đợi.
Có nghĩa là ta có thể *vô tình* làm crash chương trình với một lỗi nhỏ ở bất kỳ đâu, ở bất kỳ thời điểm nào.

Rust làm điều này tốt hơn, chỉ với `Option`. 

Một giá trị optional có thể mang một giá trị nào đó **Some(something)** hoặc không mang giá trị nào cả (**None**).

```rust
// An output can have either Some value or no value/ None.
enum Option<T> { // T is a generic and it can contain any type of value.
  Some(T),
  None,
}
```

Theo thiết kế, mặc định bạn sẽ không bao giờ lấy được giá trị bạn cần nếu không xử lý 
các trường hợp có thể xảy ra với `Option`, là `None` chẳng hạn. 
Điều này được bắt buộc bởi compiler lúc compile code, 
có nghĩa là nếu bạn quên check, code sẽ không bao giờ được compile.

```rust
let sentence = "The fox jumps over the dog";
let index = sentence.find("fox");

if let Some(fox) = index {
  let words_after_fox = &sentence[fox..];
  println!("{}", words_after_fox);
}
```

## **Cách sử dụng Option**

[`Option`](https://doc.rust-lang.org/std/option/) là standard library, do đã được 
[preludes](https://learning-rust.github.io/docs/d7.std_primitives_and_preludes.html#Preludes) 
nên chúng ta không cần khai báo trước khi sử dụng. Ngoài enum 
[`Option`](https://doc.rust-lang.org/std/option/enum.Option.html) thì các variant của nó cũng đã được preludes 
sẵn như [Some](https://doc.rust-lang.org/std/option/enum.Option.html#variant.Some) 
và [None](https://doc.rust-lang.org/std/option/enum.Option.html#variant.None).

Ví dụ, ta có một function tính giá trị chia hai số, 
đôi khi sẽ không tìm ra được kết quả, ta sử dụng Some như sau:

{{#playground ./option-example.rs}}

Ta thường sử dụng `match` để bắt giá trị trả về (`Some` hoặc `None`). 

Bạn sẽ bắt gặp rất nhiều method khác nhau để xử lý giá trị của `Option`

[`Option`](https://doc.rust-lang.org/std/option/) method overview: [https://doc.rust-lang.org/std/option/#method-overview](https://doc.rust-lang.org/std/option/#method-overview)

{{#include ./unwrap.md}}

{{#include ./expect.md}}

### `.unwrap_or()`

Trả về giá trị nằm trong `Some`, nếu không trả về giá trị nằm trong `or`

```rust
assert_eq!(Some("car").unwrap_or("bike"), "car");
```

{{#include ./unwrap_or_default.md}}

### `.ok_or()`

Convert `Option<T>` sang [`Result<T, E>`](https://doc.rust-lang.org/std/result/enum.Result.html), 
mapping [`Some(v)`](https://doc.rust-lang.org/std/option/enum.Option.html#variant.Some) 
thành [`Ok(v)`](https://doc.rust-lang.org/std/result/enum.Result.html#variant.Ok) 
và [`None`](https://doc.rust-lang.org/std/option/enum.Option.html#variant.None) 
sang [`Err(err)`](https://doc.rust-lang.org/std/result/enum.Result.html#variant.Err).

```rust
let x = Some("foo");
assert_eq!(x.ok_or(0), Ok("foo"));
```

### `match`

Chúng ta có thể sử dụng pattern matching để code dễ đọc hơn

```rust
fn get_name(who: Option<String>) -> String {
  match who {
    Some(name) => format!("Hello {}", name),
    None       => "Who are you?".to_string(), 
  }
}

get_name(Some("duyet"));
```

{{#include ./if_let_some.md}}
