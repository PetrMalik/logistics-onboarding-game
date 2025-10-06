import { NPCCar } from './NPCCar'

export function NPCCars() {
  // Definice tras pro různá auta - po silnicích
  // Silnice jsou na pozicích X=0, ±25, ±50, ±75 a Z=0, ±25, ±50, ±75

  // Auto 1: Jezdí po hlavní horizontální silnici (Z=0)
  const route1: [number, number, number][] = [
    [-90, 0, -1.5],
    [-60, 0, -1.5],
    [-30, 0, -1.5],
    [0, 0, -1.5],
    [30, 0, -1.5],
    [60, 0, -1.5],
    [90, 0, -1.5],
  ]

  // Auto 2: Jezdí po hlavní vertikální silnici (X=0)
  const route2: [number, number, number][] = [
    [1.5, 0, -90],
    [1.5, 0, -60],
    [1.5, 0, -30],
    [1.5, 0, 0],
    [1.5, 0, 30],
    [1.5, 0, 60],
    [1.5, 0, 90],
  ]

  // Auto 3: Jezdí po silnici X=25
  const route3: [number, number, number][] = [
    [26.5, 0, -75],
    [26.5, 0, -50],
    [26.5, 0, -25],
    [26.5, 0, 0],
    [26.5, 0, 25],
    [26.5, 0, 50],
    [26.5, 0, 75],
  ]

  // Auto 4: Jezdí po silnici Z=25
  const route4: [number, number, number][] = [
    [-75, 0, 26.5],
    [-50, 0, 26.5],
    [-25, 0, 26.5],
    [0, 0, 26.5],
    [25, 0, 26.5],
    [50, 0, 26.5],
    [75, 0, 26.5],
  ]

  // Auto 5: Jezdí po silnici X=-25
  const route5: [number, number, number][] = [
    [-23.5, 0, 75],
    [-23.5, 0, 50],
    [-23.5, 0, 25],
    [-23.5, 0, 0],
    [-23.5, 0, -25],
    [-23.5, 0, -50],
    [-23.5, 0, -75],
  ]

  // Auto 6: Jezdí po silnici Z=-25
  const route6: [number, number, number][] = [
    [75, 0, -23.5],
    [50, 0, -23.5],
    [25, 0, -23.5],
    [0, 0, -23.5],
    [-25, 0, -23.5],
    [-50, 0, -23.5],
    [-75, 0, -23.5],
  ]

  // Auto 7: Obdélníková trasa
  const route7: [number, number, number][] = [
    [1.5, 0, 26.5],
    [26.5, 0, 26.5],
    [26.5, 0, 1.5],
    [1.5, 0, 1.5],
  ]

  // Auto 8: Jiná obdélníková trasa
  const route8: [number, number, number][] = [
    [-1.5, 0, -23.5],
    [-23.5, 0, -23.5],
    [-23.5, 0, -1.5],
    [-1.5, 0, -1.5],
  ]

  // Auto 9: Jezdí po silnici X=50
  const route9: [number, number, number][] = [
    [51.5, 0, -55],
    [51.5, 0, -30],
    [51.5, 0, 0],
    [51.5, 0, 30],
    [51.5, 0, 55],
  ]

  // Auto 10: Jezdí po silnici Z=50
  const route10: [number, number, number][] = [
    [-55, 0, 51.5],
    [-30, 0, 51.5],
    [0, 0, 51.5],
    [30, 0, 51.5],
    [55, 0, 51.5],
  ]

  // Auto 11: Jezdí po silnici X=-50
  const route11: [number, number, number][] = [
    [-48.5, 0, 55],
    [-48.5, 0, 30],
    [-48.5, 0, 0],
    [-48.5, 0, -30],
    [-48.5, 0, -55],
  ]

  // Auto 12: Jezdí po silnici Z=-50
  const route12: [number, number, number][] = [
    [55, 0, -48.5],
    [30, 0, -48.5],
    [0, 0, -48.5],
    [-30, 0, -48.5],
    [-55, 0, -48.5],
  ]

  return (
    <group>
      <NPCCar route={route1} speed={10} color="#E74C3C" />
      <NPCCar route={route2} speed={8} color="#3498DB" />
      <NPCCar route={route3} speed={9} color="#2ECC71" />
      <NPCCar route={route4} speed={7} color="#F39C12" />
      <NPCCar route={route5} speed={8.5} color="#9B59B6" />
      <NPCCar route={route6} speed={11} color="#1ABC9C" />
      <NPCCar route={route7} speed={9} color="#E67E22" />
      <NPCCar route={route8} speed={8} color="#34495E" />
      <NPCCar route={route9} speed={10} color="#C0392B" />
      <NPCCar route={route10} speed={9.5} color="#27AE60" />
      <NPCCar route={route11} speed={8} color="#8E44AD" />
      <NPCCar route={route12} speed={10.5} color="#16A085" />
    </group>
  )
}

