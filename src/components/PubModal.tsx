interface PubModalProps {
  onRestart: () => void
}

export function PubModal({ onRestart }: PubModalProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #8B4513, #A0522D)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '600px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        color: 'white',
        border: '3px solid #FFD700'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🍺</div>
        
        <h2 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '32px', 
          color: '#FFD700',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Hospoda "U Žíznivé Pošty"
        </h2>
        
        <div style={{ 
          fontSize: '18px', 
          lineHeight: '1.6', 
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <p style={{ marginBottom: '15px' }}>
            🍻 <strong>Projel jsi kolem hospody "U Žíznivé Pošty"!</strong>
          </p>
          <p style={{ marginBottom: '15px' }}>
            Vůně chlazeného piva a smích hostů tě přilákaly dovnitř. 
            Nemohl jsi odolat a zastavil ses na <em>"jen jedno rychlé pivko"</em>...
          </p>
          <p style={{ marginBottom: '15px' }}>
            Ale jak to bývá, jedno se stalo dvě, dvě tři... 🍺🍺🍺
            Než ses nadál, bylo už pozdě večer!
          </p>
          <p style={{ 
            color: '#FF6B6B', 
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '20px',
            margin: '20px 0'
          }}>
            🚫 Nemůžeš pokračovat v řízení! 🚫
          </p>
          <p style={{ textAlign: 'center', color: '#FFD700' }}>
            Musíš si zavolat náhradního řidiče a začít celou rozvozovou trasu znovu...
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: '20px' 
        }}>
          <div style={{ fontSize: '32px', margin: '0 10px' }}>🍺</div>
          <div style={{ fontSize: '32px', margin: '0 10px' }}>🚗</div>
          <div style={{ fontSize: '32px', margin: '0 10px' }}>❌</div>
        </div>
        
        <button 
          onClick={onRestart}
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#8B4513',
            border: 'none',
            padding: '15px 40px',
            borderRadius: '12px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 5px 15px rgba(255, 215, 0, 0.3)',
            textTransform: 'uppercase'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 5px 15px rgba(255, 215, 0, 0.3)'
          }}
        >
          🚕 Zavolat náhradního řidiče
        </button>
        
        <div style={{ 
          marginTop: '15px', 
          fontSize: '14px', 
          color: '#CCCCCC',
          fontStyle: 'italic'
        }}>
          Příště si dej pozor na hospody na trase! 😉
        </div>
      </div>
    </div>
  )
}