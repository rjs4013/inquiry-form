import React, { useState } from 'react'
import './App.css'

const SELECT_OPTIONS = {
  inquiryType: ['견적 및 도입 문의', '유지보수 문의', '기술지원 문의', '마케팅 및 제휴 문의', '교육 문의', '기타'],
  industry: ['IT/SaaS', '제조·물류', '금융·보험', '공공기관', '유통·커머스', '기타(직접 입력)'],
  vcsTools: ['없음', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', '기타(직접 입력)'],
  ciTools: ['없음', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Azure Pipelines', '기타(직접 입력)'],
  timeline: ['미정', '즉시', '1~3개월 내', '3~6개월 내', '6개월 이후'],
  products: [
    'Sparrow SAST', 'Sparrow SCA', 'Sparrow DAST',
    'Sparrow SAQT', 'Sparrow SecureHub', 'Sparrow On-Demand',
    'Sparrow Cloud 일반기업용', 'Sparrow Cloud 공공기관용',
    '진단 서비스', '교육·트레이닝 서비스', '기타'
  ],
  devLang: ['모름', 'Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Kotlin', 'Swift', 'Ruby', 'PHP', 'Rust', '기타'],
}

const FIELD_CONFIG = {
  '견적 및 도입 문의': ['techEnv', 'products', 'purpose'],
  '유지보수 문의':     ['products', 'purpose'],
  '기술지원 문의':     ['products', 'devLang', 'purpose'],
  '마케팅 및 제휴 문의': ['purpose'],
  '교육 문의':        ['products', 'purpose'],
  '기타':             ['purpose'],
}

const PURPOSE_LABEL = {
  '견적 및 도입 문의': '도입 목적',
  '유지보수 문의':     '문의 내용',
  '기술지원 문의':     '문의 내용',
  '마케팅 및 제휴 문의': '제휴 내용',
  '교육 문의':        '교육 요청 내용',
  '기타':             '문의 내용',
}

const PURPOSE_PLACEHOLDER = {
  '견적 및 도입 문의': '예: 금융감독원 보안 규정 대응을 위한 소스코드 취약점 점검 보고서 필요',
  '유지보수 문의':     '예: 현재 사용 중인 Sparrow SAST 버전과 유지보수 갱신 관련 문의',
  '기술지원 문의':     '예: 특정 언어 분석 시 오탐이 발생하고 있습니다. 버전은 X.X.X입니다.',
  '마케팅 및 제휴 문의': '예: 보안 교육 플랫폼과의 제휴 관련 문의드립니다.',
  '교육 문의':        '예: 개발자 대상 교육을 10명 규모로 진행하고 싶습니다.',
  '기타':             '문의 내용을 자유롭게 작성해주세요.',
}

const initialForm = {
  name: '', company: '', position: '', email: '', phone: '',
  companyUrl: '', endUser: '', priorExperienceText: '',
  inquiryType: '',
  products: [],
  industry: '', industryEtc: '', mainProduct: '',
  devLang: [], devFramework: '',
  vcsTools: '', vcsEtc: '',
  ciTools: '', ciEtc: '',
  timeline: '',
  purpose: '',
  agreeRequired: false, agreeMarketing: false,
}

function Field({ label, required, hint, children, fieldKey }) {
  return (
    <div className="field" data-field={fieldKey}>
      <label className="field-label">
        {label}{required && <span className="required"> *</span>}
      </label>
      {hint && <p className="field-hint">{hint}</p>}
      {children}
    </div>
  )
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="input">
      <option value="">선택해주세요</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function MultiSelect({ value, onChange, options }) {
  const toggle = (v) => {
    if (value.includes(v)) onChange(value.filter(x => x !== v))
    else onChange([...value, v])
  }
  return (
    <div className="multi-select">
      {options.map(o => (
        <label key={o} className={`multi-option${value.includes(o) ? ' selected' : ''}`}>
          <input type="checkbox" checked={value.includes(o)} onChange={() => toggle(o)} style={{ display: 'none' }} />
          {o}
        </label>
      ))}
    </div>
  )
}

function SectionHeader({ title, icon }) {
  return (
    <div className="section-header">
      <span className="section-icon">{icon}</span>
      <h2 className="section-title">{title}</h2>
    </div>
  )
}

function MultiSelectDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const ref = React.useRef()

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = (v) => {
    if (value.includes(v)) onChange(value.filter(x => x !== v))
    else onChange([...value, v])
  }

  const label = value.length === 0 ? '선택해주세요' : value.join(', ')

  return (
    <div className="multi-select-dropdown" ref={ref}>
      <button type="button" className={`multi-select-trigger${open ? ' open' : ''}`} onClick={() => setOpen(v => !v)}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: value.length === 0 ? '#aaa' : '#111' }}>
          {label}
        </span>
      </button>
      {open && (
        <div className="multi-select-dropdown-list">
          {options.map(o => (
            <div key={o} className={`multi-option${value.includes(o) ? ' selected' : ''}`} onClick={() => toggle(o)}>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const fields = form.inquiryType ? FIELD_CONFIG[form.inquiryType] : []
  const has = (f) => fields.includes(f)

  const validate = () => {
    const e = {}
    if (!form.inquiryType) e.inquiryType = '구분을 선택해주세요'
    if (has('products') && form.products.length === 0) e.products = '관심 제품을 하나 이상 선택해주세요'
    if (!form.name.trim()) e.name = '이름을 입력해주세요'
    if (!form.company.trim()) e.company = '회사명을 입력해주세요'
    if (!form.position.trim()) e.position = '직책을 입력해주세요'
    if (!form.email.trim()) e.email = '이메일을 입력해주세요'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = '올바른 이메일 형식을 입력해주세요'
    if (!form.phone.trim()) e.phone = '연락처를 입력해주세요'
    if (!form.priorExperienceText.trim()) e.priorExperienceText = '유사 제품 사용 경험을 입력해주세요'
    if (has('techEnv') || has('devLang')) {
      if (form.devLang.length === 0) e.devLang = '개발 언어를 선택해주세요'
    }
    if (has('techEnv')) {
      if (!form.vcsTools) e.vcsTools = '형상 관리 도구를 선택해주세요'
      if (form.vcsTools === '기타(직접 입력)' && !form.vcsEtc.trim()) e.vcsEtc = '직접 입력해주세요'
      if (!form.ciTools) e.ciTools = 'CI 도구를 선택해주세요'
      if (form.ciTools === '기타(직접 입력)' && !form.ciEtc.trim()) e.ciEtc = '직접 입력해주세요'
      if (!form.priorExperience) e.priorExperience = '유사 제품 사용 경험을 선택해주세요'
      if (!form.timeline) e.timeline = '도입 희망 시기를 선택해주세요'
    }
    if (!form.purpose.trim()) e.purpose = '내용을 입력해주세요'
    if (!form.agreeRequired) e.agreeRequired = '개인정보 수집·이용에 동의해주세요'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      const firstKey = Object.keys(e)[0]
      document.querySelector(`[data-field="${firstKey}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1 className="success-title">문의가 접수되었습니다</h1>
          <p className="success-desc">
            입력하신 연락처 <strong>{form.email}</strong>로<br />
            영업일 기준 1~2일 내에 연락드리겠습니다.
          </p>
          <button className="btn-secondary" onClick={() => { setForm(initialForm); setSubmitted(false) }}>
            새 문의 작성
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="form-container">
        <div className="form-header">
          <p className="form-eyebrow">SPARROW SECURITY</p>
          <h1 className="form-title">제품 문의</h1>
          <p className="form-desc">문의 내용을 작성해주시면 담당자가 빠르게 연락드리겠습니다.</p>
        </div>

        {/* 구분 */}
        <section className="section">
          <SectionHeader title="구분"/>
          <Field label="문의 유형" required fieldKey="inquiryType">
            <div className="inquiry-type-grid">
              {SELECT_OPTIONS.inquiryType.map(t => (
                <label key={t} className={`inquiry-type-card${form.inquiryType === t ? ' selected' : ''}`}>
                  <input type="radio" name="inquiryType" value={t} checked={form.inquiryType === t}
                    onChange={() => { set('inquiryType', t); setErrors({}) }} style={{ display: 'none' }} />
                  {t}
                </label>
              ))}
            </div>
            {errors.inquiryType && <p className="error-msg">{errors.inquiryType}</p>}
          </Field>
        </section>

        {/* 관심 제품 - 구분 선택 후 노출 */}
        {form.inquiryType && has('products') && (
          <section className="section">
            <SectionHeader title="문의 제품 및 서비스"/>
            <Field label="제품 및 서비스" required hint="복수 선택 가능합니다." fieldKey="products">
              <MultiSelect value={form.products} onChange={v => set('products', v)} options={SELECT_OPTIONS.products} />
              {errors.products && <p className="error-msg">{errors.products}</p>}
            </Field>
          </section>
        )}

        {/* 기본 정보 */}
        {form.inquiryType && (
          <section className="section">
            <SectionHeader title="기본 정보" />
            <div className="grid-2">
              <Field label="이름" required fieldKey="name">
                <input className={`input${errors.name ? ' input-error' : ''}`} value={form.name} onChange={e => set('name', e.target.value)} placeholder="홍길동" />
                {errors.name && <p className="error-msg">{errors.name}</p>}
              </Field>
              <Field label="회사명" required fieldKey="company">
                <input className={`input${errors.company ? ' input-error' : ''}`} value={form.company} onChange={e => set('company', e.target.value)} placeholder="(주)스패로우" />
                {errors.company && <p className="error-msg">{errors.company}</p>}
              </Field>
              <Field label="회사 홈페이지" fieldKey="companyUrl">
                <input className="input" value={form.companyUrl} onChange={e => set('companyUrl', e.target.value)} placeholder="https://sparrow.im" />
              </Field>
              <Field label="직위" required fieldKey="position">
                <input className={`input${errors.position ? ' input-error' : ''}`} value={form.position} onChange={e => set('position', e.target.value)} placeholder="과장" />
                {errors.position && <p className="error-msg">{errors.position}</p>}
              </Field>
              <Field label="이메일" required fieldKey="email">
                <input className={`input${errors.email ? ' input-error' : ''}`} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="example@sparrow.im" />
                {errors.email && <p className="error-msg">{errors.email}</p>}
              </Field>
              <Field label="연락처" required fieldKey="phone">
                <input className={`input${errors.phone ? ' input-error' : ''}`} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="010-0000-0000" />
                {errors.phone && <p className="error-msg">{errors.phone}</p>}
              </Field>
              <Field label="최종 고객사 (엔드 유저)" required hint="담당 영업대표 배정에 활용" fieldKey="endUser">
                <input className="input" value={form.endUser} onChange={e => set('endUser', e.target.value)} placeholder="직접 도입의 경우 '해당 없음' 으로 입력" />
              </Field>
            </div>
          </section>
        )}

        {/* 기술 환경 */}
        {form.inquiryType && (has('techEnv') || has('devLang')) && (
          <section className="section">
            <SectionHeader title="기술 환경 정보" />
            <div className="grid-2">
              <Field label="개발 언어" required hint="예: Java, Python, JavaScript 등 복수 선택 가능"fieldKey="devLang">
                <MultiSelectDropdown value={form.devLang} onChange={v => set('devLang', v)} options={SELECT_OPTIONS.devLang} />
                {errors.devLang && <p className="error-msg">{errors.devLang}</p>}
              </Field>
              <Field label="프레임워크" hint="예: Spring, Django, React, 모름" fieldKey="devFramework">
                <input className={`input${errors.devFramework ? ' input-error' : ''}`} value={form.devFramework} onChange={e => set('devFramework', e.target.value)} placeholder="직접 입력" />
                {errors.devFramework && <p className="error-msg">{errors.devFramework}</p>}
              </Field>
              {has('techEnv') && <>
                <Field label="형상 관리 도구" required hint="소스코드 버전 관리 도구" fieldKey="vcsTools">
                  <Select value={form.vcsTools} onChange={v => set('vcsTools', v)} options={SELECT_OPTIONS.vcsTools} />
                  {errors.vcsTools && <p className="error-msg">{errors.vcsTools}</p>}
                  {form.vcsTools === '기타(직접 입력)' && (
                    <div style={{ marginTop: 8 }}>
                      <input data-field="vcsEtc" className={`input${errors.vcsEtc ? ' input-error' : ''}`} value={form.vcsEtc} onChange={e => set('vcsEtc', e.target.value)} placeholder="직접 입력해주세요" />
                      {errors.vcsEtc && <p className="error-msg">{errors.vcsEtc}</p>}
                    </div>
                  )}
                </Field>
                <Field label="CI 도구" required hint="빌드·배포 자동화 도구" fieldKey="ciTools">
                  <Select value={form.ciTools} onChange={v => set('ciTools', v)} options={SELECT_OPTIONS.ciTools} />
                  {errors.ciTools && <p className="error-msg">{errors.ciTools}</p>}
                  {form.ciTools === '기타(직접 입력)' && (
                    <div style={{ marginTop: 8 }}>
                      <input data-field="ciEtc" className={`input${errors.ciEtc ? ' input-error' : ''}`} value={form.ciEtc} onChange={e => set('ciEtc', e.target.value)} placeholder="직접 입력해주세요" />
                      {errors.ciEtc && <p className="error-msg">{errors.ciEtc}</p>}
                    </div>
                  )}
                </Field>
                <Field label="유사 제품 사용 경험" required hint="현재 사용 중이거나 이전에 사용한 보안 분석 도구" fieldKey="priorExperienceText">
                  <input className={`input${errors.priorExperienceText ? ' input-error' : ''}`} value={form.priorExperienceText} onChange={e => set('priorExperienceText', e.target.value)} placeholder="직접 입력" />
                  {errors.priorExperienceText && <p className="error-msg">{errors.priorExperienceText}</p>}
                </Field>
                <Field label="도입 희망 시기" required hint="제품 도입 또는 프로젝트 시작 시기" fieldKey="timeline">
                  <Select value={form.timeline} onChange={v => set('timeline', v)} options={SELECT_OPTIONS.timeline} />
                  {errors.timeline && <p className="error-msg">{errors.timeline}</p>}
                </Field>
              </>}
            </div>
          </section>
        )}

        {/* 문의 내용 */}
        {form.inquiryType && (
          <section className="section">
            <SectionHeader title={PURPOSE_LABEL[form.inquiryType]} />
            <Field label={PURPOSE_LABEL[form.inquiryType]} required fieldKey="purpose">
              <textarea
                className={`input textarea${errors.purpose ? ' input-error' : ''}`}
                value={form.purpose}
                onChange={e => set('purpose', e.target.value)}
                placeholder={PURPOSE_PLACEHOLDER[form.inquiryType]}
                maxLength={500}
              />
              <div className="char-count">{form.purpose.length} / 500</div>
              {errors.purpose && <p className="error-msg">{errors.purpose}</p>}
            </Field>
          </section>
        )}

        {/* 개인정보 동의 */}
        {form.inquiryType && (
          <section className="section">
            <SectionHeader title="개인정보 수집 및 이용 동의" />
            <div className="agree-list">
              <div data-field="agreeRequired" className={`agree-item${errors.agreeRequired ? ' agree-error' : ''}`}>
                <label className="agree-label">
                  <input type="checkbox" checked={form.agreeRequired} onChange={e => set('agreeRequired', e.target.checked)} className="checkbox" />
                  <span>[필수] 개인정보 수집·이용에 동의합니다</span>
                  <a href="#" className="agree-link" onClick={e => e.preventDefault()}>전문 보기</a>
                </label>
                {errors.agreeRequired && <p className="error-msg" style={{ paddingLeft: 24 }}>{errors.agreeRequired}</p>}
              </div>
              <div className="agree-item">
                <label className="agree-label">
                  <input type="checkbox" checked={form.agreeMarketing} onChange={e => set('agreeMarketing', e.target.checked)} className="checkbox" />
                  <span>[선택] 마케팅 정보 수신에 동의합니다</span>
                </label>
              </div>
            </div>
          </section>
        )}

        {form.inquiryType && (
          <div className="form-footer">
            <button className="btn-reset" onClick={() => { setForm(initialForm); setErrors({}) }}>초기화</button>
            <button className="btn-submit" onClick={handleSubmit}>문의하기 →</button>
          </div>
        )}
      </div>
    </div>
  )
}