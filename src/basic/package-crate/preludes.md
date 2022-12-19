# [Preludes](https://doc.rust-lang.org/std/prelude/)

[Preludes](https://doc.rust-lang.org/std/prelude/) là những thứ được định nghĩa trong [`std`],
và được import sẵn, vì chúng thường sẽ phải được dùng trong mọi chương trình Rust.
Bạn có thể sử dụng mà không cần phải import, ví dụ như: [`Option`], 
[`Result`], [`Ok`], [`Err`], ...

Mặc dù [`std`] của Rust có rất nhiều module và tính năng, nhưng không phải mọi thứ đều được preludes.

Đây là danh sách những thứ được preludes: <https://doc.rust-lang.org/std/prelude/#prelude-contents>

---

* <code>[std::marker]::{[Copy], [Send], [Sized], [Sync], [Unpin]}</code>,
  marker traits that indicate fundamental properties of types.
* <code>[std::ops]::{[Drop], [Fn], [FnMut], [FnOnce]}</code>, various
  operations for both destructors and overloading `()`.
* <code>[std::mem]::[drop][mem::drop]</code>, a convenience function for explicitly
  dropping a value.
* <code>[std::boxed]::[Box]</code>, a way to allocate values on the heap.
* <code>[std::borrow]::[ToOwned]</code>, the conversion trait that defines
  [`to_owned`], the generic method for creating an owned type from a
  borrowed type.
* <code>[std::clone]::[Clone]</code>, the ubiquitous trait that defines
  [`clone`][Clone::clone], the method for producing a copy of a value.
* <code>[std::cmp]::{[PartialEq], [PartialOrd], [Eq], [Ord]}</code>, the
  comparison traits, which implement the comparison operators and are often
  seen in trait bounds.
* <code>[std::convert]::{[AsRef], [AsMut], [Into], [From]}</code>, generic
  conversions, used by savvy API authors to create overloaded methods.
* <code>[std::default]::[Default]</code>, types that have default values.
* <code>[std::iter]::{[Iterator], [Extend], [IntoIterator], [DoubleEndedIterator], [ExactSizeIterator]}</code>,
  iterators of various
  kinds.
* <code>[std::option]::[Option]::{[self][Option], [Some], [None]}</code>, a
  type which expresses the presence or absence of a value. This type is so
  commonly used, its variants are also exported.
* <code>[std::result]::[Result]::{[self][Result], [Ok], [Err]}</code>, a type
  for functions that may succeed or fail. Like [`Option`], its variants are
  exported as well.
* <code>[std::string]::{[String], [ToString]}</code>, heap-allocated strings.
* <code>[std::vec]::[Vec]</code>, a growable, heap-allocated vector.

The prelude used in Rust 2021, [`std::prelude::rust_2021`], includes all of the above,
and in addition re-exports:

* <code>[std::convert]::{[TryFrom], [TryInto]}</code>,
* <code>[std::iter]::[FromIterator]</code>.

[`std`]: https://doc.rust-lang.org/std/index.html
[`Option`](https://doc.rust-lang.org/std/option/enum.Option.html)
[`Result`](https://doc.rust-lang.org/std/result/enum.Result.html)
[`Ok`](https://doc.rust-lang.org/std/result/enum.Result.html#variant.Ok)
[`Err`](https://doc.rust-lang.org/std/result/enum.Result.html#variant.Err)
[`mem::drop`]: https://doc.rust-lang.org/std/mem/fn.drop.html
[`std::borrow`]: https://doc.rust-lang.org/std/borrow
[`std::boxed`]: https://doc.rust-lang.org/std/boxed
[`std::clone`]: https://doc.rust-lang.org/std/clone
[`std::cmp`]: https://doc.rust-lang.org/std/cmp
[`std::convert`]: https://doc.rust-lang.org/std/convert
[`std::default`]: https://doc.rust-lang.org/std/default
[`std::iter`]: https://doc.rust-lang.org/std/iter
[`std::marker`]: https://doc.rust-lang.org/std/marker
[`std::mem`]: https://doc.rust-lang.org/std/mem
[`std::ops`]: https://doc.rust-lang.org/std/ops
[`std::option`]: https://doc.rust-lang.org/std/option
[`std::result`]: https://doc.rust-lang.org/std/result
[`std::slice`]: https://doc.rust-lang.org/std/slice
[`std::string`]: https://doc.rust-lang.org/std/string
[`std::vec`]: https://doc.rust-lang.org/std/vec
[`TryFrom`]: https://doc.rust-lang.org/std/convert/trait.TryFrom.html
[`TryInto`]: https://doc.rust-lang.org/std/convert/trait.TryInto.html
[`FromIterator`]: https://doc.rust-lang.org/std/iter/trait.FromIterator.html
