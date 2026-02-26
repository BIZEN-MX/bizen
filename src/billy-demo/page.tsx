"use client"

import React, { useState } from 'react'
import TalkingCharacter from '@/components/TalkingCharacter'
import {
  AudioIcon,
  AssignmentIcon,
  GameIcon,
  EyeIcon,
  IdeaIcon,
  WarningIcon,
  BotIcon,
  PartyIcon,
  BookIcon,
  TrophyIcon
} from '@/components/CustomIcons'

export default function BillyDemoPage() {
  const [selectedDemo, setSelectedDemo] = useState<'text' | 'audio' | 'interactive'>('text')
  const [customText, setCustomText] = useState('¡Hola! Soy Billy, tu asistente de aprendizaje en BIZEN.')
  const [showCharacter, setShowCharacter] = useState(true)

  // Example audio URL - you can replace with your own
  const audioExample = '/audio/welcome.mp3' // Add your audio file here

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 40,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        background: 'white',
        borderRadius: 24,
        padding: 40,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <h1 style={{
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 900,
          marginBottom: 16,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <AudioIcon size={42} color="#667eea" /> Billy - Talking Character Demo
        </h1>

        <p style={{ fontSize: 18, color: '#666', marginBottom: 32 }}>
          Experimenta con diferentes modos de habla para Billy
        </p>

        {/* Demo Mode Selector */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 32,
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setSelectedDemo('text')}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              border: selectedDemo === 'text' ? '2px solid #667eea' : '2px solid #e5e7eb',
              background: selectedDemo === 'text' ? '#667eea' : 'white',
              color: selectedDemo === 'text' ? 'white' : '#374151',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <AssignmentIcon size={18} style={{ marginRight: 8 }} /> Text-to-Speech
          </button>

          <button
            onClick={() => setSelectedDemo('audio')}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              border: selectedDemo === 'audio' ? '2px solid #667eea' : '2px solid #e5e7eb',
              background: selectedDemo === 'audio' ? '#667eea' : 'white',
              color: selectedDemo === 'audio' ? 'white' : '#374151',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <AudioIcon size={18} style={{ marginRight: 8 }} /> Audio File
          </button>

          <button
            onClick={() => setSelectedDemo('interactive')}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              border: selectedDemo === 'interactive' ? '2px solid #667eea' : '2px solid #e5e7eb',
              background: selectedDemo === 'interactive' ? '#667eea' : 'white',
              color: selectedDemo === 'interactive' ? 'white' : '#374151',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <GameIcon size={18} style={{ marginRight: 8 }} /> Interactive
          </button>

          <button
            onClick={() => setShowCharacter(!showCharacter)}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              border: '2px solid #10B981',
              background: showCharacter ? '#10B981' : 'white',
              color: showCharacter ? 'white' : '#10B981',
              fontWeight: 700,
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            {showCharacter ? (
              <><EyeIcon size={18} style={{ marginRight: 8 }} /> Ocultar Billy</>
            ) : (
              <><EyeIcon size={18} style={{ marginRight: 8 }} /> Mostrar Billy</>
            )}
          </button>
        </div>

        {/* Demo Content */}
        <div style={{
          background: '#f9fafb',
          borderRadius: 16,
          padding: 32,
          minHeight: 300,
        }}>
          {selectedDemo === 'text' && (
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
                Text-to-Speech Demo
              </h2>
              <p style={{ color: '#666', marginBottom: 24 }}>
                Escribe cualquier texto y Billy lo dirá usando la voz del navegador.
              </p>

              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Escribe lo que Billy debe decir..."
                style={{
                  width: '100%',
                  minHeight: 120,
                  padding: 16,
                  borderRadius: 12,
                  border: '2px solid #e5e7eb',
                  fontSize: 16,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />

              <div style={{
                marginTop: 16,
                padding: 16,
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
              }}>
                <IdeaIcon size={18} style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: 8 }} /> <strong>Tip:</strong> Billy usará la voz predeterminada del navegador.
                Puedes cambiarla en la configuración de tu navegador.
              </div>

              {showCharacter && (
                <TalkingCharacter
                  textToSpeak={customText}
                  position="bottom-right"
                  width={250}
                  height={250}
                  showControls={true}
                  speechRate={1}
                  speechPitch={1}
                  draggable={true}
                  onStart={() => console.log('Billy empezó a hablar')}
                  onEnd={() => console.log('Billy terminó de hablar')}
                />
              )}
            </div>
          )}

          {selectedDemo === 'audio' && (
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
                Audio File Demo
              </h2>
              <p style={{ color: '#666', marginBottom: 24 }}>
                Billy sincroniza su boca con un archivo de audio real.
              </p>

              <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: 24,
                border: '1px solid #e5e7eb',
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
                  Para usar audio personalizado:
                </h3>
                <ol style={{ paddingLeft: 20, color: '#666', lineHeight: 1.8 }}>
                  <li>Coloca tu archivo de audio en <code>/public/audio/</code></li>
                  <li>Usa la ruta como: <code>/audio/tu-archivo.mp3</code></li>
                  <li>Billy detectará automáticamente el volumen y moverá su boca</li>
                </ol>
              </div>

              <div style={{
                marginTop: 24,
                padding: 16,
                background: '#FEF3C7',
                borderRadius: 12,
                border: '1px solid #FCD34D',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <WarningIcon size={24} color="#D97706" />
                <span>
                  <strong>Nota:</strong> Necesitas agregar archivos de audio en{' '}
                  <code>/public/audio/</code> para que este demo funcione.
                </span>
              </div>

              {showCharacter && (
                <TalkingCharacter
                  audioSrc={audioExample}
                  position="bottom-right"
                  width={250}
                  height={250}
                  showControls={true}
                  volumeThreshold={30}
                  draggable={true}
                  onStart={() => console.log('Audio iniciado')}
                  onEnd={() => console.log('Audio finalizado')}
                />
              )}
            </div>
          )}

          {selectedDemo === 'interactive' && (
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
                Interactive Demo
              </h2>
              <p style={{ color: '#666', marginBottom: 24 }}>
                Haz clic en los botones para que Billy diga diferentes cosas.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
              }}>
                {[
                  { text: '¡Hola! Bienvenido a BIZEN', icon: <BotIcon size={24} /> },
                  { text: '¡Excelente trabajo! Sigue así.', icon: <PartyIcon size={24} /> },
                  { text: 'Recuerda revisar tus lecciones.', icon: <BookIcon size={24} /> },
                  { text: '¿Necesitas ayuda? Estoy aquí para ti.', icon: <IdeaIcon size={24} /> },
                  { text: '¡Has completado este módulo!', icon: <TrophyIcon size={24} /> },
                  { text: 'Tómate un descanso, lo mereces.', icon: <IdeaIcon size={24} /> },
                ].map((item, idx) => (
                  <InteractiveButton
                    key={idx}
                    text={item.text}
                    icon={item.icon}
                  />
                ))}
              </div>

              {showCharacter && (
                <TalkingCharacter
                  position="bottom-right"
                  width={250}
                  height={250}
                  showControls={false}
                  draggable={true}
                />
              )}
            </div>
          )}
        </div>

        {/* Integration Examples */}
        <div style={{
          marginTop: 32,
          padding: 24,
          background: '#EFF6FF',
          borderRadius: 16,
          border: '1px solid #BFDBFE',
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
            📦 Cómo integrarlo en tu app
          </h3>
          <pre style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: 16,
            borderRadius: 12,
            overflow: 'auto',
            fontSize: 14,
            lineHeight: 1.6,
          }}>
            {`import TalkingCharacter from '@/components/TalkingCharacter'

// Uso básico con text-to-speech
<TalkingCharacter
  textToSpeak="¡Hola! Soy Billy"
  position="bottom-right"
  width={200}
  height={200}
/>

// Con audio personalizado
<TalkingCharacter
  audioSrc="/audio/welcome.mp3"
  position="bottom-left"
  draggable={true}
  onEnd={() => console.log('Terminó!')}
/>

// En el centro sin controles
<TalkingCharacter
  textToSpeak="Mensaje importante"
  position="center"
  showControls={false}
  autoPlay={true}
/>`}
          </pre>
        </div>
      </div>
    </div>
  )
}

// Interactive Button Component
function InteractiveButton({ text, icon }: { text: string; icon: React.ReactNode }) {
  const [key, setKey] = useState(0)

  const handleClick = () => {
    // Force re-render to trigger speech
    setKey(prev => prev + 1)
  }

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          padding: '16px',
          borderRadius: 12,
          border: '2px solid #e5e7eb',
          background: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: 16,
          fontWeight: 600,
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667eea' }}>{icon}</span>
        <span>{text}</span>
      </button>

      {key > 0 && (
        <TalkingCharacter
          key={key}
          textToSpeak={text}
          position="static"
          width={0}
          height={0}
          showControls={false}
          autoPlay={true}
        />
      )}
    </>
  )
}


