const req = new XMLHttpRequest()
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true)
req.onload = () => {
  const dataSet = JSON.parse(req.responseText)
  main(dataSet.data)
}
req.send()

function main(dataSet) {
  const w = 800
  const h = 600
  const pad = 40
  const barWidth = (w - 2 * pad) / dataSet.length
  const convertedDates = dataSet.map(d => new Date(d[0]))
  const tooltip = document.querySelector('#tooltip')

  const xBarsScale = d3.scaleLinear()
                        .domain([0, dataSet.length - 1])
                        .range([pad, w - pad])
  const yBarsScale = d3.scaleLinear()
                       .domain([0, d3.max(dataSet, d => d[1])])
                       .range([0, h - 2 * pad])
  const xAxisScale = d3.scaleTime()
                       .domain([d3.min(convertedDates), d3.max(convertedDates)])
                       .range([pad, w - pad])
  const yAxisScale = d3.scaleLinear()
                       .domain([0, d3.max(dataSet, d => d[1])])
                       .range([h - pad, pad])

  const xAxis = d3.axisBottom(xAxisScale)
  d3.select('svg')
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, ' + (h - pad) + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yAxisScale)
  d3.select('svg')
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + (pad) + ',0)')
    .call(yAxis)

  d3.select('svg')
    .attr('width', w)
    .attr('height', h)
      .selectAll('rect')
      .data(dataSet)
      .enter()
      .append('rect')
      .attr('width', barWidth)
      .attr('height', d => yBarsScale(d[1]))
      .attr('x', (d, i) => xBarsScale(i))
      .attr('y', d => h - pad - yBarsScale(d[1]))
      .attr('data-date', d => d[0])
      .attr('data-gdp', d => d[1])
      .attr('class', 'bar')
      .on('mouseover', (e, d, i) => {
        tooltip.classList.add('show')
        tooltip.innerHTML = `${d[0]} <br> U$ ${d[1]} billions`
        tooltip.setAttribute('data-date', d[0])
        tooltip.style.left = e.pageX - 150 + 'px'
        tooltip.style.top = e.pageY - 100 + 'px'
      })
      .on('mouseout', () => tooltip.classList.remove('show'))
}
      
    

