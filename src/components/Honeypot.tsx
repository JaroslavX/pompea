import { HONEYPOT_FIELD } from '../lib/formGuard';

/** Hidden anti-spam field: invisible and unreachable for people, tempting for bots. */
export default function Honeypot() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
      <label htmlFor={HONEYPOT_FIELD}>Не заповнюйте це поле</label>
      <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
