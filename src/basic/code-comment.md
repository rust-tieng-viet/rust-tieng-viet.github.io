# `/// code comment` sao cho đúng

Comment sao cho đúng để đồng đội bớt chửi.

```rust,editable
// hello, world
```

## Regular comments 

Trong Rust comment bắt đầu bằng 2 slashes `//` được gọi là *Regular comments*,
chú thích cho một đoạn code hoặc biểu thức theo sau nó.
Compiler sẽ không quan tâm đến các Regular comments này.  

```rust,editable
fn main() {
  // I’m feeling lucky today
  let lucky_number = 7;
}
```

Nếu comment có nhiều hơn một dòng,
hãy ngắt nó thành nhiều dòng -.-

```rust,editable
// So we’re doing something complicated here, long enough that we need
// multiple lines of comments to do it! Whew! Hopefully, this comment will
// explain what’s going on.
```

Comment cũng có thể được đặt cuối dòng code, nếu nó ngắn gọn và đơn giản:

```rust,editable
fn main() {
  let lucky_number = 7; // I’m feeling lucky today
}
```

## Doc comments

Doc comments sẽ được Compiler parse thành [HTML documentation](https://doc.rust-lang.org/rust-by-example/meta/doc.html)
khi render document bằng [cargo doc](./cargo-doc.md).

```rust,editable
/// Generate library docs for the following item.
//! Generate library docs for the enclosing item.
```

Doc comments sẽ cực kỳ hữu ích cho project lớn và cần một hệ thống document chính xác và up to date.

`//!` sẽ generate doc cho crate/mod trong file hiện tại.

```rust,editable
#![crate_name = "doc"]

/// A human being is represented here
pub struct Person {
    /// A person must have a name, no matter how much Juliet may hate it
    name: String,
}

impl Person {
    /// Returns a person with the name given them
    ///
    /// # Arguments
    ///
    /// * `name` - A string slice that holds the name of the person
    ///
    /// # Examples
    ///
    /// ```
    /// // You can have rust code between fences inside the comments
    /// // If you pass --test to `rustdoc`, it will even test it for you!
    /// use doc::Person;
    /// let person = Person::new("name");
    /// ```
    pub fn new(name: &str) -> Person {
        Person {
            name: name.to_string(),
        }
    }

    /// Gives a friendly hello!
    ///
    /// Says "Hello, [name]" to the `Person` it is called on.
    pub fn hello(& self) {
        println!("Hello, {}!", self.name);
    }
}

fn main() {
    let john = Person::new("John");

    john.hello();
}
```

Chúng ta có thể thậm chí comment lại example code hoặc cách sử dụng một function nào đó,
code này cũng sẽ được compile và test, đảm bảo được code và doc luôn luôn chính xác với nhau, một giải pháp khá thông minh.


```rust,editable
/// Adds one to the number given.
///
/// # Examples
///
/// ```
/// let arg = 5;
/// let answer = my_crate::add_one(arg);
///
/// assert_eq!(6, answer);
/// ```
pub fn add_one(x: i32) -> i32 {
    x + 1
}
```
