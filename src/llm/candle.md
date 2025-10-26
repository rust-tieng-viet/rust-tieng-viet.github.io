# Candle - Minimalist ML Framework

[Candle](https://github.com/huggingface/candle) là một minimalist machine learning framework cho Rust được phát triển bởi Hugging Face. Candle được thiết kế để đơn giản, nhanh, và dễ sử dụng cho cả CPU và GPU inference.

## Đặc điểm chính

### 1. Minimal và Performant

Candle focus vào simplicity và performance:

- **Lightweight**: Không có heavy dependencies
- **Fast**: Tối ưu cho cả CPU và GPU
- **Simple API**: Dễ học và sử dụng
- **No Python required**: Pure Rust implementation

### 2. Hardware Support

Candle hỗ trợ nhiều backends:

- **CPU**: Optimized CPU operations
- **CUDA**: NVIDIA GPU support
- **Metal**: Apple Silicon (M1/M2/M3) support
- **WebGPU**: Browser-based inference

### 3. Model Support

Hỗ trợ các popular model architectures:

- **Transformers**: BERT, GPT, T5, etc.
- **Vision**: ResNet, ViT, CLIP
- **Audio**: Whisper (speech-to-text)
- **Multimodal**: CLIP, BLIP
- **LLMs**: Llama, Mistral, Phi

## Installation

Thêm vào `Cargo.toml`:

```toml
[dependencies]
candle-core = "0.4.0"
candle-nn = "0.4.0"
candle-transformers = "0.4.0"

# Optional: CUDA support
candle-cuda = "0.4.0"

# Optional: Metal support (Apple Silicon)
candle-metal = "0.4.0"
```

## Basic Usage

### 1. Tensor Operations

```rust
use candle_core::{Device, Tensor};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Tạo tensor trên CPU
    let device = Device::Cpu;

    let a = Tensor::new(&[1f32, 2., 3., 4.], &device)?;
    let b = Tensor::new(&[5f32, 6., 7., 8.], &device)?;

    // Phép tính
    let sum = (&a + &b)?;
    let product = (&a * &b)?;

    println!("Sum: {:?}", sum.to_vec1::<f32>()?);
    println!("Product: {:?}", product.to_vec1::<f32>()?);

    Ok(())
}
```

### 2. Matrix Operations

```rust
use candle_core::{Device, Tensor};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let device = Device::Cpu;

    // Tạo matrices
    let a = Tensor::new(
        &[[1f32, 2.], [3., 4.]],
        &device
    )?;

    let b = Tensor::new(
        &[[5f32, 6.], [7., 8.]],
        &device
    )?;

    // Matrix multiplication
    let result = a.matmul(&b)?;

    println!("Result: {:?}", result.to_vec2::<f32>()?);

    Ok(())
}
```

## Running LLMs with Candle

### 1. Llama Model Inference

```rust
use candle_core::{Device, Tensor};
use candle_transformers::models::llama::{Llama, Config};
use candle_nn::VarBuilder;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load model
    let device = Device::cuda_if_available(0)?;

    let config = Config::config_7b_v2();
    let vb = VarBuilder::from_pth("model.safetensors", &device)?;
    let mut model = Llama::load(vb, &config)?;

    // Tokenize input
    let prompt = "The Rust programming language is";
    let tokens = tokenize(prompt)?;

    // Generate
    let mut output_tokens = tokens.clone();
    for _ in 0..50 {  // Generate 50 tokens
        let logits = model.forward(&output_tokens)?;
        let next_token = sample(&logits)?;
        output_tokens.push(next_token);
    }

    // Decode
    let generated_text = detokenize(&output_tokens)?;
    println!("{}", generated_text);

    Ok(())
}
```

### 2. Whisper (Speech-to-Text)

```rust
use candle_core::Device;
use candle_transformers::models::whisper::{self, Config, Model};

fn transcribe_audio(audio_path: &str) -> Result<String, Box<dyn std::error::Error>> {
    let device = Device::cuda_if_available(0)?;

    // Load model
    let config = Config::tiny_en();
    let model = Model::load(&config, &device)?;

    // Load and preprocess audio
    let audio = load_audio(audio_path)?;
    let mel = audio_to_mel(&audio)?;

    // Transcribe
    let tokens = model.decode(&mel)?;
    let text = tokens_to_text(&tokens)?;

    Ok(text)
}
```

### 3. BERT Embeddings

```rust
use candle_core::{Device, Tensor};
use candle_transformers::models::bert::{BertModel, Config};

fn get_embeddings(text: &str) -> Result<Tensor, Box<dyn std::error::Error>> {
    let device = Device::Cpu;

    // Load BERT model
    let config = Config::default();
    let model = BertModel::load(&config, &device)?;

    // Tokenize
    let tokens = tokenize(text)?;
    let token_ids = Tensor::new(tokens.as_slice(), &device)?;

    // Get embeddings
    let embeddings = model.forward(&token_ids)?;

    Ok(embeddings)
}
```

## Advanced Usage

### 1. GPU Acceleration

```rust
use candle_core::{Device, Tensor};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Sử dụng CUDA nếu có
    let device = Device::cuda_if_available(0)?;

    // Hoặc explicitly chọn device
    let device = if cfg!(feature = "cuda") {
        Device::new_cuda(0)?
    } else if cfg!(feature = "metal") {
        Device::new_metal(0)?
    } else {
        Device::Cpu
    };

    let tensor = Tensor::randn(0f32, 1f32, (1000, 1000), &device)?;

    println!("Running on: {:?}", device);

    Ok(())
}
```

### 2. Custom Models

```rust
use candle_core::{Device, Tensor, Module};
use candle_nn::{Linear, VarBuilder, ops};

struct SimpleNN {
    fc1: Linear,
    fc2: Linear,
}

impl SimpleNN {
    fn new(vb: VarBuilder) -> Result<Self, Box<dyn std::error::Error>> {
        let fc1 = candle_nn::linear(784, 128, vb.pp("fc1"))?;
        let fc2 = candle_nn::linear(128, 10, vb.pp("fc2"))?;

        Ok(Self { fc1, fc2 })
    }

    fn forward(&self, x: &Tensor) -> Result<Tensor, Box<dyn std::error::Error>> {
        let x = self.fc1.forward(x)?;
        let x = x.relu()?;
        let x = self.fc2.forward(&x)?;
        Ok(x)
    }
}
```

### 3. Quantization

Candle hỗ trợ quantization để giảm model size và tăng tốc inference:

```rust
use candle_core::{Device, Tensor};
use candle_transformers::quantized_llama::ModelWeights;

fn load_quantized_model() -> Result<(), Box<dyn std::error::Error>> {
    let device = Device::Cpu;

    // Load quantized model (4-bit, 8-bit)
    let model = ModelWeights::from_gguf(
        "llama-2-7b-Q4_K_M.gguf",
        &device
    )?;

    // Model size nhỏ hơn rất nhiều
    // 7B model: ~14GB -> ~4GB với Q4 quantization

    Ok(())
}
```

## Use Cases

### 1. Local LLM Inference

```rust
use candle_transformers::models::quantized_llama::ModelWeights;

fn chat_with_local_llm(prompt: &str) -> Result<String, Box<dyn std::error::Error>> {
    let device = Device::Cpu;

    // Load quantized Llama
    let mut model = ModelWeights::from_gguf(
        "llama-2-7b-chat.Q4_K_M.gguf",
        &device
    )?;

    // Generate response
    let response = model.generate(prompt, 512)?;

    Ok(response)
}
```

### 2. Image Classification

```rust
use candle_transformers::models::resnet;

fn classify_image(image_path: &str) -> Result<String, Box<dyn std::error::Error>> {
    let device = Device::Cpu;

    // Load ResNet
    let model = resnet::resnet50(&device)?;

    // Load and preprocess image
    let image = load_image(image_path)?;
    let tensor = preprocess_image(&image)?;

    // Classify
    let logits = model.forward(&tensor)?;
    let class = argmax(&logits)?;

    Ok(imagenet_classes()[class].to_string())
}
```

### 3. Text Embeddings for RAG

```rust
use candle_transformers::models::bert;

fn generate_embeddings(texts: Vec<&str>) -> Result<Vec<Vec<f32>>, Box<dyn std::error::Error>> {
    let device = Device::Cpu;
    let model = bert::BertModel::load_default(&device)?;

    let mut embeddings = Vec::new();

    for text in texts {
        let tokens = tokenize(text)?;
        let embedding = model.encode(&tokens)?;
        embeddings.push(embedding.to_vec1()?);
    }

    Ok(embeddings)
}
```

## Performance Comparison

| Backend | Llama 7B Inference | Speedup |
|---------|-------------------|---------|
| CPU (Intel i9) | ~2.5 tokens/s | 1x |
| CUDA (RTX 4090) | ~45 tokens/s | 18x |
| Metal (M2 Max) | ~25 tokens/s | 10x |

*Quantized models (Q4): ~2-3x faster with similar quality*

## Ưu điểm

✅ **Pure Rust**: Không cần Python runtime
✅ **Fast**: Optimized cho performance
✅ **Minimal**: Ít dependencies, dễ build
✅ **Cross-platform**: CPU, CUDA, Metal, WebGPU
✅ **Model Support**: Nhiều popular architectures
✅ **Quantization**: Giảm memory usage

## Nhược điểm

⚠️ **Younger Ecosystem**: Ít mature hơn PyTorch/TensorFlow
⚠️ **Fewer Models**: Không nhiều pre-trained models như Python
⚠️ **Training**: Chủ yếu focus vào inference

## Khi nào nên dùng Candle?

**Nên dùng Candle khi:**
- Muốn run models locally không cần Python
- Cần fast inference với low latency
- Deploy trên edge devices
- Xây dựng production services trong Rust
- Muốn single binary deployment

**Có thể dùng Python frameworks khi:**
- Training models (PyTorch, TensorFlow tốt hơn)
- Cần extensive model zoo
- Team đã thành thạo Python ML stack

## Resources

- **GitHub**: [https://github.com/huggingface/candle](https://github.com/huggingface/candle)
- **Examples**: [Candle Examples](https://github.com/huggingface/candle/tree/main/candle-examples)
- **Documentation**: [docs.rs/candle-core](https://docs.rs/candle-core)

## Kết luận

Candle là một excellent choice để run ML models, đặc biệt là LLMs, trong Rust. Với pure Rust implementation, cross-platform support, và focus vào performance, Candle giúp bạn xây dựng fast và reliable ML inference systems mà không cần Python dependency.
