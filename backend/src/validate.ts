// Tiny hand-written validators. Each returns the clean value or throws ValidationError.
export class ValidationError extends Error {
  constructor(public fields: Record<string, string>) {
    super('Validation failed')
  }
}

type Body = Record<string, unknown>

export function asBody(v: unknown): Body {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) throw new ValidationError({ body: 'JSON object required' })
  return v as Body
}

export function str(b: Body, k: string, o: { min?: number; max: number; required?: boolean }): string | undefined {
  const v = b[k]
  if (v === undefined || v === null || v === '') {
    if (o.required) throw new ValidationError({ [k]: 'required' })
    return undefined
  }
  if (typeof v !== 'string') throw new ValidationError({ [k]: 'must be a string' })
  if (v.length < (o.min ?? 0)) throw new ValidationError({ [k]: `at least ${o.min} characters` })
  if (v.length > o.max) throw new ValidationError({ [k]: `at most ${o.max} characters` })
  return v
}

export function int(b: Body, k: string, o: { min: number; max: number; required?: boolean }): number | undefined {
  const v = b[k]
  if (v === undefined || v === null) {
    if (o.required) throw new ValidationError({ [k]: 'required' })
    return undefined
  }
  if (typeof v !== 'number' || !Number.isInteger(v) || v < o.min || v > o.max)
    throw new ValidationError({ [k]: `integer between ${o.min} and ${o.max}` })
  return v
}

export function oneOf<T extends string>(b: Body, k: string, values: readonly T[], required = false): T | undefined {
  const v = b[k]
  if (v === undefined || v === null) {
    if (required) throw new ValidationError({ [k]: 'required' })
    return undefined
  }
  if (typeof v !== 'string' || !(values as readonly string[]).includes(v))
    throw new ValidationError({ [k]: `one of: ${values.join(', ')}` })
  return v as T
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function email(b: Body): string {
  const v = str(b, 'email', { max: 190, required: true })!.trim().toLowerCase()
  if (!EMAIL.test(v)) throw new ValidationError({ email: 'invalid email' })
  return v
}

export function isoDate(b: Body, k: string): string | undefined {
  const v = str(b, k, { max: 40 })
  if (v === undefined) return undefined
  const t = Date.parse(v)
  if (Number.isNaN(t)) throw new ValidationError({ [k]: 'invalid date' })
  if (t > Date.now() + 5 * 60_000) throw new ValidationError({ [k]: 'cannot be in the future' })
  return new Date(t).toISOString()
}
