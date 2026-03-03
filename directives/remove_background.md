# Remove Background Directive

## Goal
Remove backgrounds from images while preserving transparency. Supports batch processing for multiple images.

## When to Use This
- Preparing product images for web display
- Creating transparent logos or badges
- Removing unwanted backgrounds from photos
- Batch processing multiple images with backgrounds

## Inputs

### Required
- **Input Path**: Path to image file or directory containing images
  - Supported formats: `.png`, `.jpg`, `.jpeg`, `.webp`
  - Can be a single file or directory

### Optional
- **Output Path**: Custom output location
  - If not specified, replaces original (creates backup)
  - For single files: Can be file path or directory
  - For batch processing: Must be directory

## Tool/Script
`execution/remove_background.py`

**Dependencies** (in requirements.txt):
- `rembg>=2.0.50` - AI-powered background removal
- `Pillow>=10.0.0` - Image processing

## Usage Examples

### Single Image (Replace Original)
```bash
source venv/bin/activate
python3 execution/remove_background.py public/images/badge.png
```
- Creates backup: `badge_original.png`
- Outputs: `badge.png` (with transparent background)

### Single Image (Custom Output)
```bash
source venv/bin/activate
python3 execution/remove_background.py input.jpg output/logo.png
```

### Batch Process Directory
```bash
source venv/bin/activate
python3 execution/remove_background.py public/images/badges/
```
- Processes all supported images in directory
- Creates backups with `_original` suffix
- Replaces originals with transparent versions

### Batch with Custom Output Directory
```bash
source venv/bin/activate
python3 execution/remove_background.py input_dir/ output_dir/
```

## Outputs

### Success
- Processed image(s) with transparent background saved to output location
- If replacing original: Backup created with `_original` suffix
- Console output shows:
  - Files processed
  - Success/failure status for each
  - Summary statistics (for batch processing)

### Common Output Patterns
```
Processing: badge.png
  ✓ Backup created: badge_original.png
  ✓ Background removed: badge.png

Results:
  ✓ Successful: 5
  ✗ Failed: 0
  Total: 5
```

## Edge Cases & Troubleshooting

### Edge Case: Image Already Has Transparency
- **Behavior**: Script will still process, may improve edge quality
- **Action**: Review output to ensure desired result

### Edge Case: Complex Backgrounds
- **Behavior**: AI may struggle with very complex or similar-colored backgrounds
- **Action**: Review output; may need manual editing for edge cases

### Edge Case: Very Large Images
- **Behavior**: Processing may take longer (30-60 seconds per image)
- **Action**: Be patient; progress is shown in console

### Error: "No supported images found"
- **Cause**: Directory contains no PNG, JPG, JPEG, or WEBP files
- **Solution**: Verify directory path and file formats

### Error: "Unsupported file format"
- **Cause**: File extension not in supported list
- **Solution**: Convert to PNG, JPG, or WEBP first

### Error: Module import errors
- **Cause**: Dependencies not installed
- **Solution**:
  ```bash
  source venv/bin/activate
  pip install -r requirements.txt
  ```

### Error: "Input path does not exist"
- **Cause**: File/directory path is incorrect
- **Solution**: Verify path is correct (use absolute or relative from project root)

## Performance Notes
- **Speed**: ~2-5 seconds per typical image (varies by size/complexity)
- **Memory**: Requires ~500MB-2GB RAM depending on image size
- **First Run**: May download AI model (~170MB) on first execution

## Quality Expectations
- **Edge Quality**: High quality for clear subject-background separation
- **Hair/Fur**: Good quality for most cases; very fine details may need touch-up
- **Transparent Objects**: May remove parts of transparent/translucent objects
- **Best Results**: Clear subjects with distinct backgrounds

## Post-Processing Recommendations
- Review processed images before deploying to production
- For critical assets, may want manual touch-up in image editor
- Optimize file size for web (use tools like ImageOptim or TinyPNG)

## Example Workflow: Processing New Badge Images
1. Place badge images in `public/images/`
2. Run script on directory or individual files
3. Verify transparency in image viewer
4. Use in Next.js Image components with transparent backgrounds
5. Deploy to production

## Updates & Maintenance
- Script is deterministic and requires no updates for basic use
- If AI model quality improves, update `rembg` package:
  ```bash
  source venv/bin/activate
  pip install --upgrade rembg
  ```

## Learnings & Improvements
- **2025-02-02**: Initial creation for Thumbtack badge processing
- Added batch processing support for efficiency
- Automatic backup system prevents data loss
