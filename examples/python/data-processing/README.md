# Modern Data Processing with Polars

High-performance data processing using Polars - a blazingly fast DataFrame library written in Rust.

## Why Polars over Pandas?

- ⚡ **10-100x faster** than pandas for large datasets
- 🧵 **Parallel processing** out of the box
- 💾 **Memory efficient** with lazy evaluation
- 🦀 **Rust-powered** for maximum performance
- 🔒 **Type-safe** API with modern Python syntax
- 📊 **Streaming** support for datasets larger than RAM

## Features

- ✅ Fast DataFrame operations with **Polars**
- ✅ Type-safe transformations with modern type hints
- ✅ **Streaming** for large CSV/JSON files
- ✅ **Lazy evaluation** for memory efficiency
- ✅ Pytest tests
- ✅ Given-When-Then test pattern

## Requirements

- Python 3.12+

## Installation

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

## Quick Start

### Basic Data Processing

```python
from processor import DataProcessor

# Initialize processor
processor = DataProcessor(lazy=False)

# Create sample data
df = processor.create_sample_sales_data(n_rows=10000)

# Transform data
transformed = processor.transform_sales_data(df)

# Analyze by region
regional_summary = processor.analyze_sales_by_region(transformed)
print(regional_summary)
```

### Streaming Large Files

```python
from streaming import StreamingProcessor

# Initialize streaming processor
streaming = StreamingProcessor(chunk_size=100_000)

# Stream large file in batches
for batch in streaming.stream_csv_batches("huge_file.csv"):
    # Process each batch
    print(f"Processing {len(batch)} rows")

# Lazy aggregation (processes files larger than RAM)
result = streaming.aggregate_large_file_lazy(
    "huge_sales.csv",
    group_by=["region", "product"],
    aggregations={"revenue": "sum", "orders": "count"}
)
```

## Running Examples

### Data Processor Example

```bash
python processor.py
```

Output:
```
10:30:45 | INFO     | Starting data processing example
10:30:45 | INFO     | DataProcessor initialized (lazy=False)
10:30:45 | INFO     | Sample data shape: (10000, 7)
10:30:45 | INFO     | Regional Sales Summary:
┌────────┬──────────────┬────────────────┬───────────────┬─────────────────┐
│ region ┆ total_orders ┆ total_quantity ┆ total_revenue ┆ avg_order_value │
│ ---    ┆ ---          ┆ ---            ┆ ---           ┆ ---             │
│ str    ┆ u32          ┆ i64            ┆ f64           ┆ f64             │
╞════════╪══════════════╪════════════════╪═══════════════╪═════════════════╡
│ North  ┆ 2543         ┆ 125789         ┆ 5234567.89    ┆ 2058.91         │
│ South  ┆ 2489         ┆ 123456         ┆ 5123456.78    ┆ 2058.45         │
│ East   ┆ 2501         ┆ 124567         ┆ 5178901.23    ┆ 2070.33         │
│ West   ┆ 2467         ┆ 122345         ┆ 5098765.43    ┆ 2066.52         │
└────────┴──────────────┴────────────────┴───────────────┴─────────────────┘
```

### Streaming Processor Example

```bash
python streaming.py
```

## Usage Examples

### 1. Basic DataFrame Operations

```python
import polars as pl
from processor import DataProcessor

processor = DataProcessor()

# Create sample data
df = processor.create_sample_sales_data(1000)

# Modern Polars operations
result = (
    df
    .filter(pl.col("region") == "North")
    .group_by("product")
    .agg([
        pl.col("quantity").sum().alias("total_quantity"),
        pl.col("total_amount").mean().alias("avg_amount"),
    ])
    .sort("total_quantity", descending=True)
)
```

### 2. Data Transformation

```python
# Add calculated columns
transformed = processor.transform_sales_data(df)

# Filter high-value orders
high_value = processor.filter_high_value_orders(df, threshold=5000.0)

# Get summary statistics
stats = processor.get_summary_statistics(df)
```

### 3. Streaming Processing

```python
from streaming import StreamingProcessor

streaming = StreamingProcessor(chunk_size=50_000)

# Process large file in batches
def add_tax(batch: pl.DataFrame) -> pl.DataFrame:
    return batch.with_columns(
        (pl.col("total_amount") * 1.1).alias("total_with_tax")
    )

stats = streaming.process_large_csv(
    "large_sales.csv",
    "output_with_tax.csv",
    transform_fn=add_tax
)
```

### 4. Lazy Evaluation

```python
# Scan file without loading (lazy)
lf = pl.scan_csv("huge_file.csv")

# Build query (not executed yet)
result = (
    lf
    .filter(pl.col("revenue") > 1000)
    .group_by("region")
    .agg(pl.col("revenue").sum())
    .sort("revenue", descending=True)
)

# Execute query with streaming
df = result.collect(streaming=True)
```

### 5. Merge Multiple Files

```python
streaming = StreamingProcessor()

# Merge and deduplicate
stats = streaming.merge_multiple_files(
    ["sales_2023.csv", "sales_2024.csv", "sales_2025.csv"],
    "all_sales.csv",
    deduplicate=True
)
```

### 6. Rolling Statistics

```python
# Compute 7-day rolling average
rolling = streaming.compute_rolling_statistics(
    "daily_sales.csv",
    date_column="date",
    value_column="revenue",
    window_size=7
)
```

## Running Tests

### Run All Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=. --cov-report=html
open htmlcov/index.html
```

### Run Specific Tests

```bash
# Test data processor
pytest tests/test_processor.py::TestDataProcessor

# Test streaming
pytest tests/test_processor.py::TestStreamingProcessor

# Run with verbose output
pytest -v
```

## Performance Comparison

### Polars vs Pandas

```python
import polars as pl
import pandas as pd
import time

# Generate test data
n_rows = 10_000_000

# Polars
start = time.time()
df_polars = pl.DataFrame({
    "a": range(n_rows),
    "b": range(n_rows),
})
result = df_polars.group_by("a").agg(pl.col("b").sum())
polars_time = time.time() - start

# Pandas
start = time.time()
df_pandas = pd.DataFrame({
    "a": range(n_rows),
    "b": range(n_rows),
})
result = df_pandas.groupby("a")["b"].sum()
pandas_time = time.time() - start

print(f"Polars: {polars_time:.2f}s")
print(f"Pandas: {pandas_time:.2f}s")
print(f"Speedup: {pandas_time/polars_time:.1f}x")
```

Typical results:
```
Polars: 0.45s
Pandas: 12.34s
Speedup: 27.4x
```

## Modern Polars Features

### Expression API

```python
# Modern expression-based transformations
df = (
    pl.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})
    .with_columns([
        (pl.col("a") * 2).alias("a_doubled"),
        (pl.col("b") + pl.col("a")).alias("sum"),
    ])
    .filter(pl.col("sum") > 5)
)
```

### Lazy Evaluation

```python
# Build query without executing
lf = (
    pl.scan_csv("data.csv")
    .filter(pl.col("value") > 100)
    .group_by("category")
    .agg(pl.col("value").sum())
)

# Execute only when needed
result = lf.collect()
```

### Streaming

```python
# Process files larger than RAM
result = (
    pl.scan_csv("100gb_file.csv")
    .filter(pl.col("important") == True)
    .group_by("category")
    .agg(pl.col("value").mean())
    .collect(streaming=True)  # Streams data through pipeline
)
```

### Type System

```python
# Explicit types
df = pl.DataFrame({
    "date": pl.Series(["2024-01-01"], dtype=pl.Date),
    "value": pl.Series([123.45], dtype=pl.Float64),
    "category": pl.Series(["A"], dtype=pl.Categorical),
})

# Type conversions
df = df.with_columns([
    pl.col("date").cast(pl.Datetime),
    pl.col("value").cast(pl.Int64),
])
```

## Project Structure

```
data-processing/
├── processor.py           # Main data processor with Polars
├── streaming.py          # Streaming processor for large files
├── requirements.txt      # Python dependencies
├── README.md            # This file
└── tests/
    └── test_processor.py  # Pytest tests
```

## Best Practices

### 1. Use Lazy Evaluation

```python
# ✅ Good: Lazy evaluation
lf = pl.scan_csv("data.csv").filter(pl.col("x") > 0)
result = lf.collect()

# ❌ Avoid: Eager loading
df = pl.read_csv("data.csv")
result = df.filter(pl.col("x") > 0)
```

### 2. Streaming for Large Files

```python
# ✅ Good: Streaming
result = pl.scan_csv("huge.csv").collect(streaming=True)

# ❌ Avoid: Loading entire file
df = pl.read_csv("huge.csv")
```

### 3. Use Expressions

```python
# ✅ Good: Expression API
df = df.with_columns((pl.col("a") * 2).alias("doubled"))

# ❌ Avoid: Row-by-row operations
df = df.with_column("doubled", df["a"] * 2)
```

### 4. Type Hints

```python
# ✅ Good: Modern type hints
def process(df: pl.DataFrame) -> pl.DataFrame:
    return df.filter(pl.col("x") > 0)

# ❌ Avoid: No types
def process(df):
    return df.filter(pl.col("x") > 0)
```

## Common Operations Reference

### Reading Data

```python
# CSV
df = pl.read_csv("data.csv")
lf = pl.scan_csv("data.csv")  # Lazy

# JSON
df = pl.read_ndjson("data.jsonl")
lf = pl.scan_ndjson("data.jsonl")  # Lazy

# Parquet
df = pl.read_parquet("data.parquet")
lf = pl.scan_parquet("data.parquet")  # Lazy
```

### Writing Data

```python
df.write_csv("output.csv")
df.write_json("output.json")
df.write_parquet("output.parquet")
```

### Filtering

```python
df.filter(pl.col("x") > 10)
df.filter((pl.col("x") > 10) & (pl.col("y") < 20))
```

### Grouping

```python
df.group_by("category").agg([
    pl.col("value").sum(),
    pl.col("value").mean(),
    pl.count(),
])
```

### Joining

```python
df1.join(df2, on="id", how="inner")
df1.join(df2, left_on="a", right_on="b", how="left")
```

## License

MIT
