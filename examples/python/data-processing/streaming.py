"""
Streaming data processing for large files.

Demonstrates memory-efficient processing of large CSV/JSON files
using Polars streaming capabilities.
"""

from collections.abc import Iterator
from pathlib import Path

import polars as pl
from loguru import logger


class StreamingProcessor:
    """
    Memory-efficient streaming processor for large datasets.
    
    Uses Polars lazy evaluation and streaming to process files
    larger than available RAM.
    
    Example:
        >>> processor = StreamingProcessor()
        >>> processor.process_large_csv("huge_file.csv", batch_size=100_000)
    """
    
    def __init__(self, chunk_size: int = 100_000) -> None:
        """
        Initialize streaming processor.
        
        Args:
            chunk_size: Number of rows to process in each batch
        """
        self.chunk_size = chunk_size
        logger.info(f"StreamingProcessor initialized (chunk_size={chunk_size})")
    
    def stream_csv_batches(
        self,
        path: str | Path,
        batch_size: int | None = None,
    ) -> Iterator[pl.DataFrame]:
        """
        Stream CSV file in batches.
        
        Args:
            path: Path to CSV file
            batch_size: Rows per batch (uses chunk_size if None)
            
        Yields:
            DataFrames with batch_size rows each
            
        Example:
            >>> processor = StreamingProcessor()
            >>> for batch in processor.stream_csv_batches("large.csv"):
            ...     print(f"Processing {len(batch)} rows")
        """
        batch_size = batch_size or self.chunk_size
        logger.info(f"Streaming CSV in batches of {batch_size}: {path}")
        
        # Use Polars batched reader
        reader = pl.read_csv_batched(path, batch_size=batch_size)
        
        batch_num = 0
        while True:
            batch = reader.next_batches(1)
            if not batch:
                break
            
            batch_num += 1
            df = batch[0]
            logger.debug(f"Batch {batch_num}: {len(df)} rows")
            yield df
        
        logger.info(f"Streamed {batch_num} batches from {path}")
    
    def process_large_csv(
        self,
        input_path: str | Path,
        output_path: str | Path,
        transform_fn: callable | None = None,
    ) -> dict[str, int]:
        """
        Process large CSV file in streaming fashion.
        
        Args:
            input_path: Input CSV file path
            output_path: Output CSV file path
            transform_fn: Optional transformation function for each batch
            
        Returns:
            Processing statistics
            
        Example:
            >>> def add_tax(df: pl.DataFrame) -> pl.DataFrame:
            ...     return df.with_columns((pl.col("amount") * 1.1).alias("total"))
            >>> 
            >>> processor = StreamingProcessor()
            >>> stats = processor.process_large_csv(
            ...     "input.csv",
            ...     "output.csv",
            ...     transform_fn=add_tax
            ... )
        """
        logger.info(f"Processing large CSV: {input_path} -> {output_path}")
        
        total_rows = 0
        batch_count = 0
        
        # Process first batch and write with header
        batches = self.stream_csv_batches(input_path)
        first_batch = next(batches)
        
        if transform_fn:
            first_batch = transform_fn(first_batch)
        
        # Write first batch with header
        first_batch.write_csv(output_path)
        total_rows += len(first_batch)
        batch_count += 1
        
        # Process remaining batches and append
        for batch in batches:
            if transform_fn:
                batch = transform_fn(batch)
            
            # Append without header
            with open(output_path, "ab") as f:
                batch.write_csv(f, include_header=False)
            
            total_rows += len(batch)
            batch_count += 1
            
            if batch_count % 10 == 0:
                logger.info(f"Processed {batch_count} batches, {total_rows:,} rows")
        
        stats = {
            "total_rows": total_rows,
            "batch_count": batch_count,
            "avg_batch_size": total_rows // batch_count if batch_count > 0 else 0,
        }
        
        logger.info(f"Processing complete: {stats}")
        return stats
    
    def aggregate_large_file_lazy(
        self,
        path: str | Path,
        group_by: list[str],
        aggregations: dict[str, str],
    ) -> pl.DataFrame:
        """
        Aggregate large file using lazy evaluation.
        
        Polars lazy evaluation only loads data needed for computation,
        enabling processing of files larger than RAM.
        
        Args:
            path: Path to CSV file
            group_by: Columns to group by
            aggregations: Dict mapping column -> aggregation function
            
        Returns:
            Aggregated DataFrame
            
        Example:
            >>> processor = StreamingProcessor()
            >>> result = processor.aggregate_large_file_lazy(
            ...     "huge_sales.csv",
            ...     group_by=["region", "product"],
            ...     aggregations={"revenue": "sum", "orders": "count"}
            ... )
        """
        logger.info(f"Lazy aggregating: {path}")
        
        # Scan file without loading into memory
        lf = pl.scan_csv(path)
        
        # Build aggregation expressions
        agg_exprs = []
        for col, agg_func in aggregations.items():
            match agg_func:
                case "sum":
                    agg_exprs.append(pl.col(col).sum().alias(f"{col}_sum"))
                case "mean" | "avg":
                    agg_exprs.append(pl.col(col).mean().alias(f"{col}_avg"))
                case "count":
                    agg_exprs.append(pl.col(col).count().alias(f"{col}_count"))
                case "min":
                    agg_exprs.append(pl.col(col).min().alias(f"{col}_min"))
                case "max":
                    agg_exprs.append(pl.col(col).max().alias(f"{col}_max"))
                case _:
                    logger.warning(f"Unknown aggregation: {agg_func}")
        
        # Execute lazy query
        result = (
            lf
            .group_by(group_by)
            .agg(agg_exprs)
            .sort(group_by)
            .collect(streaming=True)  # Use streaming execution
        )
        
        logger.info(f"Aggregation complete: {result.shape}")
        return result
    
    def filter_and_sample_large_file(
        self,
        input_path: str | Path,
        output_path: str | Path,
        filter_expr: str,
        sample_fraction: float = 0.1,
    ) -> None:
        """
        Filter and sample large file efficiently.
        
        Args:
            input_path: Input CSV file
            output_path: Output CSV file
            filter_expr: Polars filter expression
            sample_fraction: Fraction of rows to sample (0.0-1.0)
            
        Example:
            >>> processor = StreamingProcessor()
            >>> processor.filter_and_sample_large_file(
            ...     "huge.csv",
            ...     "sample.csv",
            ...     filter_expr="revenue > 1000",
            ...     sample_fraction=0.1
            ... )
        """
        logger.info(f"Filtering and sampling: {input_path} -> {output_path}")
        
        result = (
            pl.scan_csv(input_path)
            .filter(pl.sql_expr(filter_expr))
            .sample(fraction=sample_fraction)
            .collect(streaming=True)
        )
        
        result.write_csv(output_path)
        logger.info(f"Saved {len(result)} sampled rows to {output_path}")
    
    def merge_multiple_files(
        self,
        input_paths: list[str | Path],
        output_path: str | Path,
        deduplicate: bool = False,
    ) -> dict[str, int]:
        """
        Merge multiple CSV files efficiently.
        
        Args:
            input_paths: List of CSV files to merge
            output_path: Output merged file
            deduplicate: Remove duplicate rows
            
        Returns:
            Merge statistics
            
        Example:
            >>> processor = StreamingProcessor()
            >>> stats = processor.merge_multiple_files(
            ...     ["file1.csv", "file2.csv", "file3.csv"],
            ...     "merged.csv",
            ...     deduplicate=True
            ... )
        """
        logger.info(f"Merging {len(input_paths)} files -> {output_path}")
        
        # Scan all files lazily
        lazy_frames = [pl.scan_csv(path) for path in input_paths]
        
        # Concatenate
        merged = pl.concat(lazy_frames)
        
        # Optionally deduplicate
        if deduplicate:
            merged = merged.unique()
        
        # Collect and save
        result = merged.collect(streaming=True)
        result.write_csv(output_path)
        
        stats = {
            "input_files": len(input_paths),
            "output_rows": len(result),
        }
        
        logger.info(f"Merge complete: {stats}")
        return stats
    
    def compute_rolling_statistics(
        self,
        path: str | Path,
        date_column: str,
        value_column: str,
        window_size: int = 7,
    ) -> pl.DataFrame:
        """
        Compute rolling statistics on time series data.
        
        Args:
            path: Input CSV file
            date_column: Date column name
            value_column: Value column for statistics
            window_size: Rolling window size
            
        Returns:
            DataFrame with rolling statistics
            
        Example:
            >>> processor = StreamingProcessor()
            >>> rolling = processor.compute_rolling_statistics(
            ...     "sales.csv",
            ...     date_column="date",
            ...     value_column="revenue",
            ...     window_size=7
            ... )
        """
        logger.info(f"Computing rolling statistics (window={window_size})")
        
        result = (
            pl.scan_csv(path)
            .with_columns([
                pl.col(date_column).cast(pl.Date),
            ])
            .sort(date_column)
            .with_columns([
                pl.col(value_column)
                .rolling_mean(window_size=window_size)
                .alias(f"{value_column}_rolling_mean_{window_size}d"),
                pl.col(value_column)
                .rolling_std(window_size=window_size)
                .alias(f"{value_column}_rolling_std_{window_size}d"),
                pl.col(value_column)
                .rolling_max(window_size=window_size)
                .alias(f"{value_column}_rolling_max_{window_size}d"),
                pl.col(value_column)
                .rolling_min(window_size=window_size)
                .alias(f"{value_column}_rolling_min_{window_size}d"),
            ])
            .collect(streaming=True)
        )
        
        logger.info(f"Rolling statistics computed: {result.shape}")
        return result


def main() -> None:
    """Example usage of streaming processor."""
    logger.info("Starting streaming processing example")
    
    # Create sample large dataset
    from processor import DataProcessor
    
    processor = DataProcessor(lazy=False)
    large_df = processor.create_sample_sales_data(n_rows=500_000)
    large_df.write_csv("temp_large_sales.csv")
    logger.info("Created sample large dataset: 500,000 rows")
    
    # Initialize streaming processor
    streaming = StreamingProcessor(chunk_size=50_000)
    
    # Example 1: Stream in batches
    logger.info("\nExample 1: Streaming batches")
    batch_count = 0
    for batch in streaming.stream_csv_batches("temp_large_sales.csv", batch_size=100_000):
        batch_count += 1
        logger.info(f"Batch {batch_count}: {batch.shape}")
        if batch_count >= 2:  # Just show first 2 batches
            break
    
    # Example 2: Lazy aggregation
    logger.info("\nExample 2: Lazy aggregation")
    aggregated = streaming.aggregate_large_file_lazy(
        "temp_large_sales.csv",
        group_by=["region", "product"],
        aggregations={"total_amount": "sum", "quantity": "mean"},
    )
    logger.info(f"\n{aggregated.head(10)}")
    
    # Cleanup
    Path("temp_large_sales.csv").unlink(missing_ok=True)
    logger.info("\nStreaming processing complete!")


if __name__ == "__main__":
    from loguru import logger
    
    logger.remove()
    logger.add(
        lambda msg: print(msg, end=""),
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <level>{message}</level>",
        colorize=True,
    )
    
    main()
