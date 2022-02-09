/*
 * @Author: xiaoWen
 * @Date: 2022-02-09 11:03:58
 * @LastEditors: xiaoWen
 * @LastEditTime: 2022-02-09 14:15:36
 */

interface MapItem {
  label: string;
  value: string;
}

enum ESelectTypeMapValue {
  baseWord = 'baseWord',
  fingerText = 'fingerText'
}

const fiterWorkArr = ['META', 'ALT', 'CONTROL', 'SHIFT', 'CAPSLOCK', 'TAB', 'ENTER']; // 需要过滤的特殊键

const wordInterval = 5; // 间隔

const selectTypeMap: MapItem[] = [
  { label: '基础字母', value: ESelectTypeMapValue.baseWord },
  { label: '手指练习', value: ESelectTypeMapValue.fingerText }
];

const baseWorkArr: MapItem[] = [
  // 要练习的字符映射
  { label: '中排-右', value: 'HJKL;' },
  { label: '中排-左', value: 'ASDFG' },
  { label: '上排-右', value: 'YUIOP' },
  { label: '上排-左', value: 'QWERT' },
  { label: '下排-右', value: 'NM,./' },
  { label: '下排-左', value: 'ZXCVB' }
];

const fingerTestArr: MapItem[] = [
  { label: '小拇指-左', value: '1qaz' },
  { label: '无名指-左', value: '2wsx' },
  { label: '中指-左', value: '3edc' },
  { label: '食指-左', value: '4rfv5tgb' },
  { label: '食指-右', value: '6yhn7ujm' },
  { label: '中指-右', value: '8ik,' },
  { label: '无名指-右', value: '9ol.' },
  { label: '小拇指-右', value: "0p;/-['=]" }
];

export { selectTypeMap, baseWorkArr, fingerTestArr, fiterWorkArr, wordInterval, ESelectTypeMapValue };
export type { MapItem };
