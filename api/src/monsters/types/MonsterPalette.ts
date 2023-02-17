/**
 * 
 * A colour palette for a monster with each shade defined.
 * 
 */
export class MonsterPalette {
  paletteId: number;
  colours: {
    darkest: string;
    darker: string;
    dark: string;
    base: string;
    light: string;
    lighter: string;
    lightest: string;
  };

  /**
   * 
   * Construct a palette with its id and a list of colours.
   * 
   * @param paletteId value between 0 - 15 
   * @param colours a list of colours, sorted darkest to lightest
   * 
   */
  constructor(paletteId: number, colours: string[7]) {
    this.paletteId = paletteId;
    this.colours = {
        darkest: colours[0],
        darker: colours[1],
        dark: colours[2],
        base: colours[3],
        light: colours[4],
        lighter: colours[5],
        lightest: colours[6]
    };
  }
}
