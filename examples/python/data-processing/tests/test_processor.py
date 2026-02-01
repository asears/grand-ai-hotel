"""
Pytest tests for data processing modules.

Demonstrates modern testing patterns with Given-When-Then structure.
"""

import polars as pl
import pytest
from polars.testing import assert_frame_equal

from processor import DataProcessor
from streaming import StreamingProcessor


@pytest.fixture
def sample_sales_data() -> pl.DataFrame:
    """
    Sample sales data fixture.
    
    Returns:
        Small DataFrame for testing
    """
    return pl.DataFrame({
        "order_id": [1, 2, 3, 4, 5],
        "date": ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05"],
        "region": ["North", "South", "North", "East", "West"],
        "product": ["ProductA", "ProductB", "ProductA", "ProductC", "ProductA"],
        "quantity": [10, 5, 15, 8, 12],
        "price": [100.0, 200.0, 100.0, 150.0, 100.0],
        "total_amount": [1000.0, 1000.0, 1500.0, 1200.0, 1200.0],
    })


@pytest.fixture
def processor() -> DataProcessor:
    """Data processor fixture."""
    return DataProcessor(lazy=False)


@pytest.fixture
def streaming_processor() -> StreamingProcessor:
    """Streaming processor fixture."""
    return StreamingProcessor(chunk_size=10)


class TestDataProcessor:
    """Tests for DataProcessor class."""
    
    def test_create_sample_data_generates_correct_columns(
        self,
        processor: DataProcessor,
    ) -> None:
        """
        Given: A DataProcessor instance
        When: Sample data is generated
        Then: DataFrame has expected columns
        """
        # When
        df = processor.create_sample_sales_data(n_rows=100)
        
        # Then
        expected_columns = {
            "order_id",
            "date",
            "region",
            "product",
            "quantity",
            "price",
            "total_amount",
        }
        assert set(df.columns) == expected_columns
    
    @pytest.mark.parametrize("n_rows", [10, 100, 1000])
    def test_create_sample_data_generates_correct_row_count(
        self,
        processor: DataProcessor,
        n_rows: int,
    ) -> None:
        """
        Given: A DataProcessor instance
        When: Sample data is generated with n_rows
        Then: DataFrame has exactly n_rows
        """
        # When
        df = processor.create_sample_sales_data(n_rows=n_rows)
        
        # Then
        assert len(df) == n_rows
    
    def test_transform_sales_data_adds_date_columns(
        self,
        processor: DataProcessor,
        sample_sales_data: pl.DataFrame,
    ) -> None:
        """
        Given: Sample sales DataFrame
        When: Transform is applied
        Then: Year, month, quarter columns are added
        """
        # When
        result = processor.transform_sales_data(sample_sales_data)
        
        # Then
        assert "year" in result.columns
        assert "month" in result.columns
        assert "quarter" in result.columns
    
    def test_transform_sales_data_calculates_avg_price_per_unit(
        self,
        processor: DataProcessor,
        sample_sales_data: pl.DataFrame,
    ) -> None:
        """
        Given: Sample sales DataFrame
        When: Transform is applied
        Then: avg_price_per_unit is calculated correctly
        """
        # When
        result = processor.transform_sales_data(sample_sales_data)
        
        # Then
        assert "avg_price_per_unit" in result.columns
        expected = sample_sales_data["total_amount"] / sample_sales_data["quantity"]
        assert (result["avg_price_per_unit"] - expected).abs().max() < 0.01
    
    def test_analyze_sales_by_region_groups_correctly(
        self,
        processor: DataProcessor,
        sample_sales_data: pl.DataFrame,
    ) -> None:
        """
        Given: Sample sales DataFrame with multiple regions
        When: Regional analysis is performed
        Then: Results are grouped by region
        """
        # When
        result = processor.analyze_sales_by_region(sample_sales_data)
        
        # Then
        assert "region" in result.columns
        assert len(result) == sample_sales_data["region"].n_unique()
    
    def test_analyze_sales_by_region_calculates_aggregations(
        self,
        processor: DataProcessor,
        sample_sales_data: pl.DataFrame,
    ) -> None:
        """
        Given: Sample sales DataFrame
        When: Regional analysis is performed
        Then: Correct aggregations are computed
        """
        # When
        result = processor.analyze_sales_by_region(sample_sales_data)
        
        # Then
        required_columns = {
            "region",
            "total_orders",
            "total_quantity",
            "total_revenue",
            "avg_order_value",
            "max_order_value",
            "min_order_value",
        }
        assert set(result.columns) == required_columns
    
    def test_analyze_sales_by_region_sorts_by_revenue(
        self,
        processor: DataProcessor,
        sample_sales_data: pl.DataFrame,
    ) -> None:
        """
        Given: Sample sales DataFrame
        When: Regional analysis is performed
        Then: Results are sorted by total_revenue descending
        """
        # When
        result = processor.analyze_sales_by_region(sample_sales_data)
        
        # Then
        revenues = result["total_revenue"].to_list()
        assert revenues == sorted(revenues, reverse=True)
    
    def test_filter_high_value_orders_filters_correctly(
        self,
        processor: DataProcessor,
        sample_sales_data: pl.DataFrame,
    ) -> None:
        """
        Given: Sample sales DataFrame
        When: High-value filter is applied
        Then: Only orders above threshold are returned
        """
        # Given
        threshold = 1200.0
        
        # When
        result = processor.filter_high_value_orders(sample_sales_data, threshold)
        
        # Then
        assert all(result["total_amount"] > threshold)
    
    def test_get_summary_statistics_returns_stats(
        self,
        processor: DataProcessor,
        sample_sales_data: pl.DataFrame,
    ) -> None:
        """
        Given: Sample sales DataFrame
        When: Summary statistics are computed
        Then: Stats DataFrame is returned
        """
        # When
        stats = processor.get_summary_statistics(sample_sales_data)
        
        # Then
        assert isinstance(stats, pl.DataFrame)
        assert "statistic" in stats.columns or "describe" in stats.columns


class TestStreamingProcessor:
    """Tests for StreamingProcessor class."""
    
    def test_stream_csv_batches_yields_dataframes(
        self,
        streaming_processor: StreamingProcessor,
        tmp_path,
    ) -> None:
        """
        Given: A CSV file
        When: Streaming in batches
        Then: Yields DataFrame batches
        """
        # Given
        df = pl.DataFrame({
            "a": list(range(100)),
            "b": list(range(100, 200)),
        })
        csv_path = tmp_path / "test.csv"
        df.write_csv(csv_path)
        
        # When
        batches = list(
            streaming_processor.stream_csv_batches(csv_path, batch_size=30)
        )
        
        # Then
        assert len(batches) > 0
        assert all(isinstance(batch, pl.DataFrame) for batch in batches)
        total_rows = sum(len(batch) for batch in batches)
        assert total_rows == 100
    
    def test_process_large_csv_applies_transformation(
        self,
        streaming_processor: StreamingProcessor,
        tmp_path,
    ) -> None:
        """
        Given: A CSV file and transformation function
        When: Processing large CSV
        Then: Transformation is applied to all rows
        """
        # Given
        df = pl.DataFrame({
            "value": [1, 2, 3, 4, 5],
        })
        input_path = tmp_path / "input.csv"
        output_path = tmp_path / "output.csv"
        df.write_csv(input_path)
        
        def double_value(batch: pl.DataFrame) -> pl.DataFrame:
            return batch.with_columns((pl.col("value") * 2).alias("value"))
        
        # When
        stats = streaming_processor.process_large_csv(
            input_path,
            output_path,
            transform_fn=double_value,
        )
        
        # Then
        result = pl.read_csv(output_path)
        expected = pl.DataFrame({"value": [2, 4, 6, 8, 10]})
        assert_frame_equal(result, expected)
        assert stats["total_rows"] == 5
    
    def test_aggregate_large_file_lazy_groups_correctly(
        self,
        streaming_processor: StreamingProcessor,
        tmp_path,
    ) -> None:
        """
        Given: A CSV file with groupable data
        When: Lazy aggregation is performed
        Then: Correct groups and aggregations are computed
        """
        # Given
        df = pl.DataFrame({
            "category": ["A", "B", "A", "B", "A"],
            "value": [10, 20, 30, 40, 50],
        })
        csv_path = tmp_path / "data.csv"
        df.write_csv(csv_path)
        
        # When
        result = streaming_processor.aggregate_large_file_lazy(
            csv_path,
            group_by=["category"],
            aggregations={"value": "sum"},
        )
        
        # Then
        assert len(result) == 2
        assert set(result["category"].to_list()) == {"A", "B"}
        
        # Check sums
        a_sum = result.filter(pl.col("category") == "A")["value_sum"][0]
        b_sum = result.filter(pl.col("category") == "B")["value_sum"][0]
        assert a_sum == 90  # 10 + 30 + 50
        assert b_sum == 60  # 20 + 40
    
    @pytest.mark.parametrize(
        "agg_func,expected",
        [
            ("sum", {"A": 90, "B": 60}),
            ("count", {"A": 3, "B": 2}),
            ("max", {"A": 50, "B": 40}),
            ("min", {"A": 10, "B": 20}),
        ],
    )
    def test_aggregate_large_file_lazy_aggregation_functions(
        self,
        streaming_processor: StreamingProcessor,
        tmp_path,
        agg_func: str,
        expected: dict[str, int],
    ) -> None:
        """
        Given: A CSV file and aggregation function
        When: Lazy aggregation is performed
        Then: Correct aggregation is computed
        """
        # Given
        df = pl.DataFrame({
            "category": ["A", "B", "A", "B", "A"],
            "value": [10, 20, 30, 40, 50],
        })
        csv_path = tmp_path / "data.csv"
        df.write_csv(csv_path)
        
        # When
        result = streaming_processor.aggregate_large_file_lazy(
            csv_path,
            group_by=["category"],
            aggregations={"value": agg_func},
        )
        
        # Then
        result_col = f"value_{agg_func}"
        for category, expected_value in expected.items():
            actual = result.filter(pl.col("category") == category)[result_col][0]
            assert actual == expected_value
    
    def test_merge_multiple_files_combines_data(
        self,
        streaming_processor: StreamingProcessor,
        tmp_path,
    ) -> None:
        """
        Given: Multiple CSV files
        When: Files are merged
        Then: Combined data is written to output
        """
        # Given
        df1 = pl.DataFrame({"a": [1, 2], "b": [3, 4]})
        df2 = pl.DataFrame({"a": [5, 6], "b": [7, 8]})
        df3 = pl.DataFrame({"a": [9, 10], "b": [11, 12]})
        
        paths = []
        for i, df in enumerate([df1, df2, df3], 1):
            path = tmp_path / f"file{i}.csv"
            df.write_csv(path)
            paths.append(path)
        
        output_path = tmp_path / "merged.csv"
        
        # When
        stats = streaming_processor.merge_multiple_files(
            paths,
            output_path,
            deduplicate=False,
        )
        
        # Then
        result = pl.read_csv(output_path)
        assert len(result) == 6
        assert stats["input_files"] == 3
        assert stats["output_rows"] == 6


class TestPolarsOperations:
    """Tests demonstrating modern Polars operations."""
    
    def test_modern_polars_select_syntax(self) -> None:
        """
        Given: A Polars DataFrame
        When: Using modern select syntax
        Then: Correct columns are selected
        """
        # Given
        df = pl.DataFrame({
            "a": [1, 2, 3],
            "b": [4, 5, 6],
            "c": [7, 8, 9],
        })
        
        # When
        result = df.select([pl.col("a"), pl.col("b")])
        
        # Then
        assert result.columns == ["a", "b"]
    
    def test_modern_polars_with_columns_syntax(self) -> None:
        """
        Given: A Polars DataFrame
        When: Using with_columns to add calculated column
        Then: New column is added correctly
        """
        # Given
        df = pl.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})
        
        # When
        result = df.with_columns((pl.col("a") + pl.col("b")).alias("sum"))
        
        # Then
        assert "sum" in result.columns
        assert result["sum"].to_list() == [5, 7, 9]
    
    def test_modern_polars_chaining(self) -> None:
        """
        Given: A Polars DataFrame
        When: Chaining multiple operations
        Then: All operations are applied in sequence
        """
        # Given
        df = pl.DataFrame({
            "category": ["A", "B", "A", "B"],
            "value": [10, 20, 30, 40],
        })
        
        # When
        result = (
            df
            .filter(pl.col("value") > 15)
            .group_by("category")
            .agg(pl.col("value").sum().alias("total"))
            .sort("total", descending=True)
        )
        
        # Then
        assert len(result) == 2
        assert result["total"].to_list() == [60, 30]  # B=60, A=30
