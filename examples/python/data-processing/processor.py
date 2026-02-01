"""
Modern data processing with Polars.

Demonstrates fast DataFrame operations using Polars instead of pandas,
with type-safe transformations and modern Python patterns.

Example:
    >>> processor = DataProcessor()
    >>> df = processor.load_csv("data.csv")
    >>> result = processor.transform_sales_data(df)
"""

from pathlib import Path

import polars as pl
from loguru import logger


class DataProcessor:
    """
    High-performance data processor using Polars.
    
    Polars is significantly faster than pandas for large datasets,
    with lazy evaluation and parallel processing.
    
    Example:
        >>> processor = DataProcessor()
        >>> df = processor.create_sample_sales_data(1000)
        >>> summary = processor.analyze_sales_by_region(df)
    """
    
    def __init__(self, lazy: bool = True) -> None:
        """
        Initialize data processor.
        
        Args:
            lazy: Use lazy evaluation for better performance
        """
        self.lazy = lazy
        logger.info(f"DataProcessor initialized (lazy={lazy})")
    
    def load_csv(
        self,
        path: str | Path,
        schema_overrides: dict[str, pl.DataType] | None = None,
    ) -> pl.DataFrame | pl.LazyFrame:
        """
        Load CSV file into Polars DataFrame.
        
        Args:
            path: Path to CSV file
            schema_overrides: Optional schema overrides for columns
            
        Returns:
            Polars DataFrame or LazyFrame
            
        Example:
            >>> processor = DataProcessor()
            >>> df = processor.load_csv("sales.csv")
            >>> print(df.shape)
        """
        logger.info(f"Loading CSV: {path}")
        
        if self.lazy:
            df = pl.scan_csv(path, schema_overrides=schema_overrides)
        else:
            df = pl.read_csv(path, schema_overrides=schema_overrides)
        
        logger.info(f"Loaded data: {df.collect().shape if self.lazy else df.shape}")
        return df
    
    def load_json(
        self,
        path: str | Path,
    ) -> pl.DataFrame | pl.LazyFrame:
        """
        Load JSON file into Polars DataFrame.
        
        Args:
            path: Path to JSON file (JSON lines format)
            
        Returns:
            Polars DataFrame or LazyFrame
            
        Example:
            >>> processor = DataProcessor()
            >>> df = processor.load_json("data.jsonl")
        """
        logger.info(f"Loading JSON: {path}")
        
        if self.lazy:
            df = pl.scan_ndjson(path)
        else:
            df = pl.read_ndjson(path)
        
        return df
    
    def create_sample_sales_data(self, n_rows: int = 1000) -> pl.DataFrame:
        """
        Create sample sales data for testing.
        
        Args:
            n_rows: Number of rows to generate
            
        Returns:
            Sample sales DataFrame
            
        Example:
            >>> processor = DataProcessor()
            >>> df = processor.create_sample_sales_data(100)
            >>> df.head()
        """
        import random
        from datetime import datetime, timedelta
        
        logger.info(f"Generating {n_rows} sample sales records")
        
        # Generate sample data
        regions = ["North", "South", "East", "West"]
        products = ["ProductA", "ProductB", "ProductC", "ProductD"]
        
        base_date = datetime(2024, 1, 1)
        
        data = {
            "order_id": list(range(1, n_rows + 1)),
            "date": [
                base_date + timedelta(days=random.randint(0, 365))
                for _ in range(n_rows)
            ],
            "region": [random.choice(regions) for _ in range(n_rows)],
            "product": [random.choice(products) for _ in range(n_rows)],
            "quantity": [random.randint(1, 100) for _ in range(n_rows)],
            "price": [round(random.uniform(10.0, 1000.0), 2) for _ in range(n_rows)],
        }
        
        df = pl.DataFrame(data)
        
        # Add calculated column
        df = df.with_columns(
            (pl.col("quantity") * pl.col("price")).alias("total_amount")
        )
        
        return df
    
    def transform_sales_data(
        self,
        df: pl.DataFrame | pl.LazyFrame,
    ) -> pl.DataFrame:
        """
        Transform sales data with aggregations and calculations.
        
        Args:
            df: Input sales DataFrame
            
        Returns:
            Transformed DataFrame with aggregations
            
        Example:
            >>> processor = DataProcessor()
            >>> df = processor.create_sample_sales_data(100)
            >>> result = processor.transform_sales_data(df)
        """
        logger.info("Transforming sales data")
        
        # Modern Polars query syntax
        result = (
            df
            .with_columns([
                pl.col("date").cast(pl.Date).alias("date"),
                pl.col("total_amount").fill_null(0),
            ])
            .with_columns([
                pl.col("date").dt.year().alias("year"),
                pl.col("date").dt.month().alias("month"),
                pl.col("date").dt.quarter().alias("quarter"),
            ])
            .with_columns([
                # Calculate revenue per unit
                (pl.col("total_amount") / pl.col("quantity")).alias("avg_price_per_unit"),
            ])
        )
        
        if isinstance(result, pl.LazyFrame):
            result = result.collect()
        
        logger.info(f"Transformation complete: {result.shape}")
        return result
    
    def analyze_sales_by_region(
        self,
        df: pl.DataFrame | pl.LazyFrame,
    ) -> pl.DataFrame:
        """
        Analyze sales performance by region.
        
        Args:
            df: Input sales DataFrame
            
        Returns:
            Regional sales analysis
            
        Example:
            >>> processor = DataProcessor()
            >>> df = processor.create_sample_sales_data(1000)
            >>> analysis = processor.analyze_sales_by_region(df)
            >>> print(analysis)
        """
        logger.info("Analyzing sales by region")
        
        result = (
            df
            .group_by("region")
            .agg([
                pl.count().alias("total_orders"),
                pl.col("quantity").sum().alias("total_quantity"),
                pl.col("total_amount").sum().alias("total_revenue"),
                pl.col("total_amount").mean().alias("avg_order_value"),
                pl.col("total_amount").max().alias("max_order_value"),
                pl.col("total_amount").min().alias("min_order_value"),
            ])
            .sort("total_revenue", descending=True)
        )
        
        if isinstance(result, pl.LazyFrame):
            result = result.collect()
        
        logger.info(f"Regional analysis complete: {result.shape}")
        return result
    
    def analyze_product_performance(
        self,
        df: pl.DataFrame | pl.LazyFrame,
    ) -> pl.DataFrame:
        """
        Analyze product performance over time.
        
        Args:
            df: Input sales DataFrame
            
        Returns:
            Product performance analysis
            
        Example:
            >>> processor = DataProcessor()
            >>> df = processor.create_sample_sales_data(1000)
            >>> analysis = processor.analyze_product_performance(df)
        """
        logger.info("Analyzing product performance")
        
        result = (
            df
            .with_columns([
                pl.col("date").cast(pl.Date),
            ])
            .with_columns([
                pl.col("date").dt.year().alias("year"),
                pl.col("date").dt.month().alias("month"),
            ])
            .group_by(["product", "year", "month"])
            .agg([
                pl.count().alias("orders"),
                pl.col("quantity").sum().alias("units_sold"),
                pl.col("total_amount").sum().alias("revenue"),
            ])
            .sort(["product", "year", "month"])
        )
        
        if isinstance(result, pl.LazyFrame):
            result = result.collect()
        
        return result
    
    def filter_high_value_orders(
        self,
        df: pl.DataFrame | pl.LazyFrame,
        threshold: float = 1000.0,
    ) -> pl.DataFrame:
        """
        Filter orders above value threshold.
        
        Args:
            df: Input sales DataFrame
            threshold: Minimum order value
            
        Returns:
            Filtered DataFrame with high-value orders
            
        Example:
            >>> processor = DataProcessor()
            >>> df = processor.create_sample_sales_data(1000)
            >>> high_value = processor.filter_high_value_orders(df, 5000.0)
        """
        logger.info(f"Filtering orders > ${threshold}")
        
        result = df.filter(pl.col("total_amount") > threshold)
        
        if isinstance(result, pl.LazyFrame):
            result = result.collect()
        
        logger.info(f"Found {len(result)} high-value orders")
        return result
    
    def save_results(
        self,
        df: pl.DataFrame | pl.LazyFrame,
        path: str | Path,
        format: str = "csv",
    ) -> None:
        """
        Save DataFrame to file.
        
        Args:
            df: DataFrame to save
            path: Output file path
            format: Output format (csv, json, parquet)
            
        Example:
            >>> processor = DataProcessor()
            >>> df = processor.create_sample_sales_data(100)
            >>> processor.save_results(df, "output.csv")
        """
        logger.info(f"Saving results to {path} ({format})")
        
        if isinstance(df, pl.LazyFrame):
            df = df.collect()
        
        path_obj = Path(path)
        path_obj.parent.mkdir(parents=True, exist_ok=True)
        
        match format.lower():
            case "csv":
                df.write_csv(path)
            case "json":
                df.write_ndjson(path)
            case "parquet":
                df.write_parquet(path)
            case _:
                raise ValueError(f"Unsupported format: {format}")
        
        logger.info(f"Saved {len(df)} rows to {path}")
    
    def get_summary_statistics(
        self,
        df: pl.DataFrame | pl.LazyFrame,
        numeric_only: bool = True,
    ) -> pl.DataFrame:
        """
        Get summary statistics for DataFrame.
        
        Args:
            df: Input DataFrame
            numeric_only: Only compute stats for numeric columns
            
        Returns:
            Summary statistics DataFrame
            
        Example:
            >>> processor = DataProcessor()
            >>> df = processor.create_sample_sales_data(1000)
            >>> stats = processor.get_summary_statistics(df)
            >>> print(stats)
        """
        logger.info("Computing summary statistics")
        
        if isinstance(df, pl.LazyFrame):
            df = df.collect()
        
        if numeric_only:
            # Get only numeric columns
            numeric_cols = [
                col for col in df.columns
                if df[col].dtype in [pl.Int64, pl.Int32, pl.Float64, pl.Float32]
            ]
            df = df.select(numeric_cols)
        
        # Compute descriptive statistics
        stats = df.describe()
        
        return stats


def main() -> None:
    """
    Example usage of DataProcessor.
    
    Demonstrates loading, transforming, and analyzing sales data.
    """
    logger.info("Starting data processing example")
    
    # Initialize processor
    processor = DataProcessor(lazy=False)
    
    # Create sample data
    df = processor.create_sample_sales_data(n_rows=10000)
    logger.info(f"Sample data shape: {df.shape}")
    
    # Transform data
    transformed = processor.transform_sales_data(df)
    
    # Regional analysis
    regional_summary = processor.analyze_sales_by_region(transformed)
    logger.info("\nRegional Sales Summary:")
    logger.info(f"\n{regional_summary}")
    
    # Product analysis
    product_summary = processor.analyze_product_performance(transformed)
    logger.info(f"\nProduct performance data: {product_summary.shape}")
    
    # High-value orders
    high_value = processor.filter_high_value_orders(transformed, threshold=5000.0)
    logger.info(f"\nHigh-value orders: {len(high_value)}")
    
    # Summary statistics
    stats = processor.get_summary_statistics(transformed)
    logger.info("\nSummary Statistics:")
    logger.info(f"\n{stats}")
    
    # Save results
    processor.save_results(regional_summary, "output/regional_summary.csv")
    processor.save_results(product_summary, "output/product_summary.parquet", format="parquet")
    
    logger.info("Data processing complete!")


if __name__ == "__main__":
    from loguru import logger
    
    logger.remove()
    logger.add(
        lambda msg: print(msg, end=""),
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>",
        colorize=True,
    )
    
    main()
