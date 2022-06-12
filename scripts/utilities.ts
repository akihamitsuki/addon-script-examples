import * as mc from 'mojang-minecraft';

const dimesion = mc.world.getDimension('overworld');
export function log(message: any): void {
  dimesion.runCommand(`say ${message}`);
}

function trunc(value: number, digit: number = 0) {
  const base = 10 ** digit;
  return Math.trunc(value * base) / base;
}

/**
 * 2点間の空間の距離を求める
 *
 * @param locationA
 * @param locationB
 * @returns
 */
export function getDistance(locationA: mc.Location, locationB: mc.Location) {
  const x = (locationA.x - locationB.x) ** 2;
  const y = (locationA.y - locationB.y) ** 2;
  const z = (locationA.z - locationB.z) ** 2;
  return trunc(Math.sqrt(x + y + z), 2);
}

/**
 * ブロック面の中心からの距離を求める
 *
 * @param faceLocX
 * @param faceLocY
 * @returns
 */
export function getDistanceFromBlockCenter(faceLocX: number, faceLocY: number) {
  const x = (faceLocX - 0.5) ** 2;
  const y = (faceLocY - 0.5) ** 2;
  return trunc(Math.sqrt(x + y), 2);
}

/**
 * 座標型から座標の文字列(string)に変換する
 *
 * @param location
 * @returns
 */
export function toString(location: mc.Location | mc.BlockLocation, digit: number = 0): string {
  // 小数点以下は切り捨て
  const x = trunc(location.x, digit);
  const y = trunc(location.y, digit);
  const z = trunc(location.z, digit);
  // 文字列として返す
  return `${x} ${y} ${z}`;
}

/**
 * LocationをBlockLocationに変換する
 *
 * @param location
 * @returns
 */
export function toBlockLocation(location: mc.Location): mc.BlockLocation {
  const x = Math.floor(location.x);
  const y = Math.floor(location.y);
  const z = Math.floor(location.z);
  return new mc.BlockLocation(x, y, z);
}

/**
 * 装置を設置したブロックの座標を取得する
 *
 * @param button 設置した装置
 * @returns
 */
export function getButtonInstalledLocation(button: mc.Block): mc.BlockLocation {
  // ブロックの種類や状態などについての組み合わせ(permutation)情報
  const permutation: mc.BlockPermutation = button.permutation;
  // ブロックの状態名を取得する（getProperty内に直接書いてもよい）
  const propertyName: string = mc.BlockProperties.facingDirection;
  // 向きを取得する（整数のプロパティ型に型変換をしている）
  const face: mc.IntBlockProperty = <mc.IntBlockProperty>permutation.getProperty(propertyName);

  // 元のブロック位置と向きから設置しているブロックを取得する（接地面は向きとは逆になることに注意）
  const blockLocation: mc.BlockLocation = button.location;
  if (face.value === 0) {
    blockLocation.y += 1; // 下向き -> 上面に設置している -> 高さ+1
  } else if (face.value === 1) {
    blockLocation.y -= 1; // 上向き -> 下面に設置
  } else if (face.value === 2) {
    blockLocation.z += 1; // 北向き -> 南面に
  } else if (face.value === 3) {
    blockLocation.z -= 1; // 南
  } else if (face.value === 4) {
    blockLocation.x += 1; // 西
  } else if (face.value === 5) {
    blockLocation.x -= 1; // 東
  }

  return blockLocation;
}

export function getLeverInstalledLocation(lever: mc.Block): mc.BlockLocation {
  // ブロックの種類や状態などについての組み合わせ(permutation)情報
  const permutation: mc.BlockPermutation = lever.permutation;
  // ブロックの状態名を取得する（getProperty内に直接書いてもよい）
  const propertyName: string = mc.BlockProperties.leverDirection;
  // 向きを取得する（文字列のプロパティ型に型変換している）
  const face: mc.StringBlockProperty = <mc.StringBlockProperty>permutation.getProperty(propertyName);

  // 元のブロック位置と向きから設置しているブロックを取得する（接地面は向きとは逆になることに注意）
  const blockLocation: mc.BlockLocation = lever.location;
  if (face.value === 'down_east_west' || face.value === 'down_north_south') {
    blockLocation.y += 1; // 下向き -> 上面に設置している
  } else if (face.value === 'up_north_south' || face.value === 'up_east_west') {
    blockLocation.y -= 1; // 上
  } else if (face.value === 'north') {
    blockLocation.z += 1; // 北
  } else if (face.value === 'south') {
    blockLocation.z -= 1; // 南
  } else if (face.value === 'west') {
    blockLocation.x += 1; // 西
  } else if (face.value === 'east') {
    blockLocation.x -= 1; // 東
  }

  return blockLocation;
}
