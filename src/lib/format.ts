/** Prices are not public yet: until a number is set we show only the hryvnia sign. */
export function formatPrice(value: number | null | undefined) {
  if (value == null) return "₴";
  return `${new Intl.NumberFormat("uk-UA").format(value).replace(/ /g, " ")} ₴`;
}
