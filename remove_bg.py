from rembg import remove
from PIL import Image

input_path = "frontend/src/assets/badges/gift_sub/sub1badge.png"
output_path = "frontend/src/assets/badges/gift_sub/sub1badge_nobg.png"

input_image = Image.open(input_path)
output_image = remove(input_image)

output_image.save(output_path)

print("Done!")