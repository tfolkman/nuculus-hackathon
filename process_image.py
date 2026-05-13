#!/usr/bin/env python3
"""
Process shardplate image: remove black background + Gemini watermark
Run: python3 process_image.py
"""
from PIL import Image
import os

def process_shardplate():
    input_path = "assets/shardplate.png"
    output_path = "assets/shardplate_processed.png"

    if not os.path.exists(input_path):
        # Try other common extensions
        for ext in [".jpg", ".jpeg", ".webp", ".gif"]:
            alt = input_path.replace(".png", ext)
            if os.path.exists(alt):
                input_path = alt
                break
        else:
            print(f"ERROR: Could not find assets/shardplate image.")
            print("Please save your armor image as assets/shardplate.png (or .jpg/.jpeg/.webp)")
            return

    print(f"Loading: {input_path}")
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    print("Removing black background...")
    black_threshold = 25  # Pixels darker than this become transparent
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r < black_threshold and g < black_threshold and b < black_threshold:
                pixels[x, y] = (0, 0, 0, 0)

    print("Removing Gemini watermark in bottom-right corner...")
    # The Gemini logo is a small light-colored mark in the bottom-right corner
    # We'll detect light pixels in the bottom-right quadrant that are surrounded by
    # mostly transparent/black pixels and remove them.
    logo_region_w = width // 4
    logo_region_h = height // 5
    logo_start_x = width - logo_region_w
    logo_start_y = height - logo_region_h

    for y in range(logo_start_y, height):
        for x in range(logo_start_x, width):
            r, g, b, a = pixels[x, y]
            if a > 0:  # Only check visible pixels
                # Check neighbors to see if this is isolated (part of logo on black bg)
                transparent_neighbors = 0
                total_neighbors = 0
                for dy in [-2, -1, 0, 1, 2]:
                    for dx in [-2, -1, 0, 1, 2]:
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < width and 0 <= ny < height and (dx, dy) != (0, 0):
                            total_neighbors += 1
                            if pixels[nx, ny][3] == 0:
                                transparent_neighbors += 1
                # If most neighbors are transparent, it's likely the logo
                if total_neighbors > 0 and transparent_neighbors / total_neighbors > 0.6:
                    pixels[x, y] = (0, 0, 0, 0)

    # Also do a final pass: in the bottom-right corner, make ANY remaining
    # non-transparent pixels transparent if they're light colored
    for y in range(logo_start_y, height):
        for x in range(logo_start_x, width):
            r, g, b, a = pixels[x, y]
            if a > 0 and (r > 80 or g > 80 or b > 80):
                pixels[x, y] = (0, 0, 0, 0)

    img.save(output_path)
    print(f"Saved processed image to: {output_path}")
    print("Done! The black background and Gemini watermark have been removed.")

if __name__ == "__main__":
    process_shardplate()
