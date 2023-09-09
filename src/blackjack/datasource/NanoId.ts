import {customAlphabet} from 'nanoid';

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345679"

export function nanoidGenerator(length: number) {
  return customAlphabet(alphabet, length)
}

const nanoid_6 = nanoidGenerator(6);
export function nanoid6() {
  return nanoid_6()
}
