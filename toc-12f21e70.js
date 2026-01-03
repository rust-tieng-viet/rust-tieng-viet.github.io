// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="index.html"><strong aria-hidden="true">1.</strong> Introduction</a></span></li><li class="chapter-item expanded "><li class="spacer"></li></li><li class="chapter-item expanded "><li class="part-title">Bắt đầu</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="getting-started/installation.html"><strong aria-hidden="true">2.</strong> Cài đặt Rust</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="getting-started/rust-playground.html"><strong aria-hidden="true">3.</strong> Rust Playground</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="getting-started/first-project.html"><strong aria-hidden="true">4.</strong> Project đầu tiên</a></span></li><li class="chapter-item expanded "><li class="part-title">Cơ bản</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/variables/index.html"><strong aria-hidden="true">5.</strong> Variables</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/variables/mut.html"><strong aria-hidden="true">5.1.</strong> mut</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/variables/uninitialized.html"><strong aria-hidden="true">5.2.</strong> uninitialized variable</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/closure.html"><strong aria-hidden="true">6.</strong> Closure</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/cargo/index.html"><strong aria-hidden="true">7.</strong> Cargo</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/package-crate/index.html"><strong aria-hidden="true">8.</strong> Packages và Crates</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/package-crate/package-layout.html"><strong aria-hidden="true">8.1.</strong> Package layout</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/package-crate/crate.html"><strong aria-hidden="true">8.2.</strong> Crate</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/package-crate/use-crate/index.html"><strong aria-hidden="true">8.3.</strong> use crate</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/package-crate/use-crate/self-super.html"><strong aria-hidden="true">8.3.1.</strong> use self, use super</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/package-crate/use-crate/pub-use.html"><strong aria-hidden="true">8.3.2.</strong> pub use</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/package-crate/preludes.html"><strong aria-hidden="true">8.4.</strong> Preludes</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/ownership.html"><strong aria-hidden="true">9.</strong> Ownership</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/struct.html"><strong aria-hidden="true">10.</strong> Struct</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/index.html"><strong aria-hidden="true">11.</strong> Trait</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/define-a-trait.html"><strong aria-hidden="true">11.1.</strong> Khai báo Trait</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/impl-trait.html"><strong aria-hidden="true">11.2.</strong> Implement Trait cho một Type</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/default-impls.html"><strong aria-hidden="true">11.3.</strong> Default Implementations</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/trait-as-params.html"><strong aria-hidden="true">11.4.</strong> Traits as Parameters</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/trait-bound.html"><strong aria-hidden="true">11.5.</strong> Trait Bound</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/multiple-trait-bound.html"><strong aria-hidden="true">11.6.</strong> Multiple Trait Bound</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/where-clauses.html"><strong aria-hidden="true">11.7.</strong> where Clauses</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/return-impl-trait.html"><strong aria-hidden="true">11.8.</strong> Returning Types that Implement Traits</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/conditionally-impl.html"><strong aria-hidden="true">11.9.</strong> Using Trait Bounds to Conditionally Implement Methods</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/blanked-impl.html"><strong aria-hidden="true">11.10.</strong> Blanket implementations</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/trait-inheritance.html"><strong aria-hidden="true">11.11.</strong> Trait Inheritance</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/supertraits.html"><strong aria-hidden="true">11.12.</strong> Supertraits</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/auto-trait.html"><strong aria-hidden="true">11.13.</strong> Auto Trait</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/copy-clone.html"><strong aria-hidden="true">11.14.</strong> Copy, Clone</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/string-str.html"><strong aria-hidden="true">11.15.</strong> String và &amp;str</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/fromstr.html"><strong aria-hidden="true">11.16.</strong> FromStr</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/trait/display.html"><strong aria-hidden="true">11.17.</strong> Display</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/enum/index.html"><strong aria-hidden="true">12.</strong> Enum</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/enum/match.html"><strong aria-hidden="true">12.1.</strong> match Enum</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/enum/use-variants.html"><strong aria-hidden="true">12.2.</strong> Mang Variants ra ngoài scope của Enum</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/enum/impl.html"><strong aria-hidden="true">12.3.</strong> impl Enum</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/enum/option/index.html"><strong aria-hidden="true">12.4.</strong> Option&lt;T&gt;</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/enum/option/unwrap.html"><strong aria-hidden="true">12.4.1.</strong> unwrap()</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/enum/option/expect.html"><strong aria-hidden="true">12.4.2.</strong> expect()</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/enum/option/unwrap_or_default.html"><strong aria-hidden="true">12.4.3.</strong> unwrap_or_default()</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/enum/option/if_let_some.html"><strong aria-hidden="true">12.4.4.</strong> if let Some(x) = x</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/enum/result/index.html"><strong aria-hidden="true">12.5.</strong> Result&lt;T, E&gt;</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/enum/result/result-to-option.html"><strong aria-hidden="true">12.5.1.</strong> Result -&gt; Option</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/enum/result/question-mark.html"><strong aria-hidden="true">12.5.2.</strong> Toán tử ?</a></span></li></ol></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/generics/index.html"><strong aria-hidden="true">13.</strong> Generics</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/generics/functions.html"><strong aria-hidden="true">13.1.</strong> Generic Functions</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/generics/struct.html"><strong aria-hidden="true">13.2.</strong> Generic Struct</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/generics/enum.html"><strong aria-hidden="true">13.3.</strong> Generic Enum</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/generics/impl.html"><strong aria-hidden="true">13.4.</strong> Generic Implementation</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/generics/trait.html"><strong aria-hidden="true">13.5.</strong> Generic Trait</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/generics/bounds.html"><strong aria-hidden="true">13.6.</strong> Bounds</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/generics/where.html"><strong aria-hidden="true">13.7.</strong> where</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/vec/INDEX.html"><strong aria-hidden="true">14.</strong> Vec</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/vec/iter.html"><strong aria-hidden="true">14.1.</strong> Iter</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/vec/enum-vec.html"><strong aria-hidden="true">14.2.</strong> Sử dụng Enum để chứa nhiều loại dữ liệu</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/code-comment/index.html"><strong aria-hidden="true">15.</strong> Code comment</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/code-comment/regular-comment.html"><strong aria-hidden="true">15.1.</strong> Regular comments</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/code-comment/doc-comment.html"><strong aria-hidden="true">15.2.</strong> Doc comments</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/turbofish.html"><strong aria-hidden="true">16.</strong> Turbofish ::&lt;&gt;</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/macro/index.html"><strong aria-hidden="true">17.</strong> macros!</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/macro/macros-vs-functions.html"><strong aria-hidden="true">17.1.</strong> Khác nhau giữa Macros và Functions</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/macro/standard-macros.html"><strong aria-hidden="true">17.2.</strong> Standard Macros</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/macro/println.html"><strong aria-hidden="true">17.3.</strong> println!</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/macro/format.html"><strong aria-hidden="true">17.4.</strong> format!</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/macro/todo.html"><strong aria-hidden="true">17.5.</strong> todo!</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/macro/macro_rules.html"><strong aria-hidden="true">17.6.</strong> macro_rules!</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/match/index.html"><strong aria-hidden="true">18.</strong> match</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/match/literals.html"><strong aria-hidden="true">18.1.</strong> Matching giá trị</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/match/named-vars.html"><strong aria-hidden="true">18.2.</strong> Matching Named Variables</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/match/multiple.html"><strong aria-hidden="true">18.3.</strong> Matching Multiple</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/attr.html"><strong aria-hidden="true">19.</strong> #[attributes]</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/error-handling/index.html"><strong aria-hidden="true">20.</strong> Xử lý lỗi</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/error-handling/panic.html"><strong aria-hidden="true">20.1.</strong> panic</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/error-handling/option.html"><strong aria-hidden="true">20.2.</strong> Option</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/error-handling/result.html"><strong aria-hidden="true">20.3.</strong> Result</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/error-handling/result-map.html"><strong aria-hidden="true">20.3.1.</strong> Result map</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/error-handling/result-alias.html"><strong aria-hidden="true">20.3.2.</strong> Result alias</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/error-handling/boxing-error.html"><strong aria-hidden="true">20.4.</strong> Boxing error</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/error-handling/custom-error.html"><strong aria-hidden="true">20.5.</strong> Custom error</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/testing/index.html"><strong aria-hidden="true">21.</strong> Viết Tests</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/testing/test-organization.html"><strong aria-hidden="true">21.1.</strong> Tổ chức Tests</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/testing/unit-tests.html"><strong aria-hidden="true">21.1.1.</strong> Unit Tests</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/testing/integration-tests.html"><strong aria-hidden="true">21.1.2.</strong> Integration Tests</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/testing/doc-tests.html"><strong aria-hidden="true">21.1.3.</strong> Doc Tests</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/testing/env-conflict.html"><strong aria-hidden="true">21.2.</strong> Xung đột biến môi trường</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/rustdoc/index.html"><strong aria-hidden="true">22.</strong> Viết Docs</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="basic/rustdoc/doc-README.html"><strong aria-hidden="true">22.1.</strong> Sử dụng README.md làm crate document</a></span></li></ol><li class="chapter-item expanded "><li class="part-title">Nâng cao</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="advanced/smart-pointer/index.html"><strong aria-hidden="true">23.</strong> Smart Pointers</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="advanced/smart-pointer/box.html"><strong aria-hidden="true">23.1.</strong> Box&lt;T&gt;</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="advanced/smart-pointer/rc.html"><strong aria-hidden="true">23.2.</strong> Rc&lt;T&gt;, Reference Counted</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="advanced/smart-pointer/cow.html"><strong aria-hidden="true">23.3.</strong> Cow</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="advanced/smart-pointer/ref.html"><strong aria-hidden="true">23.4.</strong> Ref</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="advanced/smart-pointer/refmut.html"><strong aria-hidden="true">23.5.</strong> RefMut</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="advanced/saturating.html"><strong aria-hidden="true">24.</strong> Saturating&lt;T&gt;</a></span></li><li class="chapter-item expanded "><li class="spacer"></li></li><li class="chapter-item expanded "><li class="part-title">Tối ưu Hiệu suất</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="performance/index.html"><strong aria-hidden="true">25.</strong> Tối ưu Hiệu suất (Performance)</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="performance/benchmarking.html"><strong aria-hidden="true">25.1.</strong> Đo lường Hiệu suất (Benchmarking)</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="performance/build-configuration.html"><strong aria-hidden="true">25.2.</strong> Cấu hình Build để Tối ưu</a></span></li></ol><li class="chapter-item expanded "><li class="spacer"></li></li><li class="chapter-item expanded "><li class="part-title">Design patterns</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="design-pattern/behavioural/index.html"><strong aria-hidden="true">26.</strong> Behavioural Patterns</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="design-pattern/behavioural/strategy.html"><strong aria-hidden="true">26.1.</strong> Strategy Pattern</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="design-pattern/behavioural/command.html"><strong aria-hidden="true">26.2.</strong> Command Pattern</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="design-pattern/creational/index.html"><strong aria-hidden="true">27.</strong> Creational Patterns</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="design-pattern/creational/builder.html"><strong aria-hidden="true">27.1.</strong> Builder Pattern</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="design-pattern/structural/index.html"><strong aria-hidden="true">28.</strong> Structural Patterns</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="design-pattern/structural/small-rates.html"><strong aria-hidden="true">28.1.</strong> Prefer Small Crates</a></span></li></ol><li class="chapter-item expanded "><li class="spacer"></li></li><li class="chapter-item expanded "><li class="part-title">Crates hay dùng</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/regex.html"><strong aria-hidden="true">29.</strong> regex</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/chrono.html"><strong aria-hidden="true">30.</strong> chrono</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/async_trait.html"><strong aria-hidden="true">31.</strong> async_trait</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/lazy_static.html"><strong aria-hidden="true">32.</strong> lazy_static</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/serde.html"><strong aria-hidden="true">33.</strong> serde</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/serde/serde_json.html"><strong aria-hidden="true">33.1.</strong> serde_json</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/serde/serde_toml.html"><strong aria-hidden="true">33.2.</strong> serde_toml</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/serde/serde_csv.html"><strong aria-hidden="true">33.3.</strong> serde_csv</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/serde/serde_yaml.html"><strong aria-hidden="true">33.4.</strong> serde_yaml</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/tokio.html"><strong aria-hidden="true">34.</strong> tokio</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/actix-web.html"><strong aria-hidden="true">35.</strong> actix-web</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/anyhow.html"><strong aria-hidden="true">36.</strong> anyhow</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/clap.html"><strong aria-hidden="true">37.</strong> clap</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/log/index.html"><strong aria-hidden="true">38.</strong> log</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/log/env_logger.html"><strong aria-hidden="true">38.1.</strong> env_logger</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/config.html"><strong aria-hidden="true">39.</strong> config</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/indoc.html"><strong aria-hidden="true">40.</strong> indoc</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/rayon.html"><strong aria-hidden="true">41.</strong> rayon</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="crates/polars.html"><strong aria-hidden="true">42.</strong> polars</a></span></li><li class="chapter-item expanded "><li class="spacer"></li></li><li class="chapter-item expanded "><li class="part-title">Data Engineering</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="data-engineering/data-processing.html"><strong aria-hidden="true">43.</strong> Xử lý và phân tích dữ liệu</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="data-engineering/first-data-pipeline.html"><strong aria-hidden="true">44.</strong> High-performance data pipeline</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="data-engineering/data-driven.html"><strong aria-hidden="true">45.</strong> Building scalable data-driven applications using Rust</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="data-engineering/rust-as-alternative-python.html"><strong aria-hidden="true">46.</strong> Rust as an alternative to Python for data engineering tasks</a></span></li><li class="chapter-item expanded "><li class="spacer"></li></li><li class="chapter-item expanded "><li class="part-title">AI và Large Language Models (LLM)</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="llm/index.html"><strong aria-hidden="true">47.</strong> Rust và LLM Overview</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="llm/rig.html"><strong aria-hidden="true">48.</strong> Rig - LLM Application Framework</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="llm/llm-crate.html"><strong aria-hidden="true">49.</strong> llm - Unified LLM Interface</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="llm/candle.html"><strong aria-hidden="true">50.</strong> Candle - Minimalist ML Framework</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="llm/ai-agents-workflows.html"><strong aria-hidden="true">51.</strong> Building AI Agents và Workflows</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="llm/recent-updates-2025.html"><strong aria-hidden="true">52.</strong> Recent Updates 2025</a></span></li><li class="chapter-item expanded "><li class="spacer"></li></li><li class="chapter-item expanded "><li class="part-title">Rust Idioms</li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/functional-programming.html"><strong aria-hidden="true">53.</strong> Functional programming</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/borrowed-types.html"><strong aria-hidden="true">54.</strong> Use borrowed types for arguments</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/format.html"><strong aria-hidden="true">55.</strong> Concatenating strings with format!</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/constructor.html"><strong aria-hidden="true">56.</strong> Constructor</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/default-trait.html"><strong aria-hidden="true">56.1.</strong> The Default Trait</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/finalisation-destructors.html"><strong aria-hidden="true">57.</strong> Finalisation in destructors</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/temporary-mutability.html"><strong aria-hidden="true">58.</strong> Temporary mutability</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/aim-for-immutability.html"><strong aria-hidden="true">59.</strong> Aim For Immutability in Rust</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/mem-replace.html"><strong aria-hidden="true">60.</strong> mem::replace and mem::take</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/privacy-for-extensibility.html"><strong aria-hidden="true">61.</strong> Privacy for extensibility</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/option-iter.html"><strong aria-hidden="true">62.</strong> Iterating over Option</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/pass-variables-to-closure.html"><strong aria-hidden="true">63.</strong> Pass variables to closure</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/let-else.html"><strong aria-hidden="true">64.</strong> let-else pattern</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/newtype.html"><strong aria-hidden="true">65.</strong> Newtype Pattern</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/raii-guards.html"><strong aria-hidden="true">66.</strong> RAII Guards</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/zero-cost-abstractions.html"><strong aria-hidden="true">67.</strong> Zero-Cost Abstractions</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/typestate.html"><strong aria-hidden="true">68.</strong> Typestate Pattern</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="idioms/error-handling-patterns.html"><strong aria-hidden="true">69.</strong> Error Handling Patterns</a></span></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split('#')[0].split('?')[0];
        if (current_page.endsWith('/')) {
            current_page += 'index.html';
        }
        const links = Array.prototype.slice.call(this.querySelectorAll('a'));
        const l = links.length;
        for (let i = 0; i < l; ++i) {
            const link = links[i];
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The 'index' page is supposed to alias the first chapter in the book.
            if (link.href === current_page
                || i === 0
                && path_to_root === ''
                && current_page.endsWith('/index.html')) {
                link.classList.add('active');
                let parent = link.parentElement;
                while (parent) {
                    if (parent.tagName === 'LI' && parent.classList.contains('chapter-item')) {
                        parent.classList.add('expanded');
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                const clientRect = e.target.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                sessionStorage.setItem('sidebar-scroll-offset', clientRect.top - sidebarRect.top);
            }
        }, { passive: true });
        const sidebarScrollOffset = sessionStorage.getItem('sidebar-scroll-offset');
        sessionStorage.removeItem('sidebar-scroll-offset');
        if (sidebarScrollOffset !== null) {
            // preserve sidebar scroll position when navigating via links within sidebar
            const activeSection = this.querySelector('.active');
            if (activeSection) {
                const clientRect = activeSection.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                const currentOffset = clientRect.top - sidebarRect.top;
                this.scrollTop += currentOffset - parseFloat(sidebarScrollOffset);
            }
        } else {
            // scroll sidebar to current active section when navigating via
            // 'next/previous chapter' buttons
            const activeSection = document.querySelector('#mdbook-sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        const sidebarAnchorToggles = document.querySelectorAll('.chapter-fold-toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(el => {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define('mdbook-sidebar-scrollbox', MDBookSidebarScrollbox);


// ---------------------------------------------------------------------------
// Support for dynamically adding headers to the sidebar.

(function() {
    // This is used to detect which direction the page has scrolled since the
    // last scroll event.
    let lastKnownScrollPosition = 0;
    // This is the threshold in px from the top of the screen where it will
    // consider a header the "current" header when scrolling down.
    const defaultDownThreshold = 150;
    // Same as defaultDownThreshold, except when scrolling up.
    const defaultUpThreshold = 300;
    // The threshold is a virtual horizontal line on the screen where it
    // considers the "current" header to be above the line. The threshold is
    // modified dynamically to handle headers that are near the bottom of the
    // screen, and to slightly offset the behavior when scrolling up vs down.
    let threshold = defaultDownThreshold;
    // This is used to disable updates while scrolling. This is needed when
    // clicking the header in the sidebar, which triggers a scroll event. It
    // is somewhat finicky to detect when the scroll has finished, so this
    // uses a relatively dumb system of disabling scroll updates for a short
    // time after the click.
    let disableScroll = false;
    // Array of header elements on the page.
    let headers;
    // Array of li elements that are initially collapsed headers in the sidebar.
    // I'm not sure why eslint seems to have a false positive here.
    // eslint-disable-next-line prefer-const
    let headerToggles = [];
    // This is a debugging tool for the threshold which you can enable in the console.
    let thresholdDebug = false;

    // Updates the threshold based on the scroll position.
    function updateThreshold() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // The number of pixels below the viewport, at most documentHeight.
        // This is used to push the threshold down to the bottom of the page
        // as the user scrolls towards the bottom.
        const pixelsBelow = Math.max(0, documentHeight - (scrollTop + windowHeight));
        // The number of pixels above the viewport, at least defaultDownThreshold.
        // Similar to pixelsBelow, this is used to push the threshold back towards
        // the top when reaching the top of the page.
        const pixelsAbove = Math.max(0, defaultDownThreshold - scrollTop);
        // How much the threshold should be offset once it gets close to the
        // bottom of the page.
        const bottomAdd = Math.max(0, windowHeight - pixelsBelow - defaultDownThreshold);
        let adjustedBottomAdd = bottomAdd;

        // Adjusts bottomAdd for a small document. The calculation above
        // assumes the document is at least twice the windowheight in size. If
        // it is less than that, then bottomAdd needs to be shrunk
        // proportional to the difference in size.
        if (documentHeight < windowHeight * 2) {
            const maxPixelsBelow = documentHeight - windowHeight;
            const t = 1 - pixelsBelow / Math.max(1, maxPixelsBelow);
            const clamp = Math.max(0, Math.min(1, t));
            adjustedBottomAdd *= clamp;
        }

        let scrollingDown = true;
        if (scrollTop < lastKnownScrollPosition) {
            scrollingDown = false;
        }

        if (scrollingDown) {
            // When scrolling down, move the threshold up towards the default
            // downwards threshold position. If near the bottom of the page,
            // adjustedBottomAdd will offset the threshold towards the bottom
            // of the page.
            const amountScrolledDown = scrollTop - lastKnownScrollPosition;
            const adjustedDefault = defaultDownThreshold + adjustedBottomAdd;
            threshold = Math.max(adjustedDefault, threshold - amountScrolledDown);
        } else {
            // When scrolling up, move the threshold down towards the default
            // upwards threshold position. If near the bottom of the page,
            // quickly transition the threshold back up where it normally
            // belongs.
            const amountScrolledUp = lastKnownScrollPosition - scrollTop;
            const adjustedDefault = defaultUpThreshold - pixelsAbove
                + Math.max(0, adjustedBottomAdd - defaultDownThreshold);
            threshold = Math.min(adjustedDefault, threshold + amountScrolledUp);
        }

        if (documentHeight <= windowHeight) {
            threshold = 0;
        }

        if (thresholdDebug) {
            const id = 'mdbook-threshold-debug-data';
            let data = document.getElementById(id);
            if (data === null) {
                data = document.createElement('div');
                data.id = id;
                data.style.cssText = `
                    position: fixed;
                    top: 50px;
                    right: 10px;
                    background-color: 0xeeeeee;
                    z-index: 9999;
                    pointer-events: none;
                `;
                document.body.appendChild(data);
            }
            data.innerHTML = `
                <table>
                  <tr><td>documentHeight</td><td>${documentHeight.toFixed(1)}</td></tr>
                  <tr><td>windowHeight</td><td>${windowHeight.toFixed(1)}</td></tr>
                  <tr><td>scrollTop</td><td>${scrollTop.toFixed(1)}</td></tr>
                  <tr><td>pixelsAbove</td><td>${pixelsAbove.toFixed(1)}</td></tr>
                  <tr><td>pixelsBelow</td><td>${pixelsBelow.toFixed(1)}</td></tr>
                  <tr><td>bottomAdd</td><td>${bottomAdd.toFixed(1)}</td></tr>
                  <tr><td>adjustedBottomAdd</td><td>${adjustedBottomAdd.toFixed(1)}</td></tr>
                  <tr><td>scrollingDown</td><td>${scrollingDown}</td></tr>
                  <tr><td>threshold</td><td>${threshold.toFixed(1)}</td></tr>
                </table>
            `;
            drawDebugLine();
        }

        lastKnownScrollPosition = scrollTop;
    }

    function drawDebugLine() {
        if (!document.body) {
            return;
        }
        const id = 'mdbook-threshold-debug-line';
        const existingLine = document.getElementById(id);
        if (existingLine) {
            existingLine.remove();
        }
        const line = document.createElement('div');
        line.id = id;
        line.style.cssText = `
            position: fixed;
            top: ${threshold}px;
            left: 0;
            width: 100vw;
            height: 2px;
            background-color: red;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(line);
    }

    function mdbookEnableThresholdDebug() {
        thresholdDebug = true;
        updateThreshold();
        drawDebugLine();
    }

    window.mdbookEnableThresholdDebug = mdbookEnableThresholdDebug;

    // Updates which headers in the sidebar should be expanded. If the current
    // header is inside a collapsed group, then it, and all its parents should
    // be expanded.
    function updateHeaderExpanded(currentA) {
        // Add expanded to all header-item li ancestors.
        let current = currentA.parentElement;
        while (current) {
            if (current.tagName === 'LI' && current.classList.contains('header-item')) {
                current.classList.add('expanded');
            }
            current = current.parentElement;
        }
    }

    // Updates which header is marked as the "current" header in the sidebar.
    // This is done with a virtual Y threshold, where headers at or below
    // that line will be considered the current one.
    function updateCurrentHeader() {
        if (!headers || !headers.length) {
            return;
        }

        // Reset the classes, which will be rebuilt below.
        const els = document.getElementsByClassName('current-header');
        for (const el of els) {
            el.classList.remove('current-header');
        }
        for (const toggle of headerToggles) {
            toggle.classList.remove('expanded');
        }

        // Find the last header that is above the threshold.
        let lastHeader = null;
        for (const header of headers) {
            const rect = header.getBoundingClientRect();
            if (rect.top <= threshold) {
                lastHeader = header;
            } else {
                break;
            }
        }
        if (lastHeader === null) {
            lastHeader = headers[0];
            const rect = lastHeader.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top >= windowHeight) {
                return;
            }
        }

        // Get the anchor in the summary.
        const href = '#' + lastHeader.id;
        const a = [...document.querySelectorAll('.header-in-summary')]
            .find(element => element.getAttribute('href') === href);
        if (!a) {
            return;
        }

        a.classList.add('current-header');

        updateHeaderExpanded(a);
    }

    // Updates which header is "current" based on the threshold line.
    function reloadCurrentHeader() {
        if (disableScroll) {
            return;
        }
        updateThreshold();
        updateCurrentHeader();
    }


    // When clicking on a header in the sidebar, this adjusts the threshold so
    // that it is located next to the header. This is so that header becomes
    // "current".
    function headerThresholdClick(event) {
        // See disableScroll description why this is done.
        disableScroll = true;
        setTimeout(() => {
            disableScroll = false;
        }, 100);
        // requestAnimationFrame is used to delay the update of the "current"
        // header until after the scroll is done, and the header is in the new
        // position.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Closest is needed because if it has child elements like <code>.
                const a = event.target.closest('a');
                const href = a.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    threshold = targetElement.getBoundingClientRect().bottom;
                    updateCurrentHeader();
                }
            });
        });
    }

    // Takes the nodes from the given head and copies them over to the
    // destination, along with some filtering.
    function filterHeader(source, dest) {
        const clone = source.cloneNode(true);
        clone.querySelectorAll('mark').forEach(mark => {
            mark.replaceWith(...mark.childNodes);
        });
        dest.append(...clone.childNodes);
    }

    // Scans page for headers and adds them to the sidebar.
    document.addEventListener('DOMContentLoaded', function() {
        const activeSection = document.querySelector('#mdbook-sidebar .active');
        if (activeSection === null) {
            return;
        }

        const main = document.getElementsByTagName('main')[0];
        headers = Array.from(main.querySelectorAll('h2, h3, h4, h5, h6'))
            .filter(h => h.id !== '' && h.children.length && h.children[0].tagName === 'A');

        if (headers.length === 0) {
            return;
        }

        // Build a tree of headers in the sidebar.

        const stack = [];

        const firstLevel = parseInt(headers[0].tagName.charAt(1));
        for (let i = 1; i < firstLevel; i++) {
            const ol = document.createElement('ol');
            ol.classList.add('section');
            if (stack.length > 0) {
                stack[stack.length - 1].ol.appendChild(ol);
            }
            stack.push({level: i + 1, ol: ol});
        }

        // The level where it will start folding deeply nested headers.
        const foldLevel = 3;

        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const level = parseInt(header.tagName.charAt(1));

            const currentLevel = stack[stack.length - 1].level;
            if (level > currentLevel) {
                // Begin nesting to this level.
                for (let nextLevel = currentLevel + 1; nextLevel <= level; nextLevel++) {
                    const ol = document.createElement('ol');
                    ol.classList.add('section');
                    const last = stack[stack.length - 1];
                    const lastChild = last.ol.lastChild;
                    // Handle the case where jumping more than one nesting
                    // level, which doesn't have a list item to place this new
                    // list inside of.
                    if (lastChild) {
                        lastChild.appendChild(ol);
                    } else {
                        last.ol.appendChild(ol);
                    }
                    stack.push({level: nextLevel, ol: ol});
                }
            } else if (level < currentLevel) {
                while (stack.length > 1 && stack[stack.length - 1].level > level) {
                    stack.pop();
                }
            }

            const li = document.createElement('li');
            li.classList.add('header-item');
            li.classList.add('expanded');
            if (level < foldLevel) {
                li.classList.add('expanded');
            }
            const span = document.createElement('span');
            span.classList.add('chapter-link-wrapper');
            const a = document.createElement('a');
            span.appendChild(a);
            a.href = '#' + header.id;
            a.classList.add('header-in-summary');
            filterHeader(header.children[0], a);
            a.addEventListener('click', headerThresholdClick);
            const nextHeader = headers[i + 1];
            if (nextHeader !== undefined) {
                const nextLevel = parseInt(nextHeader.tagName.charAt(1));
                if (nextLevel > level && level >= foldLevel) {
                    const toggle = document.createElement('a');
                    toggle.classList.add('chapter-fold-toggle');
                    toggle.classList.add('header-toggle');
                    toggle.addEventListener('click', () => {
                        li.classList.toggle('expanded');
                    });
                    const toggleDiv = document.createElement('div');
                    toggleDiv.textContent = '❱';
                    toggle.appendChild(toggleDiv);
                    span.appendChild(toggle);
                    headerToggles.push(li);
                }
            }
            li.appendChild(span);

            const currentParent = stack[stack.length - 1];
            currentParent.ol.appendChild(li);
        }

        const onThisPage = document.createElement('div');
        onThisPage.classList.add('on-this-page');
        onThisPage.append(stack[0].ol);
        const activeItemSpan = activeSection.parentElement;
        activeItemSpan.after(onThisPage);
    });

    document.addEventListener('DOMContentLoaded', reloadCurrentHeader);
    document.addEventListener('scroll', reloadCurrentHeader, { passive: true });
})();

