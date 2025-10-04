import * as THREE from 'three'

// Strom komponenta
function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Kmen */}
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
        <meshStandardMaterial color="#8B6F47" />
      </mesh>
      
      {/* Koruna - vrstva 1 */}
      <mesh castShadow position={[0, 2.5, 0]}>
        <coneGeometry args={[1.5, 2, 8]} />
        <meshStandardMaterial color="#B8D96A" />
      </mesh>
      
      {/* Koruna - vrstva 2 */}
      <mesh castShadow position={[0, 3.5, 0]}>
        <coneGeometry args={[1.2, 1.5, 8]} />
        <meshStandardMaterial color="#C4E072" />
      </mesh>
      
      {/* Koruna - vrstva 3 */}
      <mesh castShadow position={[0, 4.3, 0]}>
        <coneGeometry args={[0.8, 1, 8]} />
        <meshStandardMaterial color="#D0E87E" />
      </mesh>
    </group>
  )
}

// Budova komponenta
function Building({ 
  position, 
  width = 2, 
  height = 3, 
  depth = 2, 
  color = "#F5E6D3" 
}: { 
  position: [number, number, number]
  width?: number
  height?: number
  depth?: number
  color?: string
}) {
  return (
    <group position={position}>
      {/* Hlavní budova */}
      <mesh castShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Střecha */}
      <mesh castShadow position={[0, height + 0.3, 0]}>
        <coneGeometry args={[width * 0.7, 0.8, 4]} />
        <meshStandardMaterial color="#D4A574" />
      </mesh>
      
      {/* Okna */}
      {[0.5, 1.5, 2.5].map((y, i) => 
        y < height && (
          <group key={i}>
            <mesh position={[width / 3, y, depth / 2 + 0.01]}>
              <boxGeometry args={[0.4, 0.4, 0.02]} />
              <meshStandardMaterial color="#87CEEB" />
            </mesh>
            <mesh position={[-width / 3, y, depth / 2 + 0.01]}>
              <boxGeometry args={[0.4, 0.4, 0.02]} />
              <meshStandardMaterial color="#87CEEB" />
            </mesh>
          </group>
        )
      )}
    </group>
  )
}

// Oblak komponenta
function Cloud({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
      </mesh>
      <mesh position={[0.7, 0.1, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
      </mesh>
      <mesh position={[-0.6, 0, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
      </mesh>
      <mesh position={[0.2, 0.3, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
      </mesh>
    </group>
  )
}

// Checklist element (inspirace z obrázku)
function ChecklistItem({ 
  position, 
  checked = false 
}: { 
  position: [number, number, number]
  checked?: boolean 
}) {
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Checkbox */}
      <mesh>
        <boxGeometry args={[0.4, 0.4, 0.05]} />
        <meshStandardMaterial color={checked ? "#6BCF7F" : "#FFFFFF"} />
      </mesh>
      
      {/* Čárka pokud checked */}
      {checked && (
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.3, 0.05, 0.02]} />
          <meshStandardMaterial color="#2D5F3D" />
        </mesh>
      )}
      
      {/* Řádek textu */}
      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[1.5, 0.15, 0.05]} />
        <meshStandardMaterial color="#E89B6D" />
      </mesh>
    </group>
  )
}

export function Environment() {
  return (
    <group>
      {/* Stromy - rozšířené rozmístění po celé ploše 200x200 */}
      <Tree position={[-8, 0, 5]} />
      <Tree position={[-10, 0, -3]} />
      <Tree position={[7, 0, -8]} />
      <Tree position={[9, 0, 3]} />
      <Tree position={[-15, 0, 12]} />
      <Tree position={[12, 0, 15]} />
      <Tree position={[-6, 0, -12]} />
      {/* Původní rozšířené stromy */}
      <Tree position={[-25, 0, 20]} />
      <Tree position={[-30, 0, -15]} />
      <Tree position={[-35, 0, 5]} />
      <Tree position={[-20, 0, -25]} />
      <Tree position={[-40, 0, 30]} />
      <Tree position={[25, 0, -20]} />
      <Tree position={[30, 0, 10]} />
      <Tree position={[35, 0, -5]} />
      <Tree position={[20, 0, 25]} />
      <Tree position={[40, 0, -30]} />
      <Tree position={[-18, 0, 40]} />
      <Tree position={[18, 0, -40]} />
      <Tree position={[-45, 0, -10]} />
      <Tree position={[45, 0, 15]} />
      <Tree position={[28, 0, 35]} />
      <Tree position={[-28, 0, -35]} />
      <Tree position={[38, 0, 20]} />
      <Tree position={[-38, 0, -20]} />
      <Tree position={[15, 0, 45]} />
      <Tree position={[-15, 0, -45]} />
      {/* Nové stromy pro mapu 200x200 */}
      <Tree position={[-60, 0, 40]} />
      <Tree position={[-70, 0, -30]} />
      <Tree position={[-80, 0, 10]} />
      <Tree position={[-50, 0, -60]} />
      <Tree position={[-90, 0, 70]} />
      <Tree position={[60, 0, -50]} />
      <Tree position={[70, 0, 25]} />
      <Tree position={[80, 0, -15]} />
      <Tree position={[50, 0, 65]} />
      <Tree position={[90, 0, -70]} />
      <Tree position={[-55, 0, 85]} />
      <Tree position={[55, 0, -85]} />
      <Tree position={[-95, 0, -25]} />
      <Tree position={[95, 0, 35]} />
      <Tree position={[65, 0, 80]} />
      <Tree position={[-65, 0, -80]} />
      <Tree position={[85, 0, 45]} />
      <Tree position={[-85, 0, -45]} />
      <Tree position={[35, 0, 95]} />
      <Tree position={[-35, 0, -95]} />
      <Tree position={[75, 0, -75]} />
      <Tree position={[-75, 0, 75]} />
      <Tree position={[25, 0, -90]} />
      <Tree position={[-25, 0, 90]} />
      <Tree position={[90, 0, 5]} />
      <Tree position={[-90, 0, -5]} />

      {/* Budovy - rozšířené rozmístění po celé ploše 200x200 */}
      <Building position={[-12, 0, -10]} width={3} height={4} depth={3} color="#F5E6D3" />
      <Building position={[10, 0, -15]} width={2.5} height={5} depth={2.5} color="#FFE4C4" />
      <Building position={[-18, 0, 8]} width={2} height={3} depth={2} color="#F8E8D8" />
      <Building position={[15, 0, 10]} width={3.5} height={3.5} depth={3} color="#F5DEB3" />
      {/* Původní rozšířené budovy */}
      <Building position={[-25, 0, -20]} width={2.8} height={4.2} depth={2.8} color="#FFF8DC" />
      <Building position={[28, 0, -25]} width={3.2} height={3.8} depth={3.2} color="#F5E6D3" />
      <Building position={[-35, 0, 15]} width={2.2} height={4.5} depth={2.2} color="#FFE4C4" />
      <Building position={[32, 0, 18]} width={3.8} height={3.2} depth={3.8} color="#F8E8D8" />
      <Building position={[-28, 0, -35]} width={2.5} height={5.2} depth={2.5} color="#F5DEB3" />
      <Building position={[35, 0, -35]} width={3.0} height={4.0} depth={3.0} color="#FFF8DC" />
      <Building position={[-40, 0, 25]} width={2.3} height={3.8} depth={2.3} color="#F5E6D3" />
      <Building position={[38, 0, 28]} width={3.5} height={4.2} depth={3.5} color="#FFE4C4" />
      <Building position={[-32, 0, 40]} width={2.7} height={3.5} depth={2.7} color="#F8E8D8" />
      <Building position={[25, 0, 42]} width={3.3} height={4.8} depth={3.3} color="#F5DEB3" />
      <Building position={[-45, 0, -12]} width={2.4} height={3.6} depth={2.4} color="#FFF8DC" />
      <Building position={[42, 0, -18]} width={3.6} height={4.4} depth={3.6} color="#F5E6D3" />
      <Building position={[20, 0, -42]} width={2.6} height={5.0} depth={2.6} color="#FFE4C4" />
      <Building position={[-22, 0, 45]} width={3.1} height={3.3} depth={3.1} color="#F8E8D8" />
      {/* Nové budovy pro mapu 200x200 */}
      <Building position={[-60, 0, -45]} width={3.4} height={4.6} depth={3.4} color="#F5E6D3" />
      <Building position={[65, 0, -55]} width={2.9} height={5.1} depth={2.9} color="#FFE4C4" />
      <Building position={[-75, 0, 30]} width={2.7} height={3.9} depth={2.7} color="#F8E8D8" />
      <Building position={[70, 0, 35]} width={4.0} height={4.3} depth={4.0} color="#F5DEB3" />
      <Building position={[-55, 0, -70]} width={3.1} height={5.5} depth={3.1} color="#FFF8DC" />
      <Building position={[80, 0, -75]} width={3.6} height={4.1} depth={3.6} color="#F5E6D3" />
      <Building position={[-85, 0, 50]} width={2.8} height={4.7} depth={2.8} color="#FFE4C4" />
      <Building position={[75, 0, 55]} width={3.9} height={3.7} depth={3.9} color="#F8E8D8" />
      <Building position={[-70, 0, 80]} width={3.2} height={5.3} depth={3.2} color="#F5DEB3" />
      <Building position={[85, 0, 85]} width={3.7} height={4.9} depth={3.7} color="#FFF8DC" />
      <Building position={[-90, 0, -30]} width={2.5} height={4.2} depth={2.5} color="#F5E6D3" />
      <Building position={[90, 0, -35]} width={4.1} height={3.8} depth={4.1} color="#FFE4C4" />
      <Building position={[45, 0, 90]} width={3.3} height={5.4} depth={3.3} color="#F8E8D8" />
      <Building position={[-50, 0, 85]} width={2.6} height={4.4} depth={2.6} color="#F5DEB3" />
      <Building position={[95, 0, -15]} width={3.8} height={4.8} depth={3.8} color="#FFF8DC" />
      <Building position={[-95, 0, 20]} width={3.0} height={3.6} depth={3.0} color="#F5E6D3" />

      {/* Oblaka */}
      <Cloud position={[-5, 12, 8]} />
      <Cloud position={[8, 11, -5]} />
      <Cloud position={[0, 13, 15]} />
      <Cloud position={[-12, 10, -8]} />
      <Cloud position={[15, 12, 5]} />

      {/* Checklist položky (jako na obrázku) */}
      <group position={[8, 0.05, 8]}>
        <ChecklistItem position={[0, 0, 0]} checked={true} />
        <ChecklistItem position={[0, 0, -0.8]} checked={true} />
        <ChecklistItem position={[0, 0, -1.6]} checked={false} />
        <ChecklistItem position={[0, 0, -2.4]} checked={false} />
      </group>

      {/* Kameny/dekorace - rozšířené po větší ploše 200x200 */}
      {[
        [-5, 0.2, -5],
        [6, 0.15, 7],
        [-12, 0.25, 15],
        [14, 0.2, -10],
        [-25, 0.18, 25],
        [30, 0.22, -30],
        [-35, 0.15, -8],
        [22, 0.25, 35],
        [-40, 0.2, -25],
        [40, 0.18, 12],
        [-18, 0.22, -40],
        [33, 0.15, 33],
        [-33, 0.2, 8],
        [45, 0.25, -15],
        [-8, 0.18, 45],
        [-60, 0.2, 50],
        [65, 0.15, -60],
        [-75, 0.25, -35],
        [55, 0.18, 70],
        [-85, 0.22, -55],
        [80, 0.15, 25],
        [-50, 0.2, -75],
        [70, 0.25, 65],
        [-90, 0.18, 15],
        [95, 0.22, -45],
        [-45, 0.15, 90],
        [85, 0.2, -85],
        [-75, 0.25, 80],
        [90, 0.18, 40],
        [-95, 0.22, -20],
      ].map((pos, i) => (
        <mesh 
          key={i} 
          castShadow 
          position={new THREE.Vector3(...pos as [number, number, number])}
          rotation={[Math.random(), Math.random(), Math.random()]}
        >
          <boxGeometry args={[0.5, 0.4, 0.5]} />
          <meshStandardMaterial color="#C4A884" />
        </mesh>
      ))}
    </group>
  )
}

