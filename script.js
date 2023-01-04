const req = new XMLHttpRequest()
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true)
req.onload = () => {
    const dataSet = JSON.parse(req.responseText)

    main(dataSet.data)
}
req.send()

function main(dataSet) {

    //constants
    const w = 600
    const h = 600
    const pad = 70
    const barWidth = (w - 2 * pad) / dataSet.length
    const convertedDates = dataSet.map(d => new Date(d[0]))
    const tooltip = document.querySelector('.tooltip')
    const iframeContainer = document.querySelector('.iframe-container')
    const tooltipLeft = window.getComputedStyle(iframeContainer).width.replace('px', '')
    const tooltipBottom = window.getComputedStyle(iframeContainer).height.replace('px', '')

    //scales
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

    //axes
    const xAxis = d3.axisBottom(xAxisScale)
    d3.select('svg')
        .append('g')
        .attr('transform', 'translate(0, ' + (h - pad) + ')')
        .style("font-size", "12px")
        .call(xAxis)

    const yAxis = d3.axisLeft(yAxisScale)
        .tickFormat(d3.format('d'))
    d3.select('svg')
        .append('g')
        .attr('transform', 'translate(' + (pad) + ',0)')
        .style("font-size", "12px")
        .call(yAxis)

    //title
    d3.select('svg')
        .append("text")
        .attr("x", w / 2)
        .attr("y", pad)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("USA GDP");

    //bars and tooltip
    d3.select('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${w} ${h}`)
        .classed("svg-content", true)
        .selectAll('rect')
        .data(dataSet)
        .enter()
        .append('rect')
        .attr('width', barWidth)
        .attr('height', d => yBarsScale(d[1]))
        .attr('x', (_, i) => xBarsScale(i))
        .attr('y', d => h - pad - yBarsScale(d[1]))
        .on('mouseover', (e, d, i) => {
            tooltip.classList.add('show')
            tooltip.innerHTML = `${d[0]} <br> U$ ${d[1]} billions`
            tooltip.style.left = e.clientX - (tooltipLeft * 0.15) + 'px'
            tooltip.style.top = e.clientY - (tooltipBottom * 0.15) + 'px'
        })
        .on('mouseout', () => tooltip.classList.remove('show'))

    //labels
    d3.select('svg')
        .append("text")
        .attr("transform", "translate(" + (w / 2) + " ," + (h - 25) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Year");

    d3.select('svg')
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(h / 2))
        .attr("y", 19)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Billions of dollars");
}




