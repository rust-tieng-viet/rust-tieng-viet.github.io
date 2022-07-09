# Supertraits

Rust không có khái niệm "kế thừa" như trong OOP. 
Nhưng bạn có thể định nghĩa một trait là một tập hợp của các trait khác.

```rust
trait Person {
  fn name(&self) -> String;
}

// Person là một supertrait của Student.
// Implement Student yêu cầu bạn phải cũng phải impl Person.
trait Student: Person {
    fn university(&self) -> String;
}

trait Programmer {
    fn fav_language(&self) -> String;
}

// CompSciStudent (computer science student) là một subtrait 
// của cả Programmer và Student. 
//
// Implement CompSciStudent yêu cầu bạn phải impl tất cả supertraits.
trait CompSciStudent: Programmer + Student {
    fn git_username(&self) -> String;
}

fn comp_sci_student_greeting(student: &dyn CompSciStudent) -> String {
    format!(
        "My name is {} and I attend {}. My favorite language is {}. My Git username is {}",
        student.name(),
        student.university(),
        student.fav_language(),
        student.git_username()
    )
}

```
