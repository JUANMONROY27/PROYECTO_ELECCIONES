import { useState, useCallback } from 'react';
import usuariosGelsa from '../data/usuarios_gelsa.json';

import cepedaImg from '../Images/4_Cepeda.jpg';
import cepedaImgGrande from '../Images/4_Cepeda1.jpg';
import aidaImg from '../Images/4_Aida.jpg';
import espriellaImg from '../Images/4_Abelardo.jpg';
import espriellaImgGrande from '../Images/4_Abelardo.jpg';
import restrepoImg from '../Images/4_JoseManuelRestrepo.jpg';

// ─── Datos de candidatos ───
const CANDIDATOS = {
  cepeda: {
    id: 'cepeda',
    nombre: 'Iván Cepeda Castro',
    nombreCorto: 'Iván Cepeda',
    partido: 'Pacto Histórico',
    vp: 'Aída Quilcué',
    iniciales: 'IC',
    vpIniciales: 'AQ',
    foto: cepedaImg,
    fotoGrande: cepedaImgGrande,
    vpFoto: aidaImg,
  },
  espriella: {
    id: 'espriella',
    nombre: 'Abelardo de la Espriella',
    nombreCorto: 'Abelardo de la Espriella',
    partido: 'Defensores de la Patria',
    vp: 'José Manuel Restrepo',
    iniciales: 'AE',
    vpIniciales: 'JR',
    foto: espriellaImg,
    fotoGrande: espriellaImgGrande,
    vpFoto: restrepoImg,
  },
};

// Diccionario de puntos por localidad/municipio
const PUNTOS_BOGOTA = {
  Suba: ['Punto 1', 'Punto 2'],
  Kennedy: ['Punto 3', 'Punto 4'],
  Usaquén: ['Punto 5', 'Punto 6'],
  Chapinero: ['Punto 7', 'Punto 8'],
  Engativá: ['Punto 9', 'Punto 10'],
};

const PUNTOS_CUNDINAMARCA = {
  Soacha: ['Punto A', 'Punto B'],
  Zipaquirá: ['Punto C', 'Punto D'],
  Facatativá: ['Punto E', 'Punto F'],
  Chía: ['Punto G', 'Punto H'],
};

const TOTAL_STEPS = 9;

// ─── Componente de imagen con fallback ───
function ImgFallback({ src, alt, initials, className, style }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className={`formula-photo-fallback ${className || ''}`} style={{ display: 'flex', ...style }}>
        {initials}
      </div>
    );
  }
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      style={style}
      onError={() => setError(true)}
    />
  );
}

export default function EncuestaSegundaVuelta() {
  const [step, setStep] = useState(0);

  // ─── Estado del formulario ───
  const [formData, setFormData] = useState({
    // Paso 0
    consent: '',
    // Paso 1
    edad: '',
    votaria: '',
    // Paso 2
    conoce_formula: [],
    imp_vp: '',
    // Paso 3
    pref_presidente: '',
    // Paso 4
    conoce_cepeda: '',
    fav_cepeda: '',
    voto_cepeda: '',
    conoce_espriella: '',
    fav_espriella: '',
    voto_espriella: '',
    // Paso 5
    tema_importante: '',
    gestion_gobierno: '',
    // Paso 6
    genero: '',
    estrato: '',
    nivel_educativo: '',
    // Paso 7
    territorio: '',
    localidad: '',
    punto: '',
    // Paso 8
    nombre_sorteo: '',
    cedula_sorteo: '',
    celular_sorteo: '',
    email_sorteo: '',
  });

  // ─── Estado para alerta de consentimiento ───
  const [showConsentAlert, setShowConsentAlert] = useState(false);
  const [showGelsaAlert, setShowGelsaAlert] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'territorio' && { localidad: '', punto: '' }),
      ...(name === 'localidad' && { point: '' }),
    }));
    // Show alert when consent is 'no'
    if (name === 'consent') {
      setShowConsentAlert(value === 'no');
    }
    // Show alert when cedula matches gelsa users
    if (name === 'cedula_sorteo') {
      const isGelsa = usuariosGelsa.includes(String(value).trim());
      if (isGelsa) {
        setShowGelsaAlert(true);
      }
    }
  }, []);

  const toggleCheckbox = useCallback((name, value) => {
    setFormData((prev) => {
      const arr = prev[name] || [];
      const exists = arr.includes(value);
      return {
        ...prev,
        [name]: exists ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }, []);

  const setScale = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // ─── Navegación ───
  const nextStep = () => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  const prevStep = () => setStep((s) => Math.max(0, s - 1));
  const goToStep = (s) => setStep(s);

  const progressPct = step === 0 ? 0 : Math.round((step / (TOTAL_STEPS - 1)) * 100);

  // ─── Envío final ───
  const handleSubmit = () => {
    // Validación Gelsa
    const cedula = String(formData.cedula_sorteo).trim();
    if (cedula && usuariosGelsa.includes(cedula)) {
      setShowGelsaAlert(true);
      return;
    }

    console.log('Datos listos para enviar al backend:', formData);
    setStep(TOTAL_STEPS); // Pantalla de agradecimiento
  };

  // ─── Stepper labels ───
  const stepLabels = [
    'Consentimiento',
    'Participación',
    'Conocimiento',
    'Preferencias',
    'Candidatos',
    'Actualidad',
    'Demográficos',
    'Ubicación',
    'Sorteo',
  ];

  const puntos = formData.territorio === 'bogota' ? PUNTOS_BOGOTA : PUNTOS_CUNDINAMARCA;

  return (
    <>
      {/* ── HEADER MARCA ── */}
      <div className="brand-bar">
        <div className="brand-logo">GELSA</div>
        <span className="brand-tag">Grupo Empresarial en Línea · Oficina Inteligencia de Negocios</span>
      </div>

      <div className="card">
        {/* ── PROGRESS ── */}
        <div className="progress-strip">
          <div className="progress-label">
            <span>Progreso de la encuesta</span>
            <strong>{progressPct}%</strong>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* ── STEPPER ── */}
        <div className="stepper" id="stepper">
          {stepLabels.map((label, i) => (
            <div
              key={i}
              className={`step-tab ${step === i ? 'active' : ''} ${step > i ? 'done' : ''}`}
              onClick={() => step > i && goToStep(i)}
            >
              <div className="step-num">{i + 1}</div>
              {label}
            </div>
          ))}
        </div>

        {/* ── BODY ── */}
        <div className="form-body">

          {/* ═══════════ PASO 0: CONSENTIMIENTO ═══════════ */}
          {step === 0 && (
            <div className="step-panel active" id="step-0">
              <div className="section-title">Acuerdo de confidencialidad</div>
              <div className="consent-box">
                <h3>Tratamiento de datos personales</h3>
                <p>
                  GRUPO EMPRESARIAL EN LÍNEA S.A, identificado con NIT 830.111.257-3, en cumplimiento de las
                  disposiciones legales de la Ley 1581 de 2012 y demás normas que regulan la materia,{' '}
                  <strong>solicita su autorización</strong> para recopilar, almacenar, archivar, copiar, analizar,
                  usar y consultar los datos personales recolectados en la siguiente encuesta para:
                </p>
                <br />
                <p>• Realizar acciones de investigación y tendencias del mercado, prospectiva y analítica estadística.</p>
                <p>• Contactar a través de correo electrónico para realizar entrega de incentivos, promocionales, cupones o premios.</p>
                <p>• Contactar a través de medios telefónicos para verificar encuesta, estudio y/o confirmación de datos personales necesarios.</p>
                <br />
                <p>
                  Los datos recolectados serán almacenados y tratados conforme a lo establecido en la Ley 1581 de 2012.
                  Canales de contacto: <strong>tratamiento.datos@gelsa.com.co</strong> · PBX (601) 3788890.
                </p>
              </div>

              {/* Consent alert modal */}
              {showConsentAlert && (
                <div className="consent-modal-overlay" onClick={() => setShowConsentAlert(false)}>
                  <div className="consent-modal" onClick={e => e.stopPropagation()}>
                    <button className="consent-modal-close" onClick={() => setShowConsentAlert(false)} aria-label="Cerrar">
                      ✕
                    </button>
                    <div className="consent-modal-icon">🚫</div>
                    <h3 className="consent-modal-title">Consentimiento requerido</h3>
                    <div className="consent-modal-divider"></div>
                    <p className="consent-modal-text">
                      Para continuar con la encuesta, es necesario que autorice el tratamiento de sus datos personales
                      conforme a la Ley 1581 de 2012.
                    </p>
                    <button className="consent-modal-btn" onClick={() => setShowConsentAlert(false)}>
                      Entendido
                    </button>
                  </div>
                </div>
              )}

              {/* Gelsa user alert modal */}
              {showGelsaAlert && (
                <div className="consent-modal-overlay" onClick={() => setShowGelsaAlert(false)}>
                  <div className="consent-modal" onClick={e => e.stopPropagation()}>
                    <button className="consent-modal-close" onClick={() => setShowGelsaAlert(false)} aria-label="Cerrar">
                      ✕
                    </button>
                    <div className="consent-modal-icon">⚠️</div>
                    <h3 className="consent-modal-title">Atención</h3>
                    <div className="consent-modal-divider"></div>
                    <p className="consent-modal-text">
                      Usuario de Gelsa no es posible enviar la encuesta.
                    </p>
                    <button className="consent-modal-btn" onClick={() => setShowGelsaAlert(false)}>
                      Entendido
                    </button>
                  </div>
                </div>
              )}

              <div className="question">
                <div className="question-label">
                  <span className="q-num">1</span>
                  <span>
                    Autorizo de manera voluntaria, previa, explícita e informada a GELSA S.A para tratar mis datos
                    personales <span className="required-star">*</span>
                  </span>
                </div>
                <div className="options-list">
                  <label className={`opt-row ${formData.consent === 'si' ? 'selected' : ''}`}>
                    <input type="radio" name="consent" value="si" onChange={handleChange} />
                    <div className="opt-circle" />
                    <span className="opt-text">Sí, autorizo el tratamiento de mis datos</span>
                  </label>
                  <label className={`opt-row ${formData.consent === 'no' ? 'selected' : ''}`}>
                    <input type="radio" name="consent" value="no" onChange={handleChange} />
                    <div className="opt-circle" />
                    <span className="opt-text">No autorizo</span>
                  </label>
                </div>
              </div>

              <div className="btn-row">
                <span></span>
                <button className="btn btn-primary" onClick={nextStep} disabled={formData.consent !== 'si'}>
                  Continuar <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* ═══════════ PASO 1: PARTICIPACIÓN + EDAD ═══════════ */}
          {step === 1 && (
            <div className="step-panel active" id="step-1">
              <div className="section-title">Información básica</div>

              <div className="question">
                <div className="question-label">
                  <span className="q-num">2</span>
                  <span>¿En cuál de los siguientes rangos se encuentra su edad? <span className="required-star">*</span></span>
                </div>
                <div className="options-list">
                  {['Menor de 18 años', 'De 18 a 23 años', 'De 24 a 30 años', 'De 31 a 37 años', 'De 38 a 44 años', 'De 45 a 51 años', 'Más de 51 años'].map((label, i) => {
                    const vals = ['menor18', '18-23', '24-30', '31-37', '38-44', '45-51', 'mas51'];
                    return (
                      <label key={vals[i]} className={`opt-row ${formData.edad === vals[i] ? 'selected' : ''}`}>
                        <input type="radio" name="edad" value={vals[i]} onChange={handleChange} />
                        <div className="opt-circle" />
                        <span className="opt-text">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="question">
                <div className="question-label">
                  <span className="q-num">3</span>
                  <span>
                    Si las elecciones de 2da vuelta para elegir el presidente de Colombia fueran el día de mañana,
                    ¿usted votaría? <span className="required-star">*</span>
                  </span>
                </div>
                <div className="options-list">
                  <label className={`opt-row ${formData.votaria === 'si' ? 'selected' : ''}`}>
                    <input type="radio" name="votaria" value="si" onChange={handleChange} />
                    <div className="opt-circle" />
                    <span className="opt-text">Sí, votaría</span>
                  </label>
                  <label className={`opt-row ${formData.votaria === 'no' ? 'selected' : ''}`}>
                    <input type="radio" name="votaria" value="no" onChange={handleChange} />
                    <div className="opt-circle" />
                    <span className="opt-text">No votaría</span>
                  </label>
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn-secondary" onClick={prevStep}>← Volver</button>
                <button className="btn btn-primary" onClick={nextStep} disabled={!formData.edad || !formData.votaria}>
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ═══════════ PASO 2: CONOCIMIENTO DE CANDIDATOS ═══════════ */}
          {step === 2 && (
            <div className="step-panel active" id="step-2">
              <div className="section-title">Conocimiento de fórmulas presidenciales</div>
              <div className="info-chip">🗳️ Segunda Vuelta — Junio 2026</div>

              <div className="question">
                <div className="question-label">
                  <span className="q-num">4</span>
                  <span>
                    Después de la primera vuelta, ¿a quién o quiénes conoce de las siguientes fórmulas presidenciales?{' '}
                    <span className="required-star">*</span>
                  </span>
                </div>
                <div className="candidate-grid">
                  {Object.values(CANDIDATOS).map((c) => (
                    <div
                      key={`know-${c.id}`}
                      className={`candidate-card ${formData.conoce_formula.includes(c.id) ? 'selected' : ''}`}
                      onClick={() => toggleCheckbox('conoce_formula', c.id)}
                    >
                      <div className="formula-photos">
                        <div className="formula-photo">
                          <ImgFallback
                            className="formula-photo-img"
                            src={c.foto}
                            alt={c.nombreCorto}
                            initials={c.iniciales}
                            style={{ width: 56, height: 56, objectFit: 'cover', objectPosition: 'top' }}
                          />
                          <span className="formula-photo-role">Presidente</span>
                        </div>
                        <div className="formula-photo">
                          <ImgFallback
                            className="formula-photo-img"
                            src={c.vpFoto}
                            alt={c.vp}
                            initials={c.vpIniciales}
                            style={{ width: 56, height: 56, objectFit: 'cover', objectPosition: 'top' }}
                          />
                          <span className="formula-photo-role">{c.vp.includes('Aída') ? 'Vicepresidenta' : 'Vicepresidente'}</span>
                        </div>
                      </div>
                      <div className="candidate-body">
                        <div className="candidate-name">{c.nombreCorto}</div>
                        <div className="candidate-vp">VP: {c.vp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="question">
                <div className="question-label">
                  <span className="q-num">5</span>
                  <span>¿Para usted es importante conocer la fórmula vicepresidencial? <span className="required-star">*</span></span>
                </div>
                <div className="options-list">
                  <label className={`opt-row ${formData.imp_vp === 'si' ? 'selected' : ''}`}>
                    <input type="radio" name="imp_vp" value="si" onChange={handleChange} />
                    <div className="opt-circle" />
                    <span className="opt-text">Sí, es importante</span>
                  </label>
                  <label className={`opt-row ${formData.imp_vp === 'no' ? 'selected' : ''}`}>
                    <input type="radio" name="imp_vp" value="no" onChange={handleChange} />
                    <div className="opt-circle" />
                    <span className="opt-text">No</span>
                  </label>
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn-secondary" onClick={prevStep}>← Volver</button>
                <button className="btn btn-primary" onClick={nextStep} disabled={!formData.imp_vp}>Continuar →</button>
              </div>
            </div>
          )}

          {/* ═══════════ PASO 3: PREFERENCIAS ═══════════ */}
          {step === 3 && (
            <div className="step-panel active" id="step-3">
              <div className="section-title">Preferencias electorales</div>

              <div className="question">
                <div className="question-label">
                  <span className="q-num">6</span>
                  <span>
                    Pensando en la segunda vuelta, ¿cuál fórmula es su preferida para ocupar la presidencia de Colombia?{' '}
                    <span className="required-star">*</span>
                  </span>
                </div>
                <div className="candidate-grid">
                  {Object.values(CANDIDATOS).map((c) => (
                    <div
                      key={`pref-${c.id}`}
                      className={`candidate-card ${formData.pref_presidente === c.id ? 'selected' : ''}`}
                      onClick={() => setFormData((prev) => ({ ...prev, pref_presidente: c.id }))}
                    >
                      <div className="formula-photos">
                        <div className="formula-photo">
                          <ImgFallback
                            className="formula-photo-img"
                            src={c.foto}
                            alt={c.nombreCorto}
                            initials={c.iniciales}
                            style={{ width: 56, height: 56, objectFit: 'cover', objectPosition: 'top' }}
                          />
                          <span className="formula-photo-role">Presidente</span>
                        </div>
                        <div className="formula-photo">
                          <ImgFallback
                            className="formula-photo-img"
                            src={c.vpFoto}
                            alt={c.vp}
                            initials={c.vpIniciales}
                            style={{ width: 56, height: 56, objectFit: 'cover', objectPosition: 'top' }}
                          />
                          <span className="formula-photo-role">{c.vp.includes('Aída') ? 'Vicepresidenta' : 'Vicepresidente'}</span>
                        </div>
                      </div>
                      <div className="candidate-body">
                        <div className="candidate-name">{c.nombreCorto}</div>
                        <div className="candidate-vp">VP: {c.vp}</div>
                      </div>
                    </div>
                  ))}

                  <div
                    className={`blank-vote-card ${formData.pref_presidente === 'blanco' ? 'selected' : ''}`}
                    onClick={() => setFormData((prev) => ({ ...prev, pref_presidente: 'blanco' }))}
                  >
                    <div className="blank-vote-icon">🗳️</div>
                    <div className="blank-vote-label">VOTO EN<br />BLANCO</div>
                  </div>
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn-secondary" onClick={prevStep}>← Volver</button>
                <button className="btn btn-primary" onClick={nextStep} disabled={!formData.pref_presidente}>Continuar →</button>
              </div>
            </div>
          )}

          {/* ═══════════ PASO 4: CONOCIMIENTO, FAV E INTENCIÓN POR CANDIDATO ═══════════ */}
          {step === 4 && (
            <div className="step-panel active" id="step-4">
              <div className="section-title">Conocimiento, favorabilidad e intención de voto</div>

              {/* ── IVÁN CEPEDA ── */}
              <div className="candidate-profile-header">
                <ImgFallback
                  className="candidate-profile-photo"
                  src={CANDIDATOS.cepeda.fotoGrande}
                  alt="Iván Cepeda"
                  initials="IC"
                  style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top' }}
                />
                <div className="candidate-profile-info">
                  <h3>Iván Cepeda Castro</h3>
                  <p>Candidato Presidencial · Pacto Histórico</p>
                  <p style={{ marginTop: 2, fontSize: 11, color: 'var(--text-light)' }}>Fórmula VP: Aída Quilcué</p>
                </div>
              </div>

              <div className="question">
                <div className="question-label"><span className="q-num">7</span><span>¿Usted conoce a Iván Cepeda? <span className="required-star">*</span></span></div>
                <div className="options-list">
                  <label className={`opt-row ${formData.conoce_cepeda === 'si' ? 'selected' : ''}`}><input type="radio" name="conoce_cepeda" value="si" onChange={handleChange} /><div className="opt-circle" /><span className="opt-text">Sí</span></label>
                  <label className={`opt-row ${formData.conoce_cepeda === 'no' ? 'selected' : ''}`}><input type="radio" name="conoce_cepeda" value="no" onChange={handleChange} /><div className="opt-circle" /><span className="opt-text">No</span></label>
                </div>
              </div>

              <div className="question">
                <div className="question-label"><span className="q-num">8</span><span>¿Cómo calificaría la imagen que tiene de Iván Cepeda? <span className="required-star">*</span></span></div>
                <div className="scale-wrap">
                  {[
                    { val: '1', label: 'Tot. Desfavorable' },
                    { val: '2', label: 'Desfavorable' },
                    { val: '3', label: 'Neutro' },
                    { val: '4', label: 'Favorable' },
                    { val: '5', label: 'Tot. Favorable' },
                  ].map((s) => (
                    <div
                      key={`cep-${s.val}`}
                      className={`scale-btn ${formData.fav_cepeda === s.val ? 'selected' : ''}`}
                      onClick={() => setScale('fav_cepeda', s.val)}
                    >
                      {s.val}<br /><small>{s.label}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="question">
                <div className="question-label"><span className="q-num">9</span><span>Si las elecciones fueran mañana, ¿votaría por Iván Cepeda? <span className="required-star">*</span></span></div>
                <div className="options-list">
                  <label className={`opt-row ${formData.voto_cepeda === 'si' ? 'selected' : ''}`}><input type="radio" name="voto_cepeda" value="si" onChange={handleChange} /><div className="opt-circle" /><span className="opt-text">Sí, votaría por él</span></label>
                  <label className={`opt-row ${formData.voto_cepeda === 'no' ? 'selected' : ''}`}><input type="radio" name="voto_cepeda" value="no" onChange={handleChange} /><div className="opt-circle" /><span className="opt-text">No</span></label>
                </div>
              </div>

              <div className="divider" />

              {/* ── ABELARDO DE LA ESPRIELLA ── */}
              <div className="candidate-profile-header">
                <ImgFallback
                  className="candidate-profile-photo"
                  src={CANDIDATOS.espriella.fotoGrande}
                  alt="Abelardo de la Espriella"
                  initials="AE"
                  style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top' }}
                />
                <div className="candidate-profile-info">
                  <h3>Abelardo de la Espriella</h3>
                  <p>Candidato Presidencial · Defensores de la Patria</p>
                  <p style={{ marginTop: 2, fontSize: 11, color: 'var(--text-light)' }}>Fórmula VP: José Manuel Restrepo</p>
                </div>
              </div>

              <div className="question">
                <div className="question-label"><span className="q-num">10</span><span>¿Usted conoce a Abelardo de la Espriella? <span className="required-star">*</span></span></div>
                <div className="options-list">
                  <label className={`opt-row ${formData.conoce_espriella === 'si' ? 'selected' : ''}`}><input type="radio" name="conoce_espriella" value="si" onChange={handleChange} /><div className="opt-circle" /><span className="opt-text">Sí</span></label>
                  <label className={`opt-row ${formData.conoce_espriella === 'no' ? 'selected' : ''}`}><input type="radio" name="conoce_espriella" value="no" onChange={handleChange} /><div className="opt-circle" /><span className="opt-text">No</span></label>
                </div>
              </div>

              <div className="question">
                <div className="question-label"><span className="q-num">11</span><span>¿Cómo calificaría la imagen que tiene de Abelardo de la Espriella? <span className="required-star">*</span></span></div>
                <div className="scale-wrap">
                  {[
                    { val: '1', label: 'Tot. Desfavorable' },
                    { val: '2', label: 'Desfavorable' },
                    { val: '3', label: 'Neutro' },
                    { val: '4', label: 'Favorable' },
                    { val: '5', label: 'Tot. Favorable' },
                  ].map((s) => (
                    <div
                      key={`esp-${s.val}`}
                      className={`scale-btn ${formData.fav_espriella === s.val ? 'selected' : ''}`}
                      onClick={() => setScale('fav_espriella', s.val)}
                    >
                      {s.val}<br /><small>{s.label}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="question">
                <div className="question-label"><span className="q-num">12</span><span>Si las elecciones fueran mañana, ¿votaría por Abelardo de la Espriella? <span className="required-star">*</span></span></div>
                <div className="options-list">
                  <label className={`opt-row ${formData.voto_espriella === 'si' ? 'selected' : ''}`}><input type="radio" name="voto_espriella" value="si" onChange={handleChange} /><div className="opt-circle" /><span className="opt-text">Sí, votaría por él</span></label>
                  <label className={`opt-row ${formData.voto_espriella === 'no' ? 'selected' : ''}`}><input type="radio" name="voto_espriella" value="no" onChange={handleChange} /><div className="opt-circle" /><span className="opt-text">No</span></label>
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn-secondary" onClick={prevStep}>← Volver</button>
                <button className="btn btn-primary" onClick={nextStep}>Continuar →</button>
              </div>
            </div>
          )}

          {/* ═══════════ PASO 5: ACTUALIDAD ═══════════ */}
          {step === 5 && (
            <div className="step-panel active" id="step-5">
              <div className="section-title">Percepción de actualidad</div>

              <div className="question">
                <div className="question-label">
                  <span className="q-num">13</span>
                  <span>¿Cuál es el tema más importante que debe atender el próximo presidente? <span className="required-star">*</span></span>
                </div>
                <div className="options-list">
                  {[
                    { val: 'economia', label: 'Economía y empleo' },
                    { val: 'seguridad', label: 'Seguridad ciudadana' },
                    { val: 'salud', label: 'Salud pública' },
                    { val: 'educacion', label: 'Educación' },
                    { val: 'corrupcion', label: 'Lucha contra la corrupción' },
                    { val: 'paz', label: 'Paz y reconciliación' },
                    { val: 'medioambiente', label: 'Medio ambiente' },
                    { val: 'otro', label: 'Otro' },
                  ].map((opt) => (
                    <label key={opt.val} className={`opt-row ${formData.tema_importante === opt.val ? 'selected' : ''}`}>
                      <input type="radio" name="tema_importante" value={opt.val} onChange={handleChange} />
                      <div className="opt-circle" />
                      <span className="opt-text">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="question">
                <div className="question-label">
                  <span className="q-num">14</span>
                  <span>¿Cómo califica la gestión del gobierno actual? <span className="required-star">*</span></span>
                </div>
                <div className="scale-wrap">
                  {[
                    { val: '1', label: 'Muy mala' },
                    { val: '2', label: 'Mala' },
                    { val: '3', label: 'Regular' },
                    { val: '4', label: 'Buena' },
                    { val: '5', label: 'Muy buena' },
                  ].map((s) => (
                    <div
                      key={`gob-${s.val}`}
                      className={`scale-btn ${formData.gestion_gobierno === s.val ? 'selected' : ''}`}
                      onClick={() => setScale('gestion_gobierno', s.val)}
                    >
                      {s.val}<br /><small>{s.label}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn-secondary" onClick={prevStep}>← Volver</button>
                <button className="btn btn-primary" onClick={nextStep} disabled={!formData.tema_importante || !formData.gestion_gobierno}>
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ═══════════ PASO 6: DEMOGRÁFICOS ═══════════ */}
          {step === 6 && (
            <div className="step-panel active" id="step-6">
              <div className="section-title">Información demográfica</div>

              <div className="question">
                <div className="question-label">
                  <span className="q-num">15</span>
                  <span>¿Con cuál género se identifica? <span className="required-star">*</span></span>
                </div>
                <div className="options-list">
                  {[
                    { val: 'masculino', label: 'Masculino' },
                    { val: 'femenino', label: 'Femenino' },
                    { val: 'otro', label: 'Otro' },
                    { val: 'prefiero_no', label: 'Prefiero no decirlo' },
                  ].map((opt) => (
                    <label key={opt.val} className={`opt-row ${formData.genero === opt.val ? 'selected' : ''}`}>
                      <input type="radio" name="genero" value={opt.val} onChange={handleChange} />
                      <div className="opt-circle" />
                      <span className="opt-text">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="question">
                <div className="question-label">
                  <span className="q-num">16</span>
                  <span>¿Cuál es su estrato socioeconómico? <span className="required-star">*</span></span>
                </div>
                <div className="scale-wrap">
                  {['1', '2', '3', '4', '5', '6'].map((val) => (
                    <div
                      key={`estrato-${val}`}
                      className={`scale-btn ${formData.estrato === val ? 'selected' : ''}`}
                      onClick={() => setScale('estrato', val)}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              </div>

              <div className="question">
                <div className="question-label">
                  <span className="q-num">17</span>
                  <span>¿Cuál es su nivel educativo más alto alcanzado? <span className="required-star">*</span></span>
                </div>
                <div className="options-list">
                  {[
                    { val: 'primaria', label: 'Primaria' },
                    { val: 'bachillerato', label: 'Bachillerato' },
                    { val: 'tecnico', label: 'Técnico / Tecnólogo' },
                    { val: 'universitario', label: 'Universitario' },
                    { val: 'posgrado', label: 'Posgrado' },
                    { val: 'ninguno', label: 'Ninguno' },
                  ].map((opt) => (
                    <label key={opt.val} className={`opt-row ${formData.nivel_educativo === opt.val ? 'selected' : ''}`}>
                      <input type="radio" name="nivel_educativo" value={opt.val} onChange={handleChange} />
                      <div className="opt-circle" />
                      <span className="opt-text">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn-secondary" onClick={prevStep}>← Volver</button>
                <button className="btn btn-primary" onClick={nextStep} disabled={!formData.genero || !formData.estrato || !formData.nivel_educativo}>
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ═══════════ PASO 7: UBICACIÓN ═══════════ */}
          {step === 7 && (
            <div className="step-panel active" id="step-7">
              <div className="section-title">Ubicación geográfica</div>

              <div className="question">
                <div className="question-label">
                  <span className="q-num">18</span>
                  <span>Seleccione su zona de operación <span className="required-star">*</span></span>
                </div>
                <div className="row-2" style={{ marginBottom: 20 }}>
                  <label className={`radio-opt ${formData.territorio === 'bogota' ? 'selected' : ''}`}>
                    <input type="radio" name="territorio" value="bogota" onChange={handleChange} style={{ display: 'none' }} />
                    Bogotá
                  </label>
                  <label className={`radio-opt ${formData.territorio === 'cundinamarca' ? 'selected' : ''}`}>
                    <input type="radio" name="territorio" value="cundinamarca" onChange={handleChange} style={{ display: 'none' }} />
                    Cundinamarca
                  </label>
                </div>

                {formData.territorio && (
                  <div className="fade-in">
                    <div className="field-group" style={{ marginBottom: 16 }}>
                      <label className="field-label">
                        {formData.territorio === 'bogota' ? 'Localidad' : 'Municipio'}
                      </label>
                      <select className="select-field" name="localidad" value={formData.localidad} onChange={handleChange}>
                        <option value="">— Seleccione {formData.territorio === 'bogota' ? 'Localidad' : 'Municipio'} —</option>
                        {Object.keys(puntos).map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    {formData.localidad && (
                      <div className="field-group fade-in">
                        <label className="field-label">Punto</label>
                        <select className="select-field" name="punto" value={formData.punto} onChange={handleChange}>
                          <option value="">— Seleccione punto —</option>
                          {(puntos[formData.localidad] || []).map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="btn-row">
                <button className="btn btn-secondary" onClick={prevStep}>← Volver</button>
                <button className="btn btn-primary" onClick={nextStep} disabled={!formData.territorio || !formData.localidad || !formData.punto}>
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ═══════════ PASO 8: SORTEO ═══════════ */}
          {step === 8 && (
            <div className="step-panel active" id="step-8">
              <div className="section-title">Participa en nuestro sorteo</div>

              <div className="sorteo-box">
                <div className="sorteo-icon">🎁</div>
                <div className="sorteo-text">
                  <h3>¡Participa por premios increíbles!</h3>
                  <p>Deja tus datos y estarás participando en nuestro sorteo de bonos y premios especiales. La participación es voluntaria.</p>
                </div>
              </div>

              <div className="question">
                <div className="row-2" style={{ marginBottom: 16 }}>
                  <div className="field-group">
                    <label className="field-label">Número de Cédula</label>
                    <input
                      className="input-field"
                      type="text"
                      name="cedula_sorteo"
                      value={formData.cedula_sorteo}
                      onChange={handleChange}
                      placeholder="Ingrese su cédula"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Nombre completo</label>
                    <input
                      className="input-field"
                      type="text"
                      name="nombre_sorteo"
                      value={formData.nombre_sorteo}
                      onChange={handleChange}
                      placeholder="Ingrese su nombre completo"
                    />
                  </div>
                </div>

                <div className="row-2" style={{ marginBottom: 16 }}>
                  <div className="field-group">
                    <label className="field-label">Celular</label>
                    <input
                      className="input-field"
                      type="tel"
                      name="celular_sorteo"
                      value={formData.celular_sorteo}
                      onChange={handleChange}
                      placeholder="300 123 4567"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Correo electrónico</label>
                    <input
                      className="input-field"
                      type="email"
                      name="email_sorteo"
                      value={formData.email_sorteo}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn-secondary" onClick={prevStep}>← Volver</button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSubmit}
                  disabled={usuariosGelsa.includes(String(formData.cedula_sorteo).trim())}
                >
                  Enviar encuesta ✓
                </button>
              </div>
            </div>
          )}

          {/* ═══════════ PANTALLA FINAL: AGRADECIMIENTO ═══════════ */}
          {step === TOTAL_STEPS && (
            <div className="thank-you fade-in">
              <div className="ty-icon">✔️</div>
              <h2 className="ty-title">¡Gracias por participar!</h2>
              <p className="ty-sub">La información ha sido registrada exitosamente.</p>
              <p className="ty-sub" style={{ marginTop: 8 }}>Si dejó sus datos, estará participando en nuestro sorteo.</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
