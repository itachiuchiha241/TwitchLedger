export const giftBadgeImages = import.meta.glob(
  "../assets/badges/gift_sub/*.png",
  {
    eager: true,
    import: "default",
  }
);

export const bitsBadgeImages = import.meta.glob(
  "../assets/badges/bits/*.png",
  {
    eager: true,
    import: "default",
  }
);

console.log("Gift Badge Images:", giftBadgeImages);
console.log("Bits Badge Images:", bitsBadgeImages);

export function getGiftBadgeImage(level) {
  const path = `../assets/badges/gift_sub/sub${level}badge.png`;

  console.log("Gift Path:", path);
  console.log("Gift Result:", giftBadgeImages[path]);

  return giftBadgeImages[path];
}

export function getBitsBadgeImage(level) {
  const path = `../assets/badges/bits/${level}bits.png`;

  console.log("Bits Path:", path);
  console.log("Bits Result:", bitsBadgeImages[path]);

  return bitsBadgeImages[path];
}