import { createContext, useContext, useState, useEffect } from 'react'

/**
 * Language Context
 */
const LanguageContext = createContext()

/**
 * Available languages with their translations
 */
export const languages = {
  en: { name: 'English', flag: '🇬🇧', code: 'EN' },
  pt: { name: 'Português', flag: '🇵🇹', code: 'PT' },
  fr: { name: 'Français', flag: '🇫🇷', code: 'FR' },
  de: { name: 'Deutsch', flag: '🇩🇪', code: 'DE' },
  es: { name: 'Español', flag: '🇪🇸', code: 'ES' }
}

/**
 * All translations for the application
 */
export const translations = {
  en: {
    // Navigation
    navTitle: 'Mortgage Tools',
    monthlyPaymentCalc: 'Monthly Payment Calculator',
    amortizationCalc: 'Calculate',
    
    // Common
    calculate: 'Calculate',
    reset: 'Reset',
    exportPDF: 'Export to PDF',
    exporting: 'Generating PDF...',
    exportSubtitle: 'This may take a moment for large reports',
    validationError: 'Please fill in all fields with valid numbers',
    pdfFilename: 'amortization-plan',
    
    // Basic Info
    basicInfo: 'Basic Information',
    loanAmount: 'Loan Amount',
    loanTerm: 'Loan Term',
    months: 'months',
    euriborRate: 'Euribor Rate',
    euriborHint: '💡 Euribor rates change frequently.',
    spread: 'Spread',
    
    // Insurance
    insurance: 'Insurance (Optional)',
    lifeInsurance: 'Life Insurance',
    houseInsurance: 'House Insurance',
    perMonth: '€/month',
    
    // Amortization Rules
    amortizationRules: 'Amortization Rules',
    amortizationDesc: 'Add recurring (e.g., every year) or one-time (e.g., month 10 of year 4) extra payments to reduce your loan faster.',
    recalculatePayment: 'Recalculate monthly payment after each extra payment',
    recalculateYes: '✓ Payment decreases each month as balance reduces (you pay less total interest)',
    recalculateNo: '✗ Payment stays fixed, loan finishes earlier (standard mortgage behavior)',
    recurring: 'Recurring',
    oneTime: 'One-time',
    month: 'Month',
    year: 'Year',
    every: 'Every',
    payExtra: 'Pay Extra',
    addRule: '+ Add Rule',
    
    // Results
    monthlyPayment: 'Monthly Payment',
    avgMonthlyPayments: 'Average Monthly Payments (with amortization)',
    avgMonthlyPaymentsWithout: 'Average Monthly Payments (without amortization)',
    totalInterestRate: 'Total Interest Rate',
    totalAmountPaid: 'Total Amount Paid',
    totalInterest: 'Total Interest',
    
    // Payment Breakdown
    paymentBreakdown: 'Payment Breakdown',
    total: 'Total',
    principal: 'Principal',
    interest: 'Interest',
    
    // Balance Comparison
    balanceComparison: 'Balance Comparison',
    balanceDesc: 'Compare how extra amortization payments reduce your loan balance over time.',
    totalPaymentBreakdown: 'Total Payment Breakdown',
    withoutExtraPayments: 'Without Extra Payments',
    withExtraPayments: 'With Extra Payments',
    totalPaid: 'Total Paid',
    extraPayments: 'Extra Payments',
    savesInterest: '💡 Saves',
    inInterest: 'in interest compared to no extra payments',
    
    // Payment Schedule
    paymentSchedule: 'Payment Schedule',
    amortizationSchedule: 'Amortization Schedule',
    yearColumn: 'Year',
    monthColumn: 'Month',
    principalColumn: 'Principal',
    interestColumn: 'Interest',
    insuranceColumn: 'Insurance',
    totalPaymentColumn: 'Total Payment',
    monthlyPaymentColumn: 'Monthly Payment',
    extraAmortColumn: 'Extra Amort.',
    paymentPlusAmortColumn: 'Payment + Amort.',
    balanceColumn: 'Balance',
    totalRow: 'TOTAL',
    
    // Titles
    mortgageCalcTitle: '🏠 Mortgage Calculator',
    mortgageCalcSubtitle: 'Calculate your monthly mortgage payments',
    amortizationCalcTitle: '📊 Amortization Calculator',
    amortizationCalcSubtitle: 'View detailed loan amortization schedule',
    
    // Other
    years: 'years'
  },
  
  pt: {
    // Navigation
    navTitle: 'Ferramentas de Crédito',
    monthlyPaymentCalc: 'Calculadora de Prestação Mensal',
    amortizationCalc: 'Calcular',
    
    // Common
    calculate: 'Calcular',
    reset: 'Limpar',
    exportPDF: 'Exportar para PDF',
    exporting: 'A gerar PDF...',
    exportSubtitle: 'Isto pode demorar um momento para relatórios grandes',
    validationError: 'Por favor, preencha todos os campos com números válidos',
    pdfFilename: 'plano-amortizacao',
    
    // Basic Info
    basicInfo: 'Informação Básica',
    loanAmount: 'Montante do Empréstimo',
    loanTerm: 'Prazo do Empréstimo',
    months: 'meses',
    euriborRate: 'Taxa Euribor',
    euriborHint: '💡 As taxas Euribor mudam frequentemente.',
    spread: 'Spread',
    
    // Insurance
    insurance: 'Seguros (Opcional)',
    lifeInsurance: 'Seguro de Vida',
    houseInsurance: 'Seguro de Casa',
    perMonth: '€/mês',
    
    // Amortization Rules
    amortizationRules: 'Regras de Amortização',
    amortizationDesc: 'Adicione pagamentos extra recorrentes (ex: todos os anos) ou únicos (ex: mês 10 do ano 4) para reduzir o empréstimo mais rapidamente.',
    recalculatePayment: 'Recalcular prestação mensal após cada pagamento extra',
    recalculateYes: '✓ A prestação diminui cada mês à medida que o saldo reduz (paga menos juros totais)',
    recalculateNo: '✗ A prestação mantém-se fixa, o empréstimo termina mais cedo (comportamento padrão)',
    recurring: 'Recorrente',
    oneTime: 'Único',
    month: 'Mês',
    year: 'Ano',
    every: 'A cada',
    payExtra: 'Pagar Extra',
    addRule: '+ Adicionar Regra',
    
    // Results
    monthlyPayment: 'Prestação Mensal',
    avgMonthlyPayments: 'Prestações Mensais Médias (com amortização)',
    avgMonthlyPaymentsWithout: 'Prestações Mensais Médias (sem amortização)',
    totalInterestRate: 'Taxa de Juro Total',
    totalAmountPaid: 'Montante Total Pago',
    totalInterest: 'Juros Totais',
    
    // Payment Breakdown
    paymentBreakdown: 'Distribuição do Pagamento',
    total: 'Total',
    principal: 'Capital',
    interest: 'Juros',
    
    // Balance Comparison
    balanceComparison: 'Comparação de Saldo',
    balanceDesc: 'Compare como os pagamentos de amortização extra reduzem o saldo do empréstimo ao longo do tempo.',
    totalPaymentBreakdown: 'Distribuição Total de Pagamento',
    withoutExtraPayments: 'Sem Pagamentos Extra',
    withExtraPayments: 'Com Pagamentos Extra',
    totalPaid: 'Total Pago',
    extraPayments: 'Pagamentos Extra',
    savesInterest: '💡 Poupa',
    inInterest: 'em juros comparado a sem pagamentos extra',
    
    // Payment Schedule
    paymentSchedule: 'Plano de Pagamentos',
    amortizationSchedule: 'Plano de Amortização',
    yearColumn: 'Ano',
    monthColumn: 'Mês',
    principalColumn: 'Capital',
    interestColumn: 'Juros',
    insuranceColumn: 'Seguros',
    totalPaymentColumn: 'Pagamento Total',
    monthlyPaymentColumn: 'Prestação Mensal',
    extraAmortColumn: 'Amort. Extra',
    paymentPlusAmortColumn: 'Prestação + Amort.',
    balanceColumn: 'Saldo',
    totalRow: 'TOTAL',
    
    // Titles
    mortgageCalcTitle: '🏠 Calculadora de Crédito',
    mortgageCalcSubtitle: 'Calcule as suas prestações mensais',
    amortizationCalcTitle: '📊 Calculadora de Amortização',
    amortizationCalcSubtitle: 'Veja o plano detalhado de amortização',
    
    // Other
    years: 'anos'
  },
  
  fr: {
    // Navigation
    navTitle: 'Outils de Crédit',
    monthlyPaymentCalc: 'Calculateur de Paiement Mensuel',
    amortizationCalc: 'Calculer',
    
    // Common
    calculate: 'Calculer',
    reset: 'Réinitialiser',
    exportPDF: 'Exporter en PDF',
    exporting: 'Génération du PDF...',
    exportSubtitle: 'Cela peut prendre un moment pour les grands rapports',
    validationError: 'Veuillez remplir tous les champs avec des nombres valides',
    pdfFilename: 'plan-amortissement',
    
    // Basic Info
    basicInfo: 'Informations de Base',
    loanAmount: 'Montant du Prêt',
    loanTerm: 'Durée du Prêt',
    months: 'mois',
    euriborRate: 'Taux Euribor',
    euriborHint: '💡 Les taux Euribor changent fréquemment.',
    spread: 'Spread',
    
    // Insurance
    insurance: 'Assurance (Optionnel)',
    lifeInsurance: 'Assurance Vie',
    houseInsurance: 'Assurance Habitation',
    perMonth: '€/mois',
    
    // Amortization Rules
    amortizationRules: 'Règles d\'Amortissement',
    amortizationDesc: 'Ajoutez des paiements supplémentaires récurrents (ex: chaque année) ou uniques (ex: mois 10 de l\'année 4) pour réduire votre prêt plus rapidement.',
    recalculatePayment: 'Recalculer le paiement mensuel après chaque paiement supplémentaire',
    recalculateYes: '✓ Le paiement diminue chaque mois à mesure que le solde diminue (vous payez moins d\'intérêts totaux)',
    recalculateNo: '✗ Le paiement reste fixe, le prêt se termine plus tôt (comportement hypothécaire standard)',
    recurring: 'Récurrent',
    oneTime: 'Unique',
    month: 'Mois',
    year: 'Année',
    every: 'Tous les',
    payExtra: 'Payer Extra',
    addRule: '+ Ajouter une Règle',
    
    // Results
    monthlyPayment: 'Paiement Mensuel',
    avgMonthlyPayments: 'Paiements Mensuels Moyens (avec amortissement)',
    avgMonthlyPaymentsWithout: 'Paiements Mensuels Moyens (sans amortissement)',
    totalInterestRate: 'Taux d\'Intérêt Total',
    totalAmountPaid: 'Montant Total Payé',
    totalInterest: 'Intérêts Totaux',
    
    // Payment Breakdown
    paymentBreakdown: 'Répartition du Paiement',
    total: 'Total',
    principal: 'Capital',
    interest: 'Intérêts',
    
    // Balance Comparison
    balanceComparison: 'Comparaison du Solde',
    balanceDesc: 'Comparez comment les paiements d\'amortissement supplémentaires réduisent votre solde de prêt au fil du temps.',
    totalPaymentBreakdown: 'Répartition Totale des Paiements',
    withoutExtraPayments: 'Sans Paiements Supplémentaires',
    withExtraPayments: 'Avec Paiements Supplémentaires',
    totalPaid: 'Total Payé',
    extraPayments: 'Paiements Supplémentaires',
    savesInterest: '💡 Économise',
    inInterest: 'd\'intérêts par rapport à aucun paiement supplémentaire',
    
    // Payment Schedule
    paymentSchedule: 'Échéancier de Paiement',
    amortizationSchedule: 'Tableau d\'Amortissement',
    yearColumn: 'Année',
    monthColumn: 'Mois',
    principalColumn: 'Capital',
    interestColumn: 'Intérêts',
    insuranceColumn: 'Assurance',
    totalPaymentColumn: 'Paiement Total',
    monthlyPaymentColumn: 'Paiement Mensuel',
    extraAmortColumn: 'Amort. Extra',
    paymentPlusAmortColumn: 'Paiement + Amort.',
    balanceColumn: 'Solde',
    totalRow: 'TOTAL',
    
    // Titles
    mortgageCalcTitle: '🏠 Calculateur Hypothécaire',
    mortgageCalcSubtitle: 'Calculez vos paiements hypothécaires mensuels',
    amortizationCalcTitle: '📊 Calculateur d\'Amortissement',
    amortizationCalcSubtitle: 'Consultez le calendrier d\'amortissement détaillé',
    
    // Other
    years: 'ans'
  },
  
  de: {
    // Navigation
    navTitle: 'Hypotheken-Tools',
    monthlyPaymentCalc: 'Monatszahlungsrechner',
    amortizationCalc: 'Berechnen',
    
    // Common
    calculate: 'Berechnen',
    reset: 'Zurücksetzen',
    exportPDF: 'Als PDF exportieren',
    exporting: 'PDF wird erstellt...',
    exportSubtitle: 'Dies kann bei großen Berichten einen Moment dauern',
    validationError: 'Bitte füllen Sie alle Felder mit gültigen Zahlen aus',
    pdfFilename: 'tilgungsplan',
    
    // Basic Info
    basicInfo: 'Grundinformationen',
    loanAmount: 'Darlehensbetrag',
    loanTerm: 'Darlehenslaufzeit',
    months: 'Monate',
    euriborRate: 'Euribor-Satz',
    euriborHint: '💡 Euribor-Sätze ändern sich häufig.',
    spread: 'Aufschlag',
    
    // Insurance
    insurance: 'Versicherung (Optional)',
    lifeInsurance: 'Lebensversicherung',
    houseInsurance: 'Wohngebäudeversicherung',
    perMonth: '€/Monat',
    
    // Amortization Rules
    amortizationRules: 'Tilgungsregeln',
    amortizationDesc: 'Fügen Sie wiederkehrende (z.B. jedes Jahr) oder einmalige (z.B. Monat 10 des Jahres 4) Sonderzahlungen hinzu, um Ihr Darlehen schneller zu reduzieren.',
    recalculatePayment: 'Monatliche Zahlung nach jeder Sonderzahlung neu berechnen',
    recalculateYes: '✓ Die Zahlung sinkt jeden Monat, wenn sich der Saldo verringert (Sie zahlen weniger Gesamtzinsen)',
    recalculateNo: '✗ Die Zahlung bleibt fest, das Darlehen endet früher (Standard-Hypothekenverhalten)',
    recurring: 'Wiederkehrend',
    oneTime: 'Einmalig',
    month: 'Monat',
    year: 'Jahr',
    every: 'Alle',
    payExtra: 'Extra Zahlen',
    addRule: '+ Regel hinzufügen',
    
    // Results
    monthlyPayment: 'Monatliche Zahlung',
    avgMonthlyPayments: 'Durchschnittliche monatliche Zahlungen (mit Tilgung)',
    avgMonthlyPaymentsWithout: 'Durchschnittliche monatliche Zahlungen (ohne Tilgung)',
    totalInterestRate: 'Gesamtzinssatz',
    totalAmountPaid: 'Gesamtbetrag bezahlt',
    totalInterest: 'Gesamtzinsen',
    
    // Payment Breakdown
    paymentBreakdown: 'Zahlungsaufteilung',
    total: 'Gesamt',
    principal: 'Kapital',
    interest: 'Zinsen',
    
    // Balance Comparison
    balanceComparison: 'Saldovergleich',
    balanceDesc: 'Vergleichen Sie, wie Sondertilgungen Ihren Darlehenssaldo im Laufe der Zeit reduzieren.',
    totalPaymentBreakdown: 'Gesamtzahlungsaufteilung',
    withoutExtraPayments: 'Ohne Sonderzahlungen',
    withExtraPayments: 'Mit Sonderzahlungen',
    totalPaid: 'Gesamt Bezahlt',
    extraPayments: 'Sonderzahlungen',
    savesInterest: '💡 Spart',
    inInterest: 'an Zinsen im Vergleich zu keinen Sonderzahlungen',
    
    // Payment Schedule
    paymentSchedule: 'Zahlungsplan',
    amortizationSchedule: 'Tilgungsplan',
    yearColumn: 'Jahr',
    monthColumn: 'Monat',
    principalColumn: 'Kapital',
    interestColumn: 'Zinsen',
    insuranceColumn: 'Versicherung',
    totalPaymentColumn: 'Gesamtzahlung',
    monthlyPaymentColumn: 'Monatliche Zahlung',
    extraAmortColumn: 'Extra Tilg.',
    paymentPlusAmortColumn: 'Zahlung + Tilg.',
    balanceColumn: 'Saldo',
    totalRow: 'GESAMT',
    
    // Titles
    mortgageCalcTitle: '🏠 Hypothekenrechner',
    mortgageCalcSubtitle: 'Berechnen Sie Ihre monatlichen Hypothekenzahlungen',
    amortizationCalcTitle: '📊 Tilgungsrechner',
    amortizationCalcSubtitle: 'Detaillierten Tilgungsplan anzeigen',
    
    // Other
    years: 'Jahre'
  },
  
  es: {
    // Navigation
    navTitle: 'Herramientas Hipotecarias',
    monthlyPaymentCalc: 'Calculadora de Pago Mensual',
    amortizationCalc: 'Calcular',
    
    // Common
    calculate: 'Calcular',
    reset: 'Restablecer',
    exportPDF: 'Exportar a PDF',
    exporting: 'Generando PDF...',
    exportSubtitle: 'Esto puede tardar un momento para informes grandes',
    validationError: 'Por favor, complete todos los campos con números válidos',
    pdfFilename: 'plan-amortizacion',
    
    // Basic Info
    basicInfo: 'Información Básica',
    loanAmount: 'Monto del Préstamo',
    loanTerm: 'Plazo del Préstamo',
    months: 'meses',
    euriborRate: 'Tasa Euribor',
    euriborHint: '💡 Las tasas Euribor cambian frecuentemente.',
    spread: 'Diferencial',
    
    // Insurance
    insurance: 'Seguros (Opcional)',
    lifeInsurance: 'Seguro de Vida',
    houseInsurance: 'Seguro de Hogar',
    perMonth: '€/mes',
    
    // Amortization Rules
    amortizationRules: 'Reglas de Amortización',
    amortizationDesc: 'Agregue pagos extra recurrentes (ej: cada año) o únicos (ej: mes 10 del año 4) para reducir su préstamo más rápido.',
    recalculatePayment: 'Recalcular pago mensual después de cada pago extra',
    recalculateYes: '✓ El pago disminuye cada mes a medida que el saldo se reduce (paga menos intereses totales)',
    recalculateNo: '✗ El pago se mantiene fijo, el préstamo termina antes (comportamiento hipotecario estándar)',
    recurring: 'Recurrente',
    oneTime: 'Único',
    month: 'Mes',
    year: 'Año',
    every: 'Cada',
    payExtra: 'Pagar Extra',
    addRule: '+ Agregar Regla',
    
    // Results
    monthlyPayment: 'Pago Mensual',
    avgMonthlyPayments: 'Pagos Mensuales Promedio (con amortización)',
    avgMonthlyPaymentsWithout: 'Pagos Mensuales Promedio (sin amortización)',
    totalInterestRate: 'Tasa de Interés Total',
    totalAmountPaid: 'Monto Total Pagado',
    totalInterest: 'Intereses Totales',
    
    // Payment Breakdown
    paymentBreakdown: 'Desglose del Pago',
    total: 'Total',
    principal: 'Capital',
    interest: 'Intereses',
    
    // Balance Comparison
    balanceComparison: 'Comparación de Saldo',
    balanceDesc: 'Compare cómo los pagos de amortización extra reducen el saldo de su préstamo con el tiempo.',
    totalPaymentBreakdown: 'Desglose Total de Pagos',
    withoutExtraPayments: 'Sin Pagos Extra',
    withExtraPayments: 'Con Pagos Extra',
    totalPaid: 'Total Pagado',
    extraPayments: 'Pagos Extra',
    savesInterest: '💡 Ahorra',
    inInterest: 'en intereses comparado con ningún pago extra',
    
    // Payment Schedule
    paymentSchedule: 'Calendario de Pagos',
    amortizationSchedule: 'Tabla de Amortización',
    yearColumn: 'Año',
    monthColumn: 'Mes',
    principalColumn: 'Capital',
    interestColumn: 'Intereses',
    insuranceColumn: 'Seguros',
    totalPaymentColumn: 'Pago Total',
    monthlyPaymentColumn: 'Pago Mensual',
    extraAmortColumn: 'Amort. Extra',
    paymentPlusAmortColumn: 'Pago + Amort.',
    balanceColumn: 'Saldo',
    totalRow: 'TOTAL',
    
    // Titles
    mortgageCalcTitle: '🏠 Calculadora Hipotecaria',
    mortgageCalcSubtitle: 'Calcule sus pagos hipotecarios mensuales',
    amortizationCalcTitle: '📊 Calculadora de Amortización',
    amortizationCalcSubtitle: 'Ver calendario detallado de amortización',
    
    // Other
    years: 'años'
  }
}

/**
 * Language Provider Component
 * Wrap your app with this to provide language context
 */
export function LanguageProvider({ children }) {
  // Initialize from localStorage or default to 'en'
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      return localStorage.getItem('appLanguage') || 'en'
    } catch (error) {
      console.error('Error loading language from localStorage:', error)
      return 'en'
    }
  })

  // Save to localStorage whenever language changes
  useEffect(() => {
    try {
      localStorage.setItem('appLanguage', currentLanguage)
    } catch (error) {
      console.error('Error saving language to localStorage:', error)
    }
  }, [currentLanguage])

  const t = translations[currentLanguage] || translations.en

  const value = {
    currentLanguage,
    setLanguage: setCurrentLanguage,
    t,
    languages
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Custom hook for language management
 * @returns {Object} Current language, translations, and setter function
 */
export function useLanguage() {
  const context = useContext(LanguageContext)
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  
  return context
}

