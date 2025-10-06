import { Pedestrian } from './Pedestrian'

export function Pedestrians() {
  // Definice tras pro různé chodce - vedle silnic (chodníky)
  // Silnice jsou na pozicích X=0, ±25, ±50, ±75 a Z=0, ±25, ±50, ±75
  // Chodníky jsou cca 4-5 jednotek od středu silnice

  // Chodec 1: Chodí podél hlavní horizontální silnice (Z=0) na severní straně
  const route1: [number, number, number][] = [
    [-40, 0, -5],
    [-20, 0, -5],
    [0, 0, -5],
    [20, 0, -5],
    [40, 0, -5],
    [20, 0, -5],
    [0, 0, -5],
    [-20, 0, -5],
  ]

  // Chodec 2: Chodí podél hlavní vertikální silnice (X=0) na západní straně
  const route2: [number, number, number][] = [
    [-5, 0, -30],
    [-5, 0, -10],
    [-5, 0, 10],
    [-5, 0, 30],
    [-5, 0, 10],
    [-5, 0, -10],
  ]

  // Chodec 3: Chodí podél silnice X=25 na východní straně
  const route3: [number, number, number][] = [
    [29, 0, -40],
    [29, 0, -20],
    [29, 0, 0],
    [29, 0, 20],
    [29, 0, 40],
    [29, 0, 20],
    [29, 0, 0],
    [29, 0, -20],
  ]

  // Chodec 4: Chodí podél silnice Z=25 na jižní straně
  const route4: [number, number, number][] = [
    [-50, 0, 29],
    [-30, 0, 29],
    [-10, 0, 29],
    [10, 0, 29],
    [30, 0, 29],
    [10, 0, 29],
    [-10, 0, 29],
    [-30, 0, 29],
  ]

  // Chodec 5: Chodí okolo bloku (obdélníková trasa)
  const route5: [number, number, number][] = [
    [5, 0, -29],
    [21, 0, -29],
    [21, 0, -5],
    [5, 0, -5],
  ]

  // Chodec 6: Chodí podél silnice X=-25 na západní straně
  const route6: [number, number, number][] = [
    [-29, 0, 30],
    [-29, 0, 10],
    [-29, 0, -10],
    [-29, 0, -30],
    [-29, 0, -10],
    [-29, 0, 10],
  ]

  // Chodec 7: Chodí podél silnice Z=-25 na severní straně
  const route7: [number, number, number][] = [
    [40, 0, -29],
    [20, 0, -29],
    [0, 0, -29],
    [-20, 0, -29],
    [-40, 0, -29],
    [-20, 0, -29],
    [0, 0, -29],
    [20, 0, -29],
  ]

  // Chodec 8: Chodí okolo jiného bloku
  const route8: [number, number, number][] = [
    [-21, 0, 5],
    [-21, 0, 21],
    [-5, 0, 21],
    [-5, 0, 5],
  ]

  return (
    <group>
      <Pedestrian route={route1} speed={1.5} color="#4A90E2" />
      <Pedestrian route={route2} speed={1.2} color="#E74C3C" />
      <Pedestrian route={route3} speed={1.8} color="#2ECC71" />
      <Pedestrian route={route4} speed={1.3} color="#F39C12" />
      <Pedestrian route={route5} speed={1.6} color="#9B59B6" />
      <Pedestrian route={route6} speed={1.4} color="#1ABC9C" />
      <Pedestrian route={route7} speed={1.7} color="#34495E" />
      <Pedestrian route={route8} speed={1.5} color="#E67E22" />
    </group>
  )
}



