import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * Create SVG donut chart for PDF export
 * @param {Array} segments - Array of {color, percent} objects
 * @returns {SVGElement} SVG element
 */
export function createSVGPie(segments) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '200')
  svg.setAttribute('height', '200')
  svg.setAttribute('viewBox', '0 0 200 200')
  svg.style.position = 'absolute'
  svg.style.top = '0'
  svg.style.left = '0'
  svg.style.width = '100%'
  svg.style.height = '100%'
  svg.style.borderRadius = '50%'
  
  const outerRadius = 100
  const innerRadius = 65 // Creates donut effect
  let currentAngle = -90 // Start from top
  
  segments.forEach(segment => {
    const { percent, color } = segment
    const angle = (percent / 100) * 360
    const endAngle = currentAngle + angle
    
    // Outer arc points
    const startOuterX = 100 + outerRadius * Math.cos((currentAngle * Math.PI) / 180)
    const startOuterY = 100 + outerRadius * Math.sin((currentAngle * Math.PI) / 180)
    const endOuterX = 100 + outerRadius * Math.cos((endAngle * Math.PI) / 180)
    const endOuterY = 100 + outerRadius * Math.sin((endAngle * Math.PI) / 180)
    
    // Inner arc points
    const startInnerX = 100 + innerRadius * Math.cos((currentAngle * Math.PI) / 180)
    const startInnerY = 100 + innerRadius * Math.sin((currentAngle * Math.PI) / 180)
    const endInnerX = 100 + innerRadius * Math.cos((endAngle * Math.PI) / 180)
    const endInnerY = 100 + innerRadius * Math.sin((endAngle * Math.PI) / 180)
    
    const largeArc = angle > 180 ? 1 : 0
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    // Create donut segment path
    const pathData = [
      `M ${startOuterX} ${startOuterY}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${endOuterX} ${endOuterY}`,
      `L ${endInnerX} ${endInnerY}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${startInnerX} ${startInnerY}`,
      `Z`
    ].join(' ')
    
    path.setAttribute('d', pathData)
    path.setAttribute('fill', color)
    svg.appendChild(path)
    
    currentAngle = endAngle
  })
  
  // Add white center circle for donut effect
  const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  centerCircle.setAttribute('cx', '100')
  centerCircle.setAttribute('cy', '100')
  centerCircle.setAttribute('r', innerRadius.toString())
  centerCircle.setAttribute('fill', 'white')
  svg.appendChild(centerCircle)
  
  return svg
}

/**
 * Replace CSS pie charts with SVG for PDF export
 * @param {HTMLElement} element - Container element
 * @returns {Object} - { svgElements, originalStyles } for cleanup
 */
export function replacePieChartsWithSVG(element) {
  const pieCharts = element.querySelectorAll('.pie-chart-mini-inner')
  const svgElements = []
  const pieOriginalStyles = []
  
  pieCharts.forEach((pie) => {
    // Extract segments from the legend
    const comparisonItem = pie.closest('.pie-comparison-item')
    if (!comparisonItem) return
    
    const legendItems = comparisonItem.querySelectorAll('.legend-item-mini')
    const segments = []
    
    legendItems.forEach(item => {
      const colorDiv = item.querySelector('.legend-color-mini')
      const textElement = item.querySelector('.legend-text-mini')
      
      if (!colorDiv || !textElement) return
      
      const text = textElement.textContent
      const percentMatch = text.match(/\((\d+\.?\d*)%\)/)
      
      if (percentMatch) {
        segments.push({
          color: window.getComputedStyle(colorDiv).backgroundColor || colorDiv.style.background,
          percent: parseFloat(percentMatch[1])
        })
      }
    })
    
    // Only create SVG if we have segments
    if (segments.length > 0) {
      pieOriginalStyles.push(pie.style.cssText)
      pie.style.position = 'relative'
      
      const svg = createSVGPie(segments)
      svg.style.zIndex = '0'
      
      // Insert SVG as first child so it's behind the center text
      pie.insertBefore(svg, pie.firstChild)
      svgElements.push({ pie, svg })
      
      // Hide the gradient background and ensure center text is visible
      pie.style.background = 'transparent'
      
      // Make sure center content is above the SVG
      const centerElement = pie.querySelector('.pie-chart-center-mini')
      if (centerElement) {
        centerElement.style.position = 'relative'
        centerElement.style.zIndex = '1'
      }
    }
  })

  return { svgElements, pieOriginalStyles }
}

/**
 * Restore original pie chart styles
 * @param {Array} svgElements - Array of {pie, svg} objects
 * @param {Array} originalStyles - Array of original CSS text
 */
export function restorePieCharts(svgElements, originalStyles) {
  svgElements.forEach(({ pie, svg }, index) => {
    pie.removeChild(svg)
    pie.style.cssText = originalStyles[index]
  })
}

/**
 * Capture element as image and add to PDF
 * @param {HTMLElement} element - Element to capture
 * @param {jsPDF} pdf - PDF instance
 * @param {boolean} isFirstPage - Whether this is the first page
 * @returns {Promise<void>}
 */
async function captureAndAddToPDF(element, pdf, isFirstPage = false) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowHeight: element.scrollHeight
  })
  
  const imgData = canvas.toDataURL('image/png')
  const imgWidth = canvas.width
  const imgHeight = canvas.height
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const ratio = pdfWidth / imgWidth
  const scaledHeight = imgHeight * ratio
  
  if (!isFirstPage) {
    pdf.addPage()
  }
  
  if (scaledHeight <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight)
  } else {
    let heightLeft = scaledHeight
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight)
    heightLeft -= pdfHeight
    
    while (heightLeft > 0) {
      position = heightLeft - scaledHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight)
      heightLeft -= pdfHeight
    }
  }
}

/**
 * Export report to PDF with sections
 * @param {Object} params - Export parameters
 */
export async function exportReportToPDF({
  exportRef,
  isChartExpanded,
  isScheduleExpanded,
  isInsuranceExpanded,
  setIsChartExpanded,
  setIsScheduleExpanded,
  setIsInsuranceExpanded,
  setIsExporting
}) {
  if (!exportRef.current) return

  try {
    setIsExporting(true)
    
    // Save current states
    const wasChartExpanded = isChartExpanded
    const wasScheduleExpanded = isScheduleExpanded
    const wasInsuranceExpanded = isInsuranceExpanded

    // Temporarily expand all sections for export
    setIsChartExpanded(true)
    setIsScheduleExpanded(true)
    setIsInsuranceExpanded(true)

    // Wait for state updates to render
    await new Promise(resolve => setTimeout(resolve, 300))

    const element = exportRef.current
    
    // Remove any max-height restrictions temporarily
    const tables = element.querySelectorAll('.amortization-table-wrapper')
    const originalTableStyles = []
    tables.forEach(table => {
      originalTableStyles.push(table.style.cssText)
      table.style.maxHeight = 'none'
      table.style.overflow = 'visible'
    })

    // Replace CSS pie charts with SVG for PDF export
    const { svgElements, pieOriginalStyles } = replacePieChartsWithSVG(element)

    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Find the chart and schedule sections to split before them
    const allSections = Array.from(element.querySelectorAll('.section'))
    const chartSection = allSections.find(s => s.textContent.includes('Balance Comparison'))
    const scheduleSection = allSections.find(s => s.textContent.includes('Amortization Schedule'))
    
    // Temporarily hide chart and schedule sections
    const chartDisplay = chartSection ? chartSection.style.display : null
    const scheduleDisplay = scheduleSection ? scheduleSection.style.display : null
    
    if (chartSection) chartSection.style.display = 'none'
    if (scheduleSection) scheduleSection.style.display = 'none'
    
    // Capture form sections (everything before charts)
    await captureAndAddToPDF(element, pdf, true)
    
    // Restore sections
    if (chartSection && chartDisplay !== null) chartSection.style.display = chartDisplay
    if (scheduleSection && scheduleDisplay !== null) scheduleSection.style.display = scheduleDisplay
    
    // Add chart section on new page with styling
    if (chartSection) {
      const chartOriginalStyle = chartSection.style.cssText
      chartSection.style.background = 'white'
      chartSection.style.padding = '2rem'
      chartSection.style.borderRadius = '20px'
      chartSection.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
      
      await captureAndAddToPDF(chartSection, pdf, false)
      
      chartSection.style.cssText = chartOriginalStyle
    }
    
    // Add schedule section on new page with styling
    if (scheduleSection) {
      const scheduleOriginalStyle = scheduleSection.style.cssText
      scheduleSection.style.background = 'white'
      scheduleSection.style.padding = '2rem'
      scheduleSection.style.borderRadius = '20px'
      scheduleSection.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
      
      await captureAndAddToPDF(scheduleSection, pdf, false)
      
      scheduleSection.style.cssText = scheduleOriginalStyle
    }

    // Restore original styles
    tables.forEach((table, index) => {
      table.style.cssText = originalTableStyles[index]
    })
    
    // Remove SVG elements and restore pie charts
    restorePieCharts(svgElements, pieOriginalStyles)

    // Restore original states
    setIsChartExpanded(wasChartExpanded)
    setIsScheduleExpanded(wasScheduleExpanded)
    setIsInsuranceExpanded(wasInsuranceExpanded)
    
    // Generate filename with date (format: YYYY-MM-DD)
    const today = new Date()
    const dateString = today.toISOString().split('T')[0]
    const filename = `amortization-plan-${dateString}.pdf`
    
    pdf.save(filename)
    setIsExporting(false)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF. Please try again.')
    setIsExporting(false)
  }
}

