# Struct

Struct được sử dụng trong Rust rất nhiều, hầu như là mọi lúc. Với struct ta có thể định nghĩa một kiểu dữ liệu riêng.

Tên của struct thường là `UpperCamelCase`. Nếu bạn định nghĩa tên struct là lowercase, compiler sẽ nhắc nhở ngay.

```bash
warning: type `duyet_struct` should have an upper camel case name
 --> src/main.rs:1:8
  |
1 | struct duyet_struct;
  |        ^^^^^^^^^^^^ help: convert the identifier to upper camel case: `DuyetStruct`
  |
  = note: `#[warn(non_camel_case_types)]` on by default
```

Có 3 loại struct:

# Unit struct

Unit struct là một struct mà không có gì cả:

```rust,editable
struct FileDirectory;
fn main() {}
```

# Tuple struct

Tuple struct hay còn gọi là Unnamed struct. Bạn chỉ cần định nghĩa kiểu dữ liệu, không cần định tên field name.

```rust,editable
struct Colour(u8, u8, u8);

fn main() {
  let my_colour = Colour(50, 0, 50); // Make a colour out of RGB (red, green, blue)

  println!("The first part of the colour is: {}", my_colour.0);
  println!("The second part of the colour is: {}", my_colour.1);
}

// The first part of the colour is: 50
// The second part of the colour is: 0
```

# Named struct

Phổ biến nhất, bạn sẽ phải định nghĩa field name trong block `{}` 

```rust,editable
struct Colour(u8, u8, u8); // Declare the same Colour tuple struct

struct SizeAndColour {
  size: u32,
  colour: Colour, // And we put it in our new named struct
		  // The last comma is optional, but recommended
}

fn main() {
  let colour = Colour(50, 0, 50);

  let size_and_colour = SizeAndColour {
    size: 150,
    colour: colour
  };
}
```

`colour: colour` có thể được viết gọn lại thành:

```rust,editable
let size_and_colour = SizeAndColour {
  size: 150,
  colour
};
```

Xem về [Trait](./trait/README.md)

