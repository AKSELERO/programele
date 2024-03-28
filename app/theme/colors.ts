// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  neutral100: "#FCFCFC",
  neutral200: "#F7F7F7",
  neutral300: "#F2F2F2",
  neutral400: "#F0F0F0",
  neutral500: "#EBEBEB",
  neutral600: "#D4D4D4",
  neutral700: "#BDBDBD",
  neutral800: "#9C9C9C",
  neutral900: "#737373",

  primary100: "#D6FFE4",
  primary200: "#99FFBB",
  primary300: "#00F050",
  primary400: "#00D146",
  primary500: "#006622", // Replaced with your specified color
  primary600: "#005C1F",

  secondary100: "#DBFFE7",
  secondary200: "#ADFFC9",
  secondary300: "#00FA53",
  secondary400: "#00E04B",
  secondary500: "#009933", // Replaced with your specified color

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const;


export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: "#101911",
  /**
   * Secondary text information.
   */
  textDim: "#101911",
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: "#101911",
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,
}
