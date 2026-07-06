# 📋 GitHub Issue & Content Audit Summary

This document summaries the issues, improvements, and new content sections identified during the audit of the **Rust Tiếng Việt** book. It outlines the plan to address them in a series of structured changes (commits/PRs).

---

## 🔍 Identified Issues & Areas for Improvement

### 1. 🔗 Broken Internal Links (Critical)
* **Location**: `src/advanced/async/README.md`
* **Issue**: The "Xem thêm" section contains links to files (`async-fn.md`, `futures.md`, `tokio.md`, `error-handling.md`, `concurrency.md`, `performance.md`) that do not exist in the repository, causing `mdbook-linkcheck` to fail.
* **Proposed Fix**: Redirect these links to the official high-quality external resources (like Tokio Tutorial, Rust Async Book) or restructure them to point to specific sections within the existing guide.

### 2. 🧪 mdBook Test Compilation Failures (High)
* **Location**: Multiple pages (e.g., `basic/trait/trait-inheritance.md`, `basic/trait/fromstr.md`, `basic/generics/functions.md`)
* **Issue**: Several code blocks are partial snippets or pseudocode. Running `mdbook test` treats them as standalone Rust files, resulting in compilation failures.
* **Proposed Fix**: Mark incomplete snippets with `rust,ignore` or `rust,no_run` to prevent them from failing tests while remaining editable/visible. For complete examples, fix the missing types or imports.

### 3. 📊 Missing Key Data Engineering Core Components (Medium)
* **Location**: `src/data-engineering/`
* **Issue**: The current data engineering section mentions **DataFusion** and **Delta Lake** but does not provide a dedicated guide or practical implementation code. Polars is documented, but Apache DataFusion (the premier Rust SQL engine) and Delta Lake (lakehouse integration) deserve their own chapters.
* **Proposed Fix**: Create a new chapter `src/data-engineering/datafusion.md` focusing on DataFusion (query execution, SQL engine) and delta-lake integration, written in the "bilingual/English-Vietnamese x-ray" style.

### 4. 🤖 Outdated AI / LLM Agent Ecosystem (Medium)
* **Location**: `src/llm/`
* **Issue**: The AI/LLM section mentions Rig and Candle, but misses two major developments in 2025/2026:
  1. **Model Context Protocol (MCP)**: The new standard for connecting AI agents to data sources and tools.
  2. **genai**: A popular, lightweight, multi-provider LLM library by Jeremy Chone.
  3. **Advanced AI Agent Engineering**: A structured framework for building production agents (Routers, Orchestrator-Workers, Evaluator-Optimizer).
* **Proposed Fix**: Add a new page `src/llm/mcp-genai.md` explaining Model Context Protocol and GenAI. Update `src/llm/ai-agents-workflows.md` to include advanced agentic patterns (Router, Orchestrator, Evaluator-Optimizer).

---

## 🗺️ Implementation & PR Plan

We will create a structured set of changes targeting each issue:

| Phase | Target Areas | Action | Files Affected |
|---|---|---|---|
| **Phase 1** | Link Checks & CI Quality | Fix broken links and annotate incomplete tests | `src/advanced/async/README.md`, `src/basic/trait/trait-inheritance.md`, etc. |
| **Phase 2** | Data Engineering | Add comprehensive Apache DataFusion & Delta Lake guides | `src/data-engineering/datafusion.md`, `src/SUMMARY.md` |
| **Phase 3** | AI Agent Engineering | Add Model Context Protocol (MCP), genai library, and advanced agentic patterns | `src/llm/mcp-genai.md`, `src/llm/ai-agents-workflows.md`, `src/SUMMARY.md` |

---

*Note: All content will be written in the bilingual "x-ray" style: Vietnamese explanations with standard English technical terms (e.g. concurrency, zero-cost abstraction, schema, pipeline).*
