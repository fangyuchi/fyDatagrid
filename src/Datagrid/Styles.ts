/* eslint-disable camelcase */

export default class Styles {

  public static density = 2;

  /** TODO: 目前没有多种尺寸 */
  private static densitys = [ 1, 2, 3 ];

  // ========================= HEADER ==========================

  /** 表头高度 */
  private static header_height = [ 36, 36, 36 ];

  /** 表头内边距 */
  private static header_padding = [
    '8px',
    '8px',
    '8px'
  ]; 

  /** 表头颜色 */
  private static header_backgroundColor = '#f4fbff';

  /** 表头icon尺寸 */
  private static header_iconHeight = [ 20, 20, 20 ];
  private static header_iconWidth = [ 12, 12, 12 ];

  // ========================= CELL ==========================

  /** 单元格高度 */
  private static cell_height = [ 48, 48, 48 ];

  /** 单元格宽度 */
  private static cell_width = [ 120, 120, 120 ];

  /** 单元格内边距 */
  private static cell_padding = [
    '8px',
    '8px',
    '8px'
  ]; 

  public static getStyle = (element: 'header' | 'cell', attribute: string, density: number = Styles.density) => {
    const field = Styles[`${element}_${attribute}`];

    if (!field) {
      return null;
    }

    if (Array.isArray(field) && (field.length === Styles.densitys.length)) {
      return field[density ?? 2];
    }

    return field;
  };

}
