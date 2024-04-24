export default function capitalizeFirstLetter(string) {
  const capitalize =
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  return capitalize;
}
