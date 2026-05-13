import { useState } from 'react'
import './App.css'

const SELECT_OPTIONS = {
  companySize: ['1~10명', '11~50명', '51~200명', '201~500명', '500명 이상'],
  industry: ['IT/SaaS', '제조·물류', '금융·보험', '공공기관', '유통·커머스', '기타(직접 입력)'],
  bizStage: ['기획 중', '운영 중', '확장·고도화 중', '모름'],
  vcsTools: ['GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Azure DevOps', '기타(직접 입력)', '없음'],
  ciTools: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI', 'TeamCity', 'Azure Pipelines', '기타(직접 입력)', '없음'],
  priorExperience: ['없음', 'Checkmarx', 'Veracode', 'SonarQube', 'Snyk', 'Fortify', '기타(직접 입력)'],
  timeline: ['즉시', '1~3개월 내', '3~6개월 내', '6개월 이후', '미정'],
  products: ['SAST', 'DAST', 'SCA'],
}

const initialForm = {
  name: '', company: '', position: '', email: '', phone: '',
  companySize: '', industry: '', industryEtc: '',
  mainProduct: '', bizStage: '',
  devLang: '',
  vcsTools: '', vcsEtc: '',
  ciTools: '', ciEtc: '',
  priorExperience: '', priorEtc: '',
  timeline: '',
  purpose: '',
  products: [],
  files: [],
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

function SectionHeader({ title, icon }) {
  return (
    <div className="section-header">
      <span className="section-icon">{icon}</span>
      <h2 className="section-title">{title}</h2>
    </div>
  )
}

function ProductCheckbox({ value, onChange }) {
  const toggle = (p) => {
    if (value.includes(p)) onChange(value.filter(v => v !== p))
    else onChange([...value, p])
  }
  const descriptions = {
    SAST: '정적 분석 · 소스코드 보안 취약점 탐지',
    DAST: '동적 분석 · 실행 중 애플리케이션 취약점 탐지',
    SCA: '오픈소스 컴포넌트 보안 및 라이선스 분석',
  }
  return (
    <div className="product-grid">
      {SELECT_OPTIONS.products.map(p => (
        <label key={p} className={`product-card${value.includes(p) ? ' selected' : ''}`}>
          <input type="checkbox" checked={value.includes(p)} onChange={() => toggle(p)} style={{ display: 'none' }} />
          <span className="product-name">{p}</span>
          <span className="product-desc">{descriptions[p]}</span>
        </label>
      ))}
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

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = '이름을 입력해주세요'
    if (!form.company.trim()) e.company = '회사명을 입력해주세요'
    if (!form.position.trim()) e.position = '직책을 입력해주세요'
    if (!form.email.trim()) e.email = '이메일을 입력해주세요'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = '올바른 이메일 형식을 입력해주세요'
    if (!form.phone.trim()) e.phone = '연락처를 입력해주세요'
    if (!form.companySize) e.companySize = '회사 규모를 선택해주세요'
    if (!form.industry) e.industry = '업종을 선택해주세요'
    if (form.industry === '기타(직접 입력)' && !form.industryEtc.trim()) e.industryEtc = '업종을 직접 입력해주세요'
    if (!form.mainProduct.trim()) e.mainProduct = '주요 서비스·제품을 입력해주세요'
    if (!form.bizStage) e.bizStage = '비즈니스 단계를 선택해주세요'
    if (!form.devLang.trim()) e.devLang = '개발 언어/프레임워크를 입력해주세요'
    if (!form.vcsTools) e.vcsTools = '형상 관리 도구를 선택해주세요'
    if (form.vcsTools === '기타(직접 입력)' && !form.vcsEtc.trim()) e.vcsEtc = '직접 입력해주세요'
    if (!form.ciTools) e.ciTools = 'CI 도구를 선택해주세요'
    if (form.ciTools === '기타(직접 입력)' && !form.ciEtc.trim()) e.ciEtc = '직접 입력해주세요'
    if (!form.priorExperience) e.priorExperience = '유사 제품 사용 경험을 선택해주세요'
    if (form.priorExperience === '기타(직접 입력)' && !form.priorEtc.trim()) e.priorEtc = '직접 입력해주세요'
    if (!form.timeline) e.timeline = '도입 희망 시기를 선택해주세요'
    if (!form.purpose.trim()) e.purpose = '도입 목적을 입력해주세요'
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

  const handleFileChange = (ev) => {
    const newFiles = Array.from(ev.target.files)
    set('files', [...form.files, ...newFiles])
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

        {/* 1. 기본 정보 */}
        <section className="section">
          <SectionHeader title="기본 정보" icon="👤" />
          <div className="grid-2">
            <Field label="이름" required fieldKey="name">
              <input className={`input${errors.name ? ' input-error' : ''}`} value={form.name} onChange={e => set('name', e.target.value)} placeholder="홍길동" />
              {errors.name && <p className="error-msg">{errors.name}</p>}
            </Field>
            <Field label="회사명" required fieldKey="company">
              <input className={`input${errors.company ? ' input-error' : ''}`} value={form.company} onChange={e => set('company', e.target.value)} placeholder="(주)스패로우" />
              {errors.company && <p className="error-msg">{errors.company}</p>}
            </Field>
            <Field label="직책" required fieldKey="position">
              <input className={`input${errors.position ? ' input-error' : ''}`} value={form.position} onChange={e => set('position', e.target.value)} placeholder="예: 개발팀장, 보안담당자, CISO" />
              {errors.position && <p className="error-msg">{errors.position}</p>}
            </Field>
            <Field label="이메일" required fieldKey="email">
              <input className={`input${errors.email ? ' input-error' : ''}`} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="example@company.com" />
              {errors.email && <p className="error-msg">{errors.email}</p>}
            </Field>
            <Field label="연락처" required fieldKey="phone">
              <input className={`input${errors.phone ? ' input-error' : ''}`} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="010-0000-0000" />
              {errors.phone && <p className="error-msg">{errors.phone}</p>}
            </Field>
          </div>
        </section>

        {/* 2. 회사 & 기술 환경 (통합) */}
        <section className="section">
          <SectionHeader title="회사 · 프로젝트 & 기술 환경 정보" icon="🏢" />
          <div className="grid-2">
            <Field label="업종" required fieldKey="industry">
              <Select value={form.industry} onChange={v => set('industry', v)} options={SELECT_OPTIONS.industry} />
              {errors.industry && <p className="error-msg">{errors.industry}</p>}
              {form.industry === '기타(직접 입력)' && (
                <div style={{ marginTop: 8 }}>
                  <input data-field="industryEtc" className={`input${errors.industryEtc ? ' input-error' : ''}`} value={form.industryEtc} onChange={e => set('industryEtc', e.target.value)} placeholder="업종을 직접 입력해주세요" />
                  {errors.industryEtc && <p className="error-msg">{errors.industryEtc}</p>}
                </div>
              )}
            </Field>
            <Field label="주요 서비스·제품" required fieldKey="mainProduct">
              <input className={`input${errors.mainProduct ? ' input-error' : ''}`} value={form.mainProduct} onChange={e => set('mainProduct', e.target.value)} placeholder="예: 금융 앱, 사내 ERP 등" />
              {errors.mainProduct && <p className="error-msg">{errors.mainProduct}</p>}
            </Field>
            <Field label="현재 비즈니스 단계" required fieldKey="bizStage">
              <Select value={form.bizStage} onChange={v => set('bizStage', v)} options={SELECT_OPTIONS.bizStage} />
              {errors.bizStage && <p className="error-msg">{errors.bizStage}</p>}
            </Field>
            <Field label="도입 희망 시기" required fieldKey="timeline">
              <Select value={form.timeline} onChange={v => set('timeline', v)} options={SELECT_OPTIONS.timeline} />
              {errors.timeline && <p className="error-msg">{errors.timeline}</p>}
            </Field>
            <Field label="개발 언어 / 프레임워크" required hint="예: Java/Spring, JavaScript/React, C#/.NET 등" fieldKey="devLang">
              <input className={`input${errors.devLang ? ' input-error' : ''}`} value={form.devLang} onChange={e => set('devLang', e.target.value)} placeholder="직접 입력" />
              {errors.devLang && <p className="error-msg">{errors.devLang}</p>}
            </Field>
            <Field label="형상 관리 도구" required hint="소스코드 버전 관리에 사용 중인 도구" fieldKey="vcsTools">
              <Select value={form.vcsTools} onChange={v => set('vcsTools', v)} options={SELECT_OPTIONS.vcsTools} />
              {errors.vcsTools && <p className="error-msg">{errors.vcsTools}</p>}
              {form.vcsTools === '기타(직접 입력)' && (
                <div style={{ marginTop: 8 }}>
                  <input data-field="vcsEtc" className={`input${errors.vcsEtc ? ' input-error' : ''}`} value={form.vcsEtc} onChange={e => set('vcsEtc', e.target.value)} placeholder="직접 입력해주세요" />
                  {errors.vcsEtc && <p className="error-msg">{errors.vcsEtc}</p>}
                </div>
              )}
            </Field>
            <Field label="CI 도구" required hint="빌드·배포 자동화에 사용 중인 도구" fieldKey="ciTools">
              <Select value={form.ciTools} onChange={v => set('ciTools', v)} options={SELECT_OPTIONS.ciTools} />
              {errors.ciTools && <p className="error-msg">{errors.ciTools}</p>}
              {form.ciTools === '기타(직접 입력)' && (
                <div style={{ marginTop: 8 }}>
                  <input data-field="ciEtc" className={`input${errors.ciEtc ? ' input-error' : ''}`} value={form.ciEtc} onChange={e => set('ciEtc', e.target.value)} placeholder="직접 입력해주세요" />
                  {errors.ciEtc && <p className="error-msg">{errors.ciEtc}</p>}
                </div>
              )}
            </Field>
            <Field label="유사 제품 사용 경험" required hint="현재 사용 중이거나 이전에 사용한 보안 분석 도구" fieldKey="priorExperience">
              <Select value={form.priorExperience} onChange={v => set('priorExperience', v)} options={SELECT_OPTIONS.priorExperience} />
              {errors.priorExperience && <p className="error-msg">{errors.priorExperience}</p>}
              {form.priorExperience === '기타(직접 입력)' && (
                <div style={{ marginTop: 8 }}>
                  <input data-field="priorEtc" className={`input${errors.priorEtc ? ' input-error' : ''}`} value={form.priorEtc} onChange={e => set('priorEtc', e.target.value)} placeholder="직접 입력해주세요" />
                  {errors.priorEtc && <p className="error-msg">{errors.priorEtc}</p>}
                </div>
              )}
            </Field>
          </div>
        </section>

        {/* 3. 도입 목적 */}
        <section className="section">
          <SectionHeader title="도입 목적" icon="🎯" />
          <Field label="도입 목적" required hint="현재 고민이나 해결하고 싶은 보안 이슈를 자유롭게 작성해주세요." fieldKey="purpose">
            <textarea
              className={`input textarea${errors.purpose ? ' input-error' : ''}`}
              value={form.purpose}
              onChange={e => set('purpose', e.target.value)}
              placeholder="예: 금융감독원 보안 규정 대응을 위한 소스코드 취약점 점검 보고서 필요"
              maxLength={500}
            />
            <div className="char-count">{form.purpose.length} / 500</div>
            {errors.purpose && <p className="error-msg">{errors.purpose}</p>}
          </Field>

          <div style={{ marginTop: 20 }}>
            <Field label="관심 제품 (선택사항)" hint="도입을 검토 중인 제품을 선택해주세요. 복수 선택 가능합니다." fieldKey="products">
              <ProductCheckbox value={form.products} onChange={v => set('products', v)} />
            </Field>
          </div>
        </section>

        {/* 5. 개인정보 동의 */}
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

        <div className="form-footer">
          <button className="btn-reset" onClick={() => { setForm(initialForm); setErrors({}) }}>초기화</button>
          <button className="btn-submit" onClick={handleSubmit}>문의하기 →</button>
        </div>
      </div>
    </div>
  )
}
