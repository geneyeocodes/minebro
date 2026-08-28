export default function ItemImage({ item, size = 32, className = "" }) {
  if (!item?.image) return null;

  return (
    <img
      src={item.image}
      alt={item.displayName}
      width={size}
      height={size}
      className={className}
    />
  );
}
