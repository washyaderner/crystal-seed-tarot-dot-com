#!/usr/bin/env python3
"""
Background Removal Script using rembg
=====================================

Removes backgrounds from images while preserving transparency.
Supports single files or batch processing of directories.

Usage:
    python3 remove_background.py <input_path> [output_path]

Arguments:
    input_path:  Path to image file or directory
    output_path: (Optional) Output directory. Defaults to same directory as input.

Examples:
    # Single file (replaces original, backs up to *_original.png)
    python3 remove_background.py image.png

    # Single file with custom output
    python3 remove_background.py image.png output/

    # Batch process directory
    python3 remove_background.py images/

    # Batch process with custom output
    python3 remove_background.py images/ output/

Dependencies:
    - rembg>=2.0.50
    - Pillow>=10.0.0
"""

import sys
import os
from pathlib import Path
from rembg import remove
from PIL import Image
import shutil

# Supported image formats
SUPPORTED_FORMATS = {'.png', '.jpg', '.jpeg', '.webp'}

def process_image(input_path: Path, output_path: Path, backup: bool = True) -> bool:
    """
    Remove background from a single image.

    Args:
        input_path: Path to input image
        output_path: Path for output image
        backup: If True and output overwrites input, create backup

    Returns:
        True if successful, False otherwise
    """
    try:
        print(f"Processing: {input_path.name}")

        # Read input image
        with open(input_path, 'rb') as input_file:
            input_data = input_file.read()

        # Remove background
        output_data = remove(input_data)

        # Create backup if overwriting and backup is enabled
        if backup and output_path == input_path and input_path.exists():
            backup_path = input_path.parent / f"{input_path.stem}_original{input_path.suffix}"
            if not backup_path.exists():  # Don't overwrite existing backups
                shutil.copy2(input_path, backup_path)
                print(f"  ✓ Backup created: {backup_path.name}")

        # Ensure output directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Save output image
        with open(output_path, 'wb') as output_file:
            output_file.write(output_data)

        print(f"  ✓ Background removed: {output_path.name}")
        return True

    except Exception as e:
        print(f"  ✗ Error processing {input_path.name}: {str(e)}")
        return False


def process_directory(input_dir: Path, output_dir: Path = None) -> tuple[int, int]:
    """
    Process all images in a directory.

    Args:
        input_dir: Directory containing images
        output_dir: Output directory (default: same as input_dir)

    Returns:
        Tuple of (successful_count, failed_count)
    """
    if output_dir is None:
        output_dir = input_dir

    # Find all images
    image_files = []
    for ext in SUPPORTED_FORMATS:
        image_files.extend(input_dir.glob(f"*{ext}"))
        image_files.extend(input_dir.glob(f"*{ext.upper()}"))

    if not image_files:
        print(f"No supported images found in {input_dir}")
        print(f"Supported formats: {', '.join(SUPPORTED_FORMATS)}")
        return 0, 0

    print(f"\nFound {len(image_files)} image(s) to process")
    print("-" * 50)

    successful = 0
    failed = 0

    for img_path in image_files:
        # Skip backup files
        if '_original' in img_path.stem:
            continue

        output_path = output_dir / img_path.name

        if process_image(img_path, output_path, backup=(output_dir == input_dir)):
            successful += 1
        else:
            failed += 1
        print()  # Blank line between files

    return successful, failed


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else None

    # Validate input
    if not input_path.exists():
        print(f"Error: Input path does not exist: {input_path}")
        sys.exit(1)

    print("\n" + "=" * 50)
    print("Background Removal Tool")
    print("=" * 50 + "\n")

    # Process based on input type
    if input_path.is_file():
        # Single file processing
        if input_path.suffix.lower() not in SUPPORTED_FORMATS:
            print(f"Error: Unsupported file format: {input_path.suffix}")
            print(f"Supported formats: {', '.join(SUPPORTED_FORMATS)}")
            sys.exit(1)

        if output_path:
            # Custom output location
            if output_path.is_dir():
                output_file = output_path / input_path.name
            else:
                output_file = output_path
        else:
            # Replace original
            output_file = input_path

        success = process_image(input_path, output_file, backup=True)

        print("-" * 50)
        if success:
            print("\n✓ Successfully processed image")
        else:
            print("\n✗ Failed to process image")
            sys.exit(1)

    elif input_path.is_dir():
        # Directory processing
        if output_path and output_path.exists() and not output_path.is_dir():
            print(f"Error: Output path must be a directory when processing multiple files")
            sys.exit(1)

        successful, failed = process_directory(input_path, output_path)

        print("-" * 50)
        print(f"\nResults:")
        print(f"  ✓ Successful: {successful}")
        print(f"  ✗ Failed: {failed}")
        print(f"  Total: {successful + failed}")

        if failed > 0:
            sys.exit(1)

    else:
        print(f"Error: Invalid input path: {input_path}")
        sys.exit(1)

    print("\n" + "=" * 50)
    print("Done!")
    print("=" * 50 + "\n")


if __name__ == "__main__":
    main()
