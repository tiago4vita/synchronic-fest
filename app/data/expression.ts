/**
 * Core lines (English) + multilingual variants for the “Expression” background layer.
 * Motion is decorative; meaning is secondary to texture (see project brief).
 */

export type ExpressionLocale =
  | 'en'
  | 'ja'
  | 'ko'
  | 'ar'
  | 'es'
  | 'de'
  | 'fr'
  | 'pt'

/** line index 0..2 → locale → text */
export const expressionByLine: Record<
  number,
  Partial<Record<ExpressionLocale, string>>
> = {
  0: {
    en: 'The party your group chat will still be @-ing next week.',
    ja: '来週までグループチャットが止まらない夜。',
    ko: '다음 주까지 단톡이 안 멈출 그 밤.',
    ar: 'الحفلة التي سيظلُّ أصدقاؤك يتحدثون عنها الأسبوع المقبل.',
    es: 'La fiesta de la que el grupo sigue hablando la semana que viene.',
    de: 'Die Party, von der dein Gruppenchat nächste Woche noch nicht schweigen wird.',
    fr: 'La soirée dont le groupe va encore parler la semaine prochaine.',
    pt: 'A festa que o pessoal ainda vai ficar citando semana que vem.',
  },
  1: {
    en: 'FOMO rots your brain—your couch can wait.',
    ja: 'FOMOは脳に効く。ソファは明日でいい。',
    ko: 'FOMO는 뇌를 녹여—소파는 나중에.',
    ar: 'الفومو يضرُّ بالعقل—الأريكة تنتظر.',
    es: 'El FOMO te funde el cerebro—el sofá puede esperar.',
    de: 'FOMO macht dein Hirn brei—die Couch kann warten.',
    fr: 'Le FOMO te grille les neurones—le canapé peut attendre.',
    pt: 'FOMO destrói o cérebro—o sofá que espere.',
  },
  2: {
    en: "When life sends a signal, don't leave it on read.",
    ja: '人生からの通知、既読スルーしないで。',
    ko: '인생이 보낸 신호, 읽씹하지 마.',
    ar: 'إشارة من الحياة—لا تُبقيها بلا رد.',
    es: 'Si la vida te manda señal, no la dejes en leído.',
    de: 'Wenn das Leben pingt, nicht auf ungelesen lassen.',
    fr: "Quand la vie t'envoie un signal, tu le laisses pas sans réponse.",
    pt: 'Quando a vida manda sinal, não deixa no vácuo.',
  },
}

const locales: ExpressionLocale[] = [
  'en',
  'ja',
  'ko',
  'ar',
  'es',
  'de',
  'fr',
  'pt',
]

/** Flattened streams for marquee bands (each string repeats in the DOM). */
export function buildExpressionStream(lineIndex: number): string {
  const parts = locales
    .map((loc) => expressionByLine[lineIndex]?.[loc])
    .filter(Boolean) as string[]
  const cycle = parts.join(' · ')
  /* Triple cycle per span → more glyphs on screen without extra DOM */
  return `${cycle} · ${cycle} · ${cycle}`
}
