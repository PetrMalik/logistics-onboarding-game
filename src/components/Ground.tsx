export function Ground() {
  return (
    <group>
      {/* Hlavní podlaha - rozšířená na 200x200 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#7FB069" />
      </mesh>

      {/* Síť silnic mezi budovami */}
      {/* Hlavní horizontální silnice */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[200, 6]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      
      {/* Hlavní vertikální silnice */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[6, 200]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Horizontální silnice na Y=25 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 25]}>
        <planeGeometry args={[160, 6]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Horizontální silnice na Y=-25 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -25]}>
        <planeGeometry args={[160, 6]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Horizontální silnice na Y=50 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 50]}>
        <planeGeometry args={[120, 6]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Horizontální silnice na Y=-50 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -50]}>
        <planeGeometry args={[120, 6]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Vertikální silnice na X=25 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[25, 0.01, 0]}>
        <planeGeometry args={[6, 160]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Vertikální silnice na X=-25 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-25, 0.01, 0]}>
        <planeGeometry args={[6, 160]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Vertikální silnice na X=50 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[50, 0.01, 0]}>
        <planeGeometry args={[6, 120]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Vertikální silnice na X=-50 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-50, 0.01, 0]}>
        <planeGeometry args={[6, 120]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Silnice pro vzdálené budovy */}
      {/* Horizontální silnice na Y=75 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 75]}>
        <planeGeometry args={[80, 6]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Horizontální silnice na Y=-75 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -75]}>
        <planeGeometry args={[80, 6]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Vertikální silnice na X=75 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[75, 0.01, 0]}>
        <planeGeometry args={[6, 80]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Vertikální silnice na X=-75 */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-75, 0.01, 0]}>
        <planeGeometry args={[6, 80]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Bílé čáry na silnicích - středové čáry pro všechny silnice */}
      
      {/* Hlavní horizontální středová čára (Y=0) */}
      {[-90, -75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75, 90].map((x, i) => (
        <mesh
          key={`h-main-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.02, 0]}
        >
          <planeGeometry args={[3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Hlavní vertikální středová čára (X=0) */}
      {[-90, -75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75, 90].map((z, i) => (
        <mesh
          key={`v-main-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.02, z]}
        >
          <planeGeometry args={[0.3, 3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Středové čáry pro Y=25 */}
      {[-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75].map((x, i) => (
        <mesh
          key={`h-25-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.02, 25]}
        >
          <planeGeometry args={[3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Středové čáry pro Y=-25 */}
      {[-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75].map((x, i) => (
        <mesh
          key={`h-n25-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.02, -25]}
        >
          <planeGeometry args={[3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Středové čáry pro Y=50 */}
      {[-55, -40, -25, -10, 5, 20, 35, 55].map((x, i) => (
        <mesh
          key={`h-50-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.02, 50]}
        >
          <planeGeometry args={[3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Středové čáry pro Y=-50 */}
      {[-55, -40, -25, -10, 5, 20, 35, 55].map((x, i) => (
        <mesh
          key={`h-n50-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.02, -50]}
        >
          <planeGeometry args={[3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Středové čáry pro Y=75 */}
      {[-35, -20, -5, 10, 25, 35].map((x, i) => (
        <mesh
          key={`h-75-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.02, 75]}
        >
          <planeGeometry args={[3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Středové čáry pro Y=-75 */}
      {[-35, -20, -5, 10, 25, 35].map((x, i) => (
        <mesh
          key={`h-n75-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.02, -75]}
        >
          <planeGeometry args={[3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Vertikální středové čáry pro X=25 */}
      {[-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75].map((z, i) => (
        <mesh
          key={`v-25-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[25, 0.02, z]}
        >
          <planeGeometry args={[0.3, 3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Vertikální středové čáry pro X=-25 */}
      {[-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75].map((z, i) => (
        <mesh
          key={`v-n25-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-25, 0.02, z]}
        >
          <planeGeometry args={[0.3, 3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Vertikální středové čáry pro X=50 */}
      {[-55, -40, -25, -10, 5, 20, 35, 55].map((z, i) => (
        <mesh
          key={`v-50-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[50, 0.02, z]}
        >
          <planeGeometry args={[0.3, 3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Vertikální středové čáry pro X=-50 */}
      {[-55, -40, -25, -10, 5, 20, 35, 55].map((z, i) => (
        <mesh
          key={`v-n50-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-50, 0.02, z]}
        >
          <planeGeometry args={[0.3, 3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Vertikální středové čáry pro X=75 */}
      {[-35, -20, -5, 10, 25, 35].map((z, i) => (
        <mesh
          key={`v-75-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[75, 0.02, z]}
        >
          <planeGeometry args={[0.3, 3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Vertikální středové čáry pro X=-75 */}
      {[-35, -20, -5, 10, 25, 35].map((z, i) => (
        <mesh
          key={`v-n75-${i}`}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-75, 0.02, z]}
        >
          <planeGeometry args={[0.3, 3]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Mírné kopečky - vlnitý terén rozložený po větší ploše 200x200 */}
      <mesh receiveShadow position={[-40, -0.3, 30]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial color="#FFA76C" />
      </mesh>
      
      <mesh receiveShadow position={[50, -0.4, -40]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#FFA76C" />
      </mesh>

      <mesh receiveShadow position={[-60, -0.2, -50]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#FFAE78" />
      </mesh>

      <mesh receiveShadow position={[70, -0.3, 60]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial color="#FFA76C" />
      </mesh>

      <mesh receiveShadow position={[-50, -0.4, 70]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#FFAE78" />
      </mesh>

      <mesh receiveShadow position={[60, -0.2, -70]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#FFA76C" />
      </mesh>

      <mesh receiveShadow position={[-80, -0.3, 20]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial color="#FFAE78" />
      </mesh>

      <mesh receiveShadow position={[85, -0.4, -25]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#FFA76C" />
      </mesh>
      {/* Okrajové čáry silnic - bílé ohraničení */}
      {/* Hlavní horizontální silnice - okraje */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 3]}>
        <planeGeometry args={[200, 0.3]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, -3]}>
        <planeGeometry args={[200, 0.3]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Hlavní vertikální silnice - okraje */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[3, 0.015, 0]}>
        <planeGeometry args={[0.3, 200]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0.015, 0]}>
        <planeGeometry args={[0.3, 200]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  )
}

