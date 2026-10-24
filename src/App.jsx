import { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { config as c } from './config.js'
import { supabase } from './utils/supabase.js'

function Foto({ src, alt, rot = '0deg', pie }) {
  const [ok, setOk] = useState(true)
  return (
    <figure className="polaroid" style={{ '--rot': rot }}>
      {ok ? <img src={src} alt={alt} onError={() => setOk(false)} /> : <div className="hueco">Tu foto aquí</div>}
      {pie && <figcaption>{pie}</figcaption>}
    </figure>
  )
}

function Corazones() {
  const items = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 4, dur: 5 + Math.random() * 4, size: 0.9 + Math.random() * 1.2, i,
  })), [])
  return (
    <div className="corazones" aria-hidden="true">
      {items.map((h) => (
        <span key={h.i} style={{ left: `${h.left}%`, animationDelay: `${h.delay}s`, animationDuration: `${h.dur}s`, fontSize: `${h.size}rem` }}>♥</span>
      ))}
    </div>
  )
}

function Volver({ onClick }) {
  return (
    <button className="volver" onClick={onClick} aria-label="Volver a la página anterior">
      <ArrowLeft size={20} strokeWidth={2.25} aria-hidden="true" />
      <span>Volver</span>
    </button>
  )
}

export default function App() {
  const [etapa, setEtapa] = useState('sobre') // sobre | carta | propuesta | si | no
  const [abierto, setAbierto] = useState(false)
  const [guardandoRespuesta, setGuardandoRespuesta] = useState(false)
  const [errorRespuesta, setErrorRespuesta] = useState('')

  const abrir = () => {
    if (abierto) return
    setAbierto(true)
    setTimeout(() => setEtapa('carta'), 1500)
  }

  const volverAlSobre = () => {
    setAbierto(false)
    setEtapa('sobre')
  }

  const guardarRespuesta = async (respuesta) => {
    setGuardandoRespuesta(true)
    setErrorRespuesta('')

    const { error } = await supabase
      .from('respuestas')
      .insert({ respuesta })

    setGuardandoRespuesta(false)

    if (error) {
      setErrorRespuesta('No pudimos guardar tu respuesta. Inténtalo de nuevo.')
      return
    }

    setEtapa(respuesta === 'acepto' ? 'si' : 'no')
  }

  return (
    <main className="cielo">
      {etapa === 'sobre' && (
        <section className="escena sobre-escena" key="sobre">
          <button className={`sobre ${abierto ? 'abierto' : ''}`} onClick={abrir} aria-label="Abrir el sobre">
            <span className="fondo" />
            <span className="mini" />
            <span className="frente" />
            <span className="tapa" />
            <span className="sello">♥</span>
          </button>
          <p className="pista">Para {c.madrina}. Toca el sobre</p>
        </section>
      )}

      {etapa === 'carta' && (
        <section className="escena papel" key="carta">
          <Volver onClick={volverAlSobre} />
          <Foto src={c.fotos.cielo} alt="Madrina y ahijada en un cielo azul" rot="-2deg" />
          <h1 className="titulo">¡Feliz cumpleaños, {c.madrina}!</h1>
          {c.felicitacion.map((t, i) => <p key={i}>{t}</p>)}
          <p className="firma">Con todo mi cariño,<br /><span>{c.yo}</span></p>
          <button className="boton" onClick={() => setEtapa('propuesta')}>Y quiero contarte algo</button>
        </section>
      )}

      {etapa === 'propuesta' && (
        <section className="escena papel" key="propuesta">
          <Volver onClick={() => setEtapa('carta')} />
          <div className="fotos">
            <Foto src={c.fotos.bautizo} alt="Foto del bautizo" rot="-3deg" />
            
          </div>
          <h1 className="titulo">{c.madrina}, ¡me caso!</h1>
          {c.propuesta.map((t, i) => <p key={i}>{t}</p>)}
          <p className="pregunta">{c.pregunta}</p>
          <p className="aviso-respuesta">Al elegir una opción, tu respuesta quedará registrada.</p>
          <div className="opciones">
            <button className="boton" onClick={() => guardarRespuesta('acepto')} disabled={guardandoRespuesta}>
              {guardandoRespuesta ? 'Guardando...' : 'Sí, acepto ♥'}
            </button>
            <button className="boton secundario" onClick={() => guardarRespuesta('no_acepto')} disabled={guardandoRespuesta}>
              No acepto
            </button>
          </div>
          {errorRespuesta && <p className="error-respuesta" role="alert">{errorRespuesta}</p>}
        </section>
      )}

      {etapa === 'no' && (
        <section className="escena papel" key="no">
          <Volver onClick={() => setEtapa('propuesta')} />
          <h1 className="titulo">Gracias, madrina</h1>
          <p>Gracias por leerme y por todo lo que has hecho por mí.</p>
          <p>Entiendo y respeto tu decisión. Te quiero mucho.</p>
        </section>
      )}

      {etapa === 'si' && (
        <section className="escena papel" key="si">
          <Volver onClick={() => setEtapa('propuesta')} />
          <Corazones />
          <h1 className="titulo">¡Gracias, madrina!</h1>
          <p>Me haces muy feliz. Contigo a mi lado, ese día será todavía más bonito.</p>
          {c.whatsapp && (
            <a className="boton" target="_blank" rel="noopener noreferrer"
               href={`https://wa.me/${c.whatsapp}?text=${encodeURIComponent('¡Sí acepto, mi niña! ♥')}`}>
              Avisarle a {c.yo}
            </a>
          )}
        </section>
      )}
    </main>
  )
}
