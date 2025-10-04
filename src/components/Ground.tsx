export function Ground() {
  return (
    <group>
      {/* Hlavní podlaha */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#FFB88C" />
      </mesh>

      {/* Cesta */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[4, 50]} />
        <meshStandardMaterial color="#E89B6D" />
      </mesh>

      {/* Čáry na cestě */}
      {[-10, -5, 0, 5, 10, 15].map((z, i) => (
        <mesh
          key={i}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.02, z]}
        >
          <planeGeometry args={[0.3, 2]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.5} transparent />
        </mesh>
      ))}

      {/* Mírné kopečky - vlnitý terén */}
      <mesh receiveShadow position={[-10, -0.3, 8]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial color="#FFA76C" />
      </mesh>
      
      <mesh receiveShadow position={[12, -0.4, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#FFA76C" />
      </mesh>

      <mesh receiveShadow position={[-15, -0.2, -15]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#FFAE78" />
      </mesh>
    </group>
  )
}

