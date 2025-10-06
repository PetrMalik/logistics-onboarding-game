import { TrafficLight } from './TrafficLight'

export function TrafficLights() {
  // Semafory na hlavních křižovatkách
  // Silnice jsou na pozicích X=0, ±25, ±50, ±75 a Z=0, ±25, ±50, ±75
  
  return (
    <group>
      {/* Křižovatka [0, 0] - centrum */}
      <TrafficLight position={[4, 0, 4]} rotation={[0, Math.PI / 4, 0]} initialState="red" />
      <TrafficLight position={[-4, 0, 4]} rotation={[0, -Math.PI / 4, 0]} initialState="green" />
      <TrafficLight position={[-4, 0, -4]} rotation={[0, Math.PI / 4, 0]} initialState="red" />
      <TrafficLight position={[4, 0, -4]} rotation={[0, -Math.PI / 4, 0]} initialState="green" />

      {/* Křižovatka [0, 25] */}
      <TrafficLight position={[4, 0, 29]} rotation={[0, Math.PI / 4, 0]} initialState="green" />
      <TrafficLight position={[-4, 0, 29]} rotation={[0, -Math.PI / 4, 0]} initialState="red" />
      <TrafficLight position={[-4, 0, 21]} rotation={[0, Math.PI / 4, 0]} initialState="green" />
      <TrafficLight position={[4, 0, 21]} rotation={[0, -Math.PI / 4, 0]} initialState="red" />

      {/* Křižovatka [0, -25] */}
      <TrafficLight position={[4, 0, -21]} rotation={[0, Math.PI / 4, 0]} initialState="red" />
      <TrafficLight position={[-4, 0, -21]} rotation={[0, -Math.PI / 4, 0]} initialState="yellow" />
      <TrafficLight position={[-4, 0, -29]} rotation={[0, Math.PI / 4, 0]} initialState="red" />
      <TrafficLight position={[4, 0, -29]} rotation={[0, -Math.PI / 4, 0]} initialState="yellow" />

      {/* Křižovatka [25, 0] */}
      <TrafficLight position={[29, 0, 4]} rotation={[0, Math.PI / 4, 0]} initialState="yellow" />
      <TrafficLight position={[21, 0, 4]} rotation={[0, -Math.PI / 4, 0]} initialState="red" />
      <TrafficLight position={[21, 0, -4]} rotation={[0, Math.PI / 4, 0]} initialState="yellow" />
      <TrafficLight position={[29, 0, -4]} rotation={[0, -Math.PI / 4, 0]} initialState="red" />

      {/* Křižovatka [-25, 0] */}
      <TrafficLight position={[-21, 0, 4]} rotation={[0, Math.PI / 4, 0]} initialState="green" />
      <TrafficLight position={[-29, 0, 4]} rotation={[0, -Math.PI / 4, 0]} initialState="yellow" />
      <TrafficLight position={[-29, 0, -4]} rotation={[0, Math.PI / 4, 0]} initialState="green" />
      <TrafficLight position={[-21, 0, -4]} rotation={[0, -Math.PI / 4, 0]} initialState="yellow" />

      {/* Křižovatka [25, 25] */}
      <TrafficLight position={[29, 0, 29]} rotation={[0, Math.PI / 4, 0]} initialState="red" />
      <TrafficLight position={[21, 0, 29]} rotation={[0, -Math.PI / 4, 0]} initialState="green" />
      <TrafficLight position={[21, 0, 21]} rotation={[0, Math.PI / 4, 0]} initialState="red" />
      <TrafficLight position={[29, 0, 21]} rotation={[0, -Math.PI / 4, 0]} initialState="green" />

      {/* Křižovatka [-25, -25] */}
      <TrafficLight position={[-21, 0, -21]} rotation={[0, Math.PI / 4, 0]} initialState="green" />
      <TrafficLight position={[-29, 0, -21]} rotation={[0, -Math.PI / 4, 0]} initialState="red" />
      <TrafficLight position={[-29, 0, -29]} rotation={[0, Math.PI / 4, 0]} initialState="green" />
      <TrafficLight position={[-21, 0, -29]} rotation={[0, -Math.PI / 4, 0]} initialState="red" />

      {/* Křižovatka [50, 0] */}
      <TrafficLight position={[54, 0, 4]} rotation={[0, Math.PI / 4, 0]} initialState="yellow" />
      <TrafficLight position={[46, 0, 4]} rotation={[0, -Math.PI / 4, 0]} initialState="green" />
      <TrafficLight position={[46, 0, -4]} rotation={[0, Math.PI / 4, 0]} initialState="yellow" />
      <TrafficLight position={[54, 0, -4]} rotation={[0, -Math.PI / 4, 0]} initialState="green" />

      {/* Křižovatka [-50, 0] */}
      <TrafficLight position={[-46, 0, 4]} rotation={[0, Math.PI / 4, 0]} initialState="red" />
      <TrafficLight position={[-54, 0, 4]} rotation={[0, -Math.PI / 4, 0]} initialState="yellow" />
      <TrafficLight position={[-54, 0, -4]} rotation={[0, Math.PI / 4, 0]} initialState="red" />
      <TrafficLight position={[-46, 0, -4]} rotation={[0, -Math.PI / 4, 0]} initialState="yellow" />
    </group>
  )
}

