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
      {/* Stromy */}
      <Tree position={[-8, 0, 5]} />
      <Tree position={[-10, 0, -3]} />
      <Tree position={[7, 0, -8]} />
      <Tree position={[9, 0, 3]} />
      <Tree position={[-15, 0, 12]} />
      <Tree position={[12, 0, 15]} />
      <Tree position={[-6, 0, -12]} />

      {/* Budovy */}
      <Building position={[-12, 0, -10]} width={3} height={4} depth={3} color="#F5E6D3" />
      <Building position={[10, 0, -15]} width={2.5} height={5} depth={2.5} color="#FFE4C4" />
      <Building position={[-18, 0, 8]} width={2} height={3} depth={2} color="#F8E8D8" />
      <Building position={[15, 0, 10]} width={3.5} height={3.5} depth={3} color="#F5DEB3" />

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

      {/* Kameny/dekorace */}
      {[
        [-5, 0.2, -5],
        [6, 0.15, 7],
        [-12, 0.25, 15],
        [14, 0.2, -10],
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

