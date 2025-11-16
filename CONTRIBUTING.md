# Hướng dẫn Đóng góp (Contributing Guidelines)

Cảm ơn bạn đã quan tâm đến việc đóng góp cho **Rust Tiếng Việt**! 🦀

Dự án này là một tài liệu học Rust mã nguồn mở, được xây dựng bởi cộng đồng và dành cho cộng đồng. Mọi đóng góp đều được trân trọng và đánh giá cao!

## Mục lục

- [Code of Conduct](#code-of-conduct)
- [Tôi có thể đóng góp như thế nào?](#tôi-có-thể-đóng-góp-như-thế-nào)
- [Quy trình Pull Request](#quy-trình-pull-request)
- [Hướng dẫn viết nội dung](#hướng-dẫn-viết-nội-dung)
- [Tiêu chuẩn Code](#tiêu-chuẩn-code)
- [Cấu trúc Dự án](#cấu-trúc-dự-án)
- [Development Setup](#development-setup)
- [Reporting Bugs](#reporting-bugs)
- [Liên hệ](#liên-hệ)

## Code of Conduct

Dự án này tuân thủ [Code of Conduct](CODE_OF_CONDUCT.md). Khi tham gia, bạn cũng được kỳ vọng tuân thủ các quy tắc này. Vui lòng báo cáo hành vi không phù hợp qua GitHub Issues.

## Tôi có thể đóng góp như thế nào?

### 🐛 Báo cáo lỗi (Bug Reports)

Nếu bạn tìm thấy lỗi (typo, link hỏng, code example sai, v.v.):

1. Kiểm tra [Issues](https://github.com/rust-tieng-viet/rust-tieng-viet.github.io/issues) xem lỗi đã được báo cáo chưa
2. Nếu chưa, tạo issue mới với template "Báo cáo lỗi"
3. Mô tả chi tiết: trang nào, lỗi gì, screenshot nếu có

### ✨ Đề xuất tính năng mới (Feature Requests)

Bạn muốn thêm nội dung mới hoặc cải thiện tính năng:

1. Tạo issue mới với template "Đề xuất nội dung"
2. Giải thích rõ ràng nội dung/tính năng bạn muốn thêm
3. Nếu có thể, đề xuất cách implement hoặc outline nội dung

### 📝 Đóng góp nội dung (Content Contributions)

Loại nội dung được hoan nghênh:

- **Sửa lỗi chính tả, ngữ pháp**: Rất cần thiết!
- **Thêm ví dụ code**: Minh họa khái niệm
- **Viết chương mới**: Chủ đề chưa được cover
- **Cải thiện giải thích**: Làm nội dung dễ hiểu hơn
- **Thêm diagram/hình ảnh**: Visualization giúp học tốt hơn
- **Dịch thuật ngữ**: Đề xuất thuật ngữ tiếng Việt chuẩn xác

### 🎨 Cải thiện Design/UX

- Responsive design
- Accessibility improvements
- Performance optimization
- Theme/styling enhancements

### 🔧 Cải thiện Infrastructure

- CI/CD improvements
- Build scripts
- Testing framework
- Documentation tools

## Quy trình Pull Request

### 1. Fork và Clone

```bash
# Fork repo trên GitHub, sau đó clone về máy
git clone https://github.com/YOUR_USERNAME/rust-tieng-viet.github.io.git
cd rust-tieng-viet.github.io
```

### 2. Tạo Branch

```bash
# Tạo branch mới từ main
git checkout -b feature/ten-tinh-nang-cua-ban

# Hoặc cho bugfix
git checkout -b fix/mo-ta-loi-can-sua
```

**Đặt tên branch:**
- `feature/` - Tính năng mới hoặc nội dung mới
- `fix/` - Sửa lỗi
- `docs/` - Cập nhật documentation
- `style/` - Styling/design changes
- `refactor/` - Code refactoring
- `test/` - Thêm tests

### 3. Development Setup

```bash
# Cài đặt mdBook và dependencies
./dev.sh

# Hoặc thủ công
cargo install mdbook mdbook-linkcheck
mdbook serve --open --port 3000
```

Truy cập http://localhost:3000 để xem thay đổi real-time.

### 4. Thực hiện thay đổi

#### Thêm nội dung mới

1. Tạo file `.md` trong thư mục phù hợp (vd: `src/basic/`)
2. Thêm entry vào `src/SUMMARY.md`
3. Viết nội dung theo [Hướng dẫn viết nội dung](#hướng-dẫn-viết-nội-dung)

#### Sửa nội dung hiện có

1. Tìm file trong `src/`
2. Chỉnh sửa nội dung
3. Kiểm tra formatting và links

### 5. Test Locally

```bash
# Build và kiểm tra
mdbook build

# Test code examples
mdbook test

# Check links
mdbook-linkcheck
```

### 6. Commit Changes

```bash
# Stage changes
git add .

# Commit với message rõ ràng
git commit -m "feat: thêm section về async/await cơ bản"
```

**Commit message format** (theo [Conventional Commits](https://www.conventionalcommits.org/)):

```
<type>(<scope>): <subject>

<body>
```

**Types:**
- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Documentation
- `style`: Formatting, styling
- `refactor`: Code refactoring
- `test`: Thêm tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(basic): thêm chương về Lifetime
fix(trait): sửa typo trong ví dụ Display trait
docs(README): cập nhật hướng dẫn cài đặt
style(css): cải thiện responsive cho mobile
```

### 7. Push và Tạo PR

```bash
# Push branch lên GitHub
git push origin feature/ten-tinh-nang-cua-ban
```

Sau đó tạo Pull Request trên GitHub với:

**PR Title:** Tóm tắt ngắn gọn thay đổi
```
feat(advanced): Add comprehensive async/await guide
```

**PR Description:** Mô tả chi tiết
```markdown
## Thay đổi

- Thêm chương mới về async/await fundamentals
- Bao gồm 5 ví dụ code thực tế
- Thêm diagram về async runtime

## Checklist

- [x] Code examples compile và chạy được
- [x] Đã test locally với `mdbook serve`
- [x] Links không bị broken
- [x] Tuân thủ style guide
- [x] Đã cập nhật SUMMARY.md

## Screenshots (nếu có thay đổi UI)

[Đính kèm screenshot]
```

### 8. Code Review

- Maintainer sẽ review PR của bạn
- Có thể có yêu cầu thay đổi (requested changes)
- Thực hiện thay đổi theo feedback
- Push updates lên cùng branch (tự động cập nhật PR)

### 9. Merge

- Sau khi được approve, maintainer sẽ merge PR
- Thay đổi sẽ tự động deploy lên https://rust-tieng-viet.github.io

## Hướng dẫn Viết Nội dung

### Ngôn ngữ và Phong cách

#### ✅ Nên làm:

- **Tiếng Việt đơn giản, dễ hiểu**: Tránh ngôn ngữ quá học thuật
- **Giải thích thuật ngữ**: Lần đầu sử dụng thuật ngữ, giải thích nghĩa
- **Ví dụ thực tế**: Code examples phải chạy được, có comment tiếng Việt
- **Tương tác**: Sử dụng "chúng ta", "bạn" thay vì "người đọc"
- **Nhất quán**: Dùng cùng thuật ngữ cho cùng khái niệm

```markdown
✅ Tốt:
Ownership (quyền sở hữu) là một trong những tính năng đặc biệt của Rust.

✅ Tốt:
Hãy cùng xem ví dụ sau:

✅ Tốt:
```rust
// Tạo một vector chứa số nguyên
let numbers = vec![1, 2, 3];
\```
```

#### ❌ Không nên:

```markdown
❌ Tránh:
Ownership mechanism được implement thông qua borrow checker.

❌ Tránh:
Người đọc cần hiểu...

❌ Tránh:
```rust
let x = vec![1, 2, 3]; // code không có comment
\```
```

### Cấu trúc Nội dung

#### Template cho Chapter mới:

```markdown
# Tên Chapter

[Giới thiệu ngắn gọn về chủ đề - 2-3 câu]

## Tại sao cần biết?

[Giải thích tại sao chủ đề này quan trọng]

## Khái niệm cơ bản

[Giải thích các khái niệm từ cơ bản nhất]

## Ví dụ

[Code example đơn giản]

```rust,editable
fn main() {
    // Comment tiếng Việt giải thích
    println!("Hello");
}
\```

[Giải thích code example]

## Ví dụ nâng cao

[Code example phức tạp hơn]

## Lưu ý

[Những điểm cần chú ý, best practices]

## Tham khảo

- [Official Rust Doc](link)
- [Related chapter](internal-link)
```

### Code Examples

#### Yêu cầu:

1. **Phải compile được** - Chạy `mdbook test` để verify
2. **Comment bằng tiếng Việt** - Giải thích từng bước quan trọng
3. **Realistic** - Ví dụ thực tế, không quá đơn giản hoặc phức tạp
4. **Progressive** - Từ đơn giản đến phức tạp
5. **Editable** - Sử dụng `\`\`\`rust,editable` cho playground

#### Template Code Example:

```rust,editable
// Mô tả ví dụ này làm gì

fn main() {
    // Bước 1: Khởi tạo dữ liệu
    let data = vec![1, 2, 3, 4, 5];

    // Bước 2: Xử lý dữ liệu
    let result: Vec<i32> = data
        .iter()                    // Tạo iterator
        .map(|x| x * 2)           // Nhân đôi mỗi số
        .filter(|x| x > &5)       // Lọc số lớn hơn 5
        .collect();               // Thu thập kết quả

    // Bước 3: In kết quả
    println!("Kết quả: {:?}", result);
}
```

### Markdown Formatting

```markdown
# Heading 1 (Tiêu đề Chapter)
## Heading 2 (Section chính)
### Heading 3 (Subsection)

**Bold text** - Nhấn mạnh thuật ngữ quan trọng
*Italic text* - Nhấn mạnh nhẹ
`inline code` - Tên biến, function, type

> Blockquote cho lưu ý quan trọng

- Bullet list
  - Nested item

1. Numbered list
2. Item 2

[Link text](URL hoặc internal-link.md)

![Alt text cho ảnh](./image.png)
```

### Thuật ngữ Rust - Vietnamese

| English | Tiếng Việt | Ghi chú |
|---------|-----------|---------|
| Ownership | Quyền sở hữu | |
| Borrowing | Vay mượn | |
| Lifetime | Thời gian sống | |
| Trait | Trait (giữ nguyên) | Hoặc "đặc điểm" |
| Enum | Enum (giữ nguyên) | |
| Struct | Struct (giữ nguyên) | |
| Pattern matching | Khớp mẫu | |
| Closure | Closure (giữ nguyên) | |
| Iterator | Iterator | Hoặc "bộ lặp" |
| Compile | Biên dịch | |
| Runtime | Thời gian chạy | |

**Quy tắc:**
- Lần đầu: `Ownership (quyền sở hữu)`
- Lần sau: Có thể dùng tiếng Việt hoặc giữ nguyên, nhưng **nhất quán**

## Tiêu chuẩn Code

### Rust Code

```rust
// ✅ Tốt: Format với rustfmt
fn calculate_sum(numbers: &[i32]) -> i32 {
    numbers.iter().sum()
}

// ❌ Tránh: Không format
fn calculate_sum(numbers:&[i32])->i32{numbers.iter().sum()}
```

**Checklist:**
- [ ] Chạy được (`mdbook test`)
- [ ] Format với `rustfmt`
- [ ] Lint với `clippy` (no warnings)
- [ ] Comment tiếng Việt đầy đủ
- [ ] Realistic và có ý nghĩa

### Markdown

- [ ] Links không broken
- [ ] Images có alt text
- [ ] Code blocks có language tag
- [ ] Headings đúng hierarchy (h1 > h2 > h3)
- [ ] Không có trailing whitespace

### Accessibility

- [ ] Images có alt text mô tả
- [ ] Links có text rõ ràng (không dùng "click here")
- [ ] Headings structure hợp lý
- [ ] Code có sufficient contrast

## Cấu trúc Dự án

```
rust-tieng-viet.github.io/
├── src/                    # Nội dung markdown
│   ├── SUMMARY.md         # Table of Contents
│   ├── README.md          # Trang chủ
│   ├── basic/             # Nội dung cơ bản
│   ├── advanced/          # Nội dung nâng cao
│   ├── crates/            # Crate documentation
│   ├── design-pattern/    # Design patterns
│   ├── llm/               # AI/LLM content
│   └── idioms/            # Rust idioms
├── theme/                  # Custom theme
│   ├── head.hbs           # HTML head (SEO, analytics)
│   ├── custom.css         # Custom styles
│   └── custom.js          # Custom JS
├── book.toml              # mdBook config
├── CONTRIBUTING.md        # File này
├── CODE_OF_CONDUCT.md     # Code of conduct
├── README.md              # Project README
└── dev.sh                 # Development script
```

## Development Setup

### Prerequisites

- Rust và Cargo (latest stable)
- Git
- Text editor (VS Code, Vim, etc.)

### Installation

```bash
# Clone repository
git clone https://github.com/rust-tieng-viet/rust-tieng-viet.github.io.git
cd rust-tieng-viet.github.io

# Install mdBook
cargo install mdbook mdbook-linkcheck

# Hoặc dùng script tự động
./dev.sh
```

### Local Development

```bash
# Serve với auto-reload
mdbook serve --open --port 3000

# Build static files
mdbook build

# Test code examples
mdbook test

# Check links
mdbook-linkcheck
```

### File Watcher

mdBook có built-in file watcher. Khi bạn save file, browser tự động reload.

## Reporting Bugs

### Security Issues

**QUAN TRỌNG**: Nếu tìm thấy lỗ hổng bảo mật, **KHÔNG** tạo public issue.

Liên hệ trực tiếp qua:
- Email maintainer qua GitHub profile
- Hoặc tạo private security advisory

### Regular Bugs

Tạo issue với thông tin:

**Template:**

```markdown
## Mô tả lỗi

[Mô tả rõ ràng và ngắn gọn về lỗi]

## Các bước tái hiện

1. Truy cập trang '...'
2. Click vào '....'
3. Scroll xuống '....'
4. Thấy lỗi

## Kết quả mong đợi

[Mô tả bạn expect điều gì xảy ra]

## Kết quả thực tế

[Mô tả điều gì đã xảy ra]

## Screenshots

[Nếu có, đính kèm screenshot]

## Môi trường

- Browser: [vd: Chrome 120]
- OS: [vd: Windows 11]
- Device: [vd: Desktop, Mobile]

## Thông tin thêm

[Context khác nếu cần]
```

## Styleguide

### Git Commit Messages

- Dùng present tense ("Add feature" chứ không phải "Added feature")
- Dùng imperative mood ("Move cursor to..." chứ không phải "Moves cursor to...")
- Giới hạn dòng đầu ≤ 72 ký tự
- Reference issues và PRs khi có liên quan

### Vietnamese Writing Style

- Sử dụng dấu câu đúng
- Khoảng trắng sau dấu câu
- Viết hoa đầu câu
- Nhất quán trong việc dùng thuật ngữ

## Liên hệ

- **GitHub Issues**: [rust-tieng-viet/rust-tieng-viet.github.io/issues](https://github.com/rust-tieng-viet/rust-tieng-viet.github.io/issues)
- **GitHub Discussions**: [rust-tieng-viet/rust-tieng-viet.github.io/discussions](https://github.com/rust-tieng-viet/rust-tieng-viet.github.io/discussions)
- **Maintainer**: [@duyetdev](https://github.com/duyetdev)

---

## Cảm ơn! 🙏

Mọi đóng góp, dù lớn hay nhỏ, đều giúp Rust Tiếng Việt trở nên tốt hơn cho cộng đồng.

Happy coding! 🦀
