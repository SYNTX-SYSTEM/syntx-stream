export interface Strom {
  strom_id: string
  muster: string
  name: string
  zeitplan: string
  modell: string
  felder_topics: Record<string, number>
  styles: string[]
  sprachen: string[]
  aktiv: boolean
  created_at: string
  updated_at: string
}

export interface StromCreateData {
  name: string
  zeitplan: string
  modell: string
  felder_topics: Record<string, number>
  styles: string[]
  sprachen: string[]
  aktiv?: boolean
}

export interface StromConfig extends Strom {}

export interface StromUpdateData {
  name?: string
  zeitplan?: string
  modell?: string
  felder_topics?: Record<string, number>
  styles?: string[]
  sprachen?: string[]
  aktiv?: boolean
}
